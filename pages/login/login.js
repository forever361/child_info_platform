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

  handleWxLogin() {
    this.setData({ loading: true });

    wx.login({
      success: (res) => {
        if (res.code) {
          wx.getUserProfile({
            desc: '用于完善用户资料',
            success: (profileRes) => {
              this.doLogin(res.code, profileRes.userInfo);
            },
            fail: () => {
              this.doLogin(res.code, { nickName: '教师' });
            }
          });
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
      url: 'http://8.134.189.98:3000/api/auth/login',
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
          wx.showToast({ title: '登录成功', icon: 'success' });
          setTimeout(() => {
          wx.navigateTo({ url: '/pages/home/home' });
        }, 1000);
        } else {
          wx.showToast({ title: res.data.error || '登录失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  }
});
