const api = require('../../utils/api.js');

Page({
  data: {
    list: [],
    page: 1,
    limit: 20,
    loading: false,
    noMore: false,
    user: null,
    searchName: '',
    recordType: ''
  },

  onLoad() {
    const user = wx.getStorageSync('user');
    const openid = wx.getStorageSync('openid') || '';
    this.setData({ user, openid });
    this.fetchList();
  },

  onShow() {
    this.setData({ page: 1, list: [], noMore: false });
    this.fetchList();
  },

  async fetchList() {
    if (this.data.loading || this.data.noMore) return;

    this.setData({ loading: true });
    try {
      const params = {
        page: this.data.page,
        limit: this.data.limit
      };
      if (this.data.searchName) params.target_name = this.data.searchName;
      if (this.data.recordType) params.record_type = this.data.recordType;

      const res = await api.getObservations(params);
      const newList = this.data.page === 1 ? res.list : [...this.data.list, ...res.list];

      this.setData({
        list: newList,
        noMore: res.list.length < this.data.limit
      });
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onReachBottom() {
    if (!this.data.noMore) {
      this.setData({ page: this.data.page + 1 });
      this.fetchList();
    }
  },

  onSearch(e) {
    this.setData({ searchName: e.detail.value, page: 1, list: [], noMore: false });
    this.fetchList();
  },

  onTypeChange(e) {
    this.setData({ recordType: e.detail.value, page: 1, list: [], noMore: false });
    this.fetchList();
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  goRecord() {
    wx.navigateTo({ url: '/pages/record/record' });
  },

  handleDelete(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.deleteObservation(id);
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.setData({ page: 1, list: [], noMore: false });
            this.fetchList();
          } catch (err) {
            wx.showToast({ title: err.message, icon: 'none' });
          }
        }
      }
    });
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('user');
          wx.redirectTo({ url: '/pages/login/login' });
        }
      }
    });
  }
});
