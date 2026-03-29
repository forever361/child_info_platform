Page({
  data: {
    loading: false
  },

  onLoad() {
    const token = wx.getStorageSync('token');
    if (token) {
      wx.switchTab({ url: '/pages/home/home' });
    }
  },

  onGetUserInfo(e) {
    if (this.data.loading) return;

    if (!e.detail.userInfo) {
      wx.showToast({ title: '需要授权才能登录', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    wx.login({
      success: (res) => {
        if (res.code) {
          this.doLogin(res.code, e.detail.userInfo);
        } else {
          wx.showToast({ title: '登录失败', icon: 'none' });
          this.setData({ loading: false });
        }
      },
      fail: () => {
        wx.showToast({ title: '登录失败', icon: 'none' });
        this.setData({ loading: false });
      }
    });
  },

  doLogin(code, userInfo) {
    wx.request({
      url: 'https://aixint.cn/api/auth/login',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        code,
        userInfo: {
          name: userInfo.nickName || '教师',
          avatar: userInfo.avatarUrl
        }
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.token) {
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('user', res.data.user);
          wx.setStorageSync('openid', res.data.openid);
          wx.showToast({ title: '登录成功', icon: 'success' });
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/home/home' });
          }, 1000);
        } else {
          wx.showToast({ title: res.data.error || '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  }
});
