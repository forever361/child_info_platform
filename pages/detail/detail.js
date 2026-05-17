const api = require('../../utils/api.js');

Page({
  data: {
    observation: null,
    analysisData: null,
    buildingObsData: null,
    linkedList: [],
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.loadObservation(options.id);
    }
  },

  onShow() {
    // 从编辑页返回时刷新数据
    if (this.data.observation && this.data.observation.id) {
      this.loadObservation(this.data.observation.id);
    }
  },

  async loadObservation(id) {
    try {
      wx.showLoading({ title: '加载中...' });
      const res = await api.getObservation(id);
      const obs = res.observation;

      // 后端已解析 images 字段为数组，直接使用
      let images = obs.images;
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images || '[]');
        } catch (e) {
          images = [];
        }
      }
      // 图片URL需要完整路径
      const IMAGE_BASE = 'https://aixint.cn';
      obs.images = (images || []).map(img =>
        img.startsWith('http') ? img : IMAGE_BASE + img
      );

      // 格式化时间（数据库是北京时间，JS默认当UTC所以+8）
      if (obs.observation_date) {
        const d = new Date(obs.observation_date);
        d.setHours(d.getHours() + 8);
        const pad = n => String(n).padStart(2, '0');
        obs.observation_date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }

      // 解析分析数据
      let analysisData = null;
      if (obs.analysis_data) {
        try {
          analysisData = JSON.parse(obs.analysis_data);
          if (analysisData.dimensions) {
            const levelMap = { '优秀': 0, '良好': 1, '一般': 2, '需关注': 3 };
            analysisData.dimensions = analysisData.dimensions.map(d => ({
              ...d,
              levelIndex: levelMap[d.level] !== undefined ? levelMap[d.level] : 0
            }));
          }
        } catch (e) {}
      }

      // 解析游戏观察数据 (building_obs)
      let buildingObsData = null;
      if (obs.record_type === 'building_obs' && obs.obs_data) {
        try {
          buildingObsData = JSON.parse(obs.obs_data);
          if (buildingObsData.photoSlots) {
            buildingObsData.photoSlots = buildingObsData.photoSlots.map(slot => ({
              ...slot,
              images: (slot.images || []).map(img =>
                img.startsWith('http') ? img : IMAGE_BASE + img
              )
            }));
          }
        } catch (e) {}
      }

      this.setData({ observation: obs, analysisData, buildingObsData });

      // 加载连续观察记录
      if (obs.linked_id) {
        const linkedRes = await api.getLinkedObservations(obs.linked_id);
        const pad = n => String(n).padStart(2, '0');
        const linkedList = (linkedRes.observations || []).map(item => {
          if (item.observation_date) {
            try {
              const d = new Date(item.observation_date);
              d.setHours(d.getHours() + 8);
              item.observation_date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
            } catch (e) {}
          }
          item.isCurrent = item.id === obs.id;
          return item;
        });
        this.setData({ linkedList });
      }
    } catch (err) {
      wx.showToast({ title: err.message || '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
      wx.hideLoading();
    }
  },

  // 预览图片
  previewImage(e) {
    const { url } = e.currentTarget.dataset;
    let urls = this.data.observation.images || [];
    if (this.data.observation.record_type === 'building_obs' && this.data.buildingObsData && this.data.buildingObsData.photoSlots) {
      urls = this.data.buildingObsData.photoSlots.reduce((all, slot) =>
        [...all, ...(slot.images || [])], []
      );
    }
    wx.previewImage({ urls, current: url });
  },

  // 一键生成成长报告
  async generateReport() {
    const obs = this.data.observation;
    if (!obs) return;
    wx.showLoading({ title: '生成中...' });
    try {
      const token = wx.getStorageSync('token');
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://aixint.cn/api/report/generate/' + obs.id,
          method: 'POST',
          header: { Authorization: 'Bearer ' + token },
          success: (r) => r.statusCode === 200 ? resolve(r.data) : reject(new Error(r.data.error || '生成失败')),
          fail: reject
        });
      });
      wx.hideLoading();
      if (res.success) {
        wx.showModal({
          title: '生成成功',
          content: '成长报告已生成，是否查看？',
          success: (r) => {
            if (r.confirm) {
              wx.navigateTo({ url: '/pages/report/report?id=' + obs.id });
            }
          }
        });
      } else {
        wx.showToast({ title: res.error || '生成失败', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err.message || '生成失败', icon: 'none' });
    }
  },

  // 导出Word
  goExportWord() {
    const obs = this.data.observation;
    if (obs.record_type !== 'building_obs') {
      wx.showToast({ title: '该类型暂不支持导出', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '正在导出...' });
    const token = wx.getStorageSync('token');
    wx.request({
      url: 'https://aixint.cn/api/export/building-word/' + obs.id,
      method: 'POST',
      header: { Authorization: 'Bearer ' + token },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200 && res.data && res.data.success) {
          wx.showToast({ title: '开始下载...', icon: 'none', duration: 1000 });
          const fileUrl = 'https://aixint.cn' + res.data.file;
          wx.downloadFile({
            url: fileUrl,
            success: (dl) => {
              if (dl.statusCode === 200 && dl.tempFilePath) {
                wx.openDocument({
                  filePath: dl.tempFilePath,
                  showMenu: true,
                  success: () => {},
                  fail: () => {
                    wx.saveFile({
                      tempFilePath: dl.tempFilePath,
                      success: (saveRes) => {
                        wx.openDocument({
                          filePath: saveRes.savedFilePath,
                          showMenu: true,
                          success: () => {},
                          fail: () => { wx.showToast({ title: '请在文件夹中查看', icon: 'none' }); }
                        });
                      },
                      fail: () => { wx.showToast({ title: '保存失败', icon: 'none' }); }
                    });
                  }
                });
              } else {
                wx.showToast({ title: '下载失败', icon: 'none' });
              }
            },
            fail: (e) => {
              console.error('downloadFile fail', e);
              wx.showToast({ title: '下载失败，请重试', icon: 'none' });
            }
          });
        } else {
          const errMsg = (res.data && res.data.error) ? res.data.error : '导出失败';
          wx.showToast({ title: errMsg, icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '导出失败', icon: 'none' });
      }
    });
  },

  // 继续观察
  continueObserve() {
    const obs = this.data.observation;
    if (obs.record_type === 'individual') {
      wx.navigateTo({ url: '/pages/record/record?id=' + obs.id });
    } else {
      wx.navigateBack();
    }
  },

  // 查看详情（连续观察列表中的某条）
  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  },

  // 编辑
  goEdit() {
    const obs = this.data.observation;
    if (obs.record_type === 'building_obs') {
      wx.navigateTo({ url: '/pages/building_obs/building_obs?id=' + obs.id });
    } else {
      wx.navigateTo({ url: '/pages/record/record?id=' + obs.id });
    }
  },

  // 删除
  handleDelete() {
    const obs = this.data.observation;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否确认删除？',
      success: (r) => {
        if (r.confirm) {
          this.deleteObservation(obs.id);
        }
      }
    });
  },

  async deleteObservation(id) {
    try {
      wx.showLoading({ title: '删除中...' });
      await api.deleteObservation(id);
      wx.hideLoading();
      wx.showToast({ title: '删除成功', icon: 'success' });
      setTimeout(() => { wx.navigateBack(); }, 1000);
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '删除失败', icon: 'none' });
    }
  }
});
