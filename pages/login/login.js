Page({
  data: {
    loading: false,
    showInviteModal: false,
    inviteCode: '',
    inviteError: '',
    inviteLoading: false,
    _pendingCode: null,
    _pendingUserInfo: null
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
          this._pendingCode = res.code;
          this._pendingUserInfo = e.detail.userInfo;
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

  doLogin(code, userInfo, inviteCode) {
    wx.request({
      url: 'https://aixint.cn/api/auth/login',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        code,
        userInfo: {
          name: userInfo.nickName || '教师',
          avatar: userInfo.avatarUrl
        },
        invite_code: inviteCode || undefined
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
        } else if (res.data && res.data.code === 'INVITE_CODE_INVALID') {
          // 新用户但邀请码无效，弹出输入框
          this.setData({ showInviteModal: true, inviteError: '', inviteCode: '' });
        } else {
          wx.showToast({ title: res.data?.error || '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  onInviteMaskTap() {
    // 点击遮罩不关闭（防止误点）
  },

  hideInviteModal() {
    this.setData({ showInviteModal: false, inviteCode: '', inviteError: '' });
  },

  onInviteInput(e) {
    this.setData({ inviteCode: e.detail.value, inviteError: '' });
  },

  submitInviteCode() {
    const { inviteCode, _pendingCode, _pendingUserInfo } = this.data;
    if (!inviteCode || !inviteCode.trim()) {
      this.setData({ inviteError: '请输入邀请码' });
      return;
    }

    this.setData({ inviteLoading: true, inviteError: '' });

    // 用邀请码重新登录
    wx.request({
      url: 'https://aixint.cn/api/auth/login',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        code: _pendingCode,
        userInfo: {
          name: _pendingUserInfo?.nickName || '教师',
          avatar: _pendingUserInfo?.avatarUrl || ''
        },
        invite_code: inviteCode.trim()
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
          this.setData({ inviteError: res.data?.error || '邀请码无效' });
        }
      },
      fail: () => {
        this.setData({ inviteError: '网络错误，请重试' });
      },
      complete: () => {
        this.setData({ inviteLoading: false });
      }
    });
  }
});
