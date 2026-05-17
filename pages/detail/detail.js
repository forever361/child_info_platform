const api = require('../../utils/api.js');

Page({
  data: {
    observation: null,
    linkedList: [],
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadDetail(id);
    }
  },

  onShow() {
    // 每次显示页面时刷新数据（从编辑页返回时）
    if (this.data.observation && this.data.observation.id) {
      this.loadDetail(this.data.observation.id);
    }
  },

  async loadDetail(id) {
    try {
      const res = await api.getObservation(id);
      const obs = res.observation;
      
      // 后端已解析 images 字段为数组，直接使用
      // 如果是字符串则再解析一次（兼容旧数据）
      let images = obs.images;
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images || '[]');
        } catch (e) {
          images = [];
        }
      }
      // 图片URL需要完整路径才能在小程序显示
      const IMAGE_BASE = 'https://aixint.cn';
      obs.images = (images || []).map(img => 
        img.startsWith('http') ? img : IMAGE_BASE + img
      );

      // 解析分析数据
      let analysisData = null;
      if (obs.analysis_data) {
        try {
          analysisData = JSON.parse(obs.analysis_data);
          // 补充 levelIndex 用于样式
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
          // 图片URL需要完整路径
          const IMAGE_BASE = 'https://aixint.cn';
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

      // 格式化时间（数据库是北京时间，JS默认当UTC所以+8）
      if (obs.observation_date) {
        const d = new Date(obs.observation_date);
        d.setHours(d.getHours() + 8);
        const pad = n => String(n).padStart(2, '0');
        obs.observation_date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
            } catch(e) {}
          }
          item.isCurrent = item.id === obs.id;
          return item;
        });
        this.setData({ linkedList });
      }
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 查看详情
  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 编辑
  goEdit() {
    const obs = this.data.observation;
    if (obs.record_type === 'building_obs') {
      wx.navigateTo({
        url: `/pages/building_obs/building_obs?id=${obs.id}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/record/record?id=${obs.id}`
      });
    }
  },

  // 一键生成成长报告
  generateReport() {
    const obs = this.data.observation;
    wx.navigateTo({
      url: `/pages/report/report?target_name=${encodeURIComponent(obs.target_name)}&class_name=${encodeURIComponent(obs.class_name || obs.user_class)}`
    });
  },

  // 继续观察（创建连续记录，复用对象名和班级）
  continueObserve() {
    const obs = this.data.observation;
    wx.navigateTo({
      url: `/pages/record/record?linkedId=${obs.linked_id}&targetName=${encodeURIComponent(obs.target_name)}&className=${encodeURIComponent(obs.class_name)}`
    });
  },

  // 预览图片
  previewImage(e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({
      urls: this.data.observation.images,
      current: url
    });
  },

  // 删除
  async handleDelete() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.deleteObservation(this.data.observation.id);
            wx.showToast({ title: '删除成功', icon: 'success' });
            setTimeout(() => {
              wx.navigateBack();
            }, 1000);
          } catch (err) {
            wx.showToast({ title: err.message, icon: 'none' });
          }
        }
      }
    });
  }
});
