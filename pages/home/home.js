const api = require('../../utils/api.js');

const formatDate = (dateStr, addEightHours = true) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (addEightHours) {
      d.setHours(d.getHours() + 8);
    }
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch (e) {
    return dateStr;
  }
};

Page({
  data: {
    list: [],
    page: 1,
    limit: 20,
    loading: false,
    noMore: false,
    user: null,
    openid: '',
    openidMask: '',
    searchName: '',
    recordType: '',
    classFilterIndex: 0,
    classFilterList: ['全部班级', '小班1班', '小班2班', '中班1班', '中班2班', '大班1班', '大班2班'],
    typeFilterList: [
      { value: '', label: '游戏类型' },
      { value: 'building_obs', label: '建构游戏' },
      { value: 'role_play', label: '角色游戏' },
      { value: 'science', label: '科学探究区' },
      { value: 'sand_water', label: '沙水游戏' }
    ]
  },

  onLoad() {
    const user = wx.getStorageSync('user');
    const openid = wx.getStorageSync('openid') || '';
    const openidMask = openid ? '*' + openid.slice(-4) : '';
    this.setData({ user, openid, openidMask, currentTypeLabel: '游戏类型' });
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
      if (this.data.classFilterIndex > 0) {
        params.class_name = this.data.classFilterList[this.data.classFilterIndex];
      }

      const res = await api.getObservations(params);
      const newList = (this.data.page === 1 ? res.list : [...this.data.list, ...res.list]).map(item => {
        let summary = item.content || '';
        // building_obs 类型：从 obs_data 生成摘要
        if (['building_obs', 'role_play', 'science', 'sand_water'].includes(item.record_type) && item.obs_data) {
          try {
            const obsData = JSON.parse(item.obs_data);
            const checkedCount = (obsData.obsItems || []).reduce((sum, it) => 
              sum + (it.selected || []).filter(Boolean).length, 0
            );
            const hasSummary = obsData.summary && obsData.summary.trim();
            const descSnippet = (obsData.photoSlots || [])
              .map(s => s.description)
              .filter(d => d && d.trim())
              .map(d => d.trim().slice(0, 30))
              .join('；');
            if (hasSummary) {
              summary = '[小结] ' + obsData.summary.trim().slice(0, 50);
            } else if (descSnippet) {
              summary = descSnippet + (descSnippet.length >= 30 ? '…' : '');
            } else {
              summary = `[已选${checkedCount}项观察点]`;
            }
          } catch (e) {}
        }
        return {
          ...item,
          observation_date: formatDate(item.observation_date),
          created_at: formatDate(item.created_at, false),
          summary
        };
      });

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

  onClassFilterChange(e) {
    this.setData({ classFilterIndex: e.detail.value, page: 1, list: [], noMore: false });
    this.fetchList();
  },

  onTypeChange(e) {
    const index = parseInt(e.detail.value);
    const label = this.data.typeFilterList[index]?.label || '游戏类型';
    this.setData({ 
      recordType: this.data.typeFilterList[index]?.value || '',
      currentTypeLabel: label,
      page: 1, 
      list: [], 
      noMore: false 
    });
    this.fetchList();
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  goBuildingObs() {
    this.hideAddMenu();
    wx.navigateTo({ url: '/pages/building_obs/building_obs' });
  },

  goRolePlay() {
    this.hideAddMenu();
    wx.navigateTo({ url: '/pages/role_play/role_play' });
  },

  goScienceObs() {
    this.hideAddMenu();
    wx.navigateTo({ url: '/pages/science_obs/science_obs' });
  },

  goSandWaterObs() {
    this.hideAddMenu();
    wx.navigateTo({ url: '/pages/sand_water_obs/sand_water_obs' });
  },

  showAddMenu() {
    this.setData({ showAddMenu: true });
  },

  hideAddMenu() {
    this.setData({ showAddMenu: false });
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
