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
      const IMAGE_BASE = 'http://8.134.189.98:3000';
      obs.images = (images || []).map(img => 
        img.startsWith('http') ? img : IMAGE_BASE + img
      );
      
      this.setData({ observation: obs });

      // 加载连续观察记录
      if (obs.linked_id) {
        const linkedRes = await api.getLinkedObservations(obs.linked_id);
        this.setData({ linkedList: linkedRes.observations });
      }
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 编辑
  goEdit() {
    wx.navigateTo({
      url: `/pages/record/record?id=${this.data.observation.id}`
    });
  },

  // 继续观察（创建连续记录）
  continueObserve() {
    wx.navigateTo({
      url: `/pages/record/record?linkedId=${this.data.observation.linked_id}`
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
