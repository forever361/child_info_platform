const api = require('../../utils/api.js');
const { getObsItems } = require('../../utils/game_obs_items.js');

const INTERVENE_OPTIONS = [
  '存在安全隐患',
  '幼儿持续尝试但无法突破',
  '幼儿主动求助',
  '幼儿长时间游离',
  '未介入'
];

const STRATEGY_OPTIONS = [
  '平行示范',
  '角色参与',
  '材料支架',
  '情景体验',
  '试误等待',
  '言语启发（提问/建议/描述）',
  '非言语（表情/动作/眼神）'
];

const EFFECTIVENESS_OPTIONS = [
  '非常有效，推动了游戏发展',
  '效果一般，幼儿反应平淡',
  '介入过早/过多，打断了幼儿'
];

const SHARE_OPTIONS = [
  '我组织了游戏后的现场分享',
  '我鼓励幼儿讲述，如"搭了什么""和谁一起玩""为什么湿沙能堆高?"等',
  '我利用照片或作品帮助幼儿回顾',
  '我"一对一倾听"至少1名幼儿的完整讲述，并真实记录其关键想法'
];

const PLAN_OPTIONS = [
  '丰富幼儿相关经验',
  '调整环境、材料',
  '针对个别幼儿（______）进行追踪指导',
  '在分享环节聚焦某个问题深入讨论',
  '其他：'
];

const GAME_TYPE_LIST = [
  '沙水游戏（沙区）',
  '沙水游戏（水区）',
  '沙水游戏（沙水混合区）',
  '其他沙水游戏'
];

const CLASS_LIST_BY_LEVEL = [
  ['小班1班', '小班2班', '小班3班'],
  ['中班1班', '中班2班', '中班3班'],
  ['大班1班', '大班2班', '大班3班']
];

Page({
  data: {
    userName: '',
    obsDate: '',
    classIndex: 0,
    classList: CLASS_LIST_BY_LEVEL[0],
    targetName: '',
    gameTypeIndex: 0,
    gameTypeList: GAME_TYPE_LIST,
    levelIndex: 0,
    levelList: ['小班', '中班', '大班'],

    obsItems: [],

    interveneOptions: INTERVENE_OPTIONS,
    interveneSelected: [false, false, false, false, false],
    strategyOptions: STRATEGY_OPTIONS,
    strategySelected: [false, false, false, false, false, false, false],
    effectivenessOptions: EFFECTIVENESS_OPTIONS,
    effectivenessIndex: -1,
    strategyReason: '',

    shareOptions: SHARE_OPTIONS,
    shareSelected: [false, false, false, false],
    shareRecord: '',

    planOptions: PLAN_OPTIONS,
    planInputs: ['', '', '', '', ''],
    otherPlan: '',
    summary: '',

    photoSlots: [
      { images: [], description: '', analysis: '' },
      { images: [], description: '', analysis: '' },
      { images: [], description: '', analysis: '' }
    ],

    loading: false,
    recordId: null,
    isEdit: false
  },

  onLoad(options) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const user = wx.getStorageSync('user');

    this.setData({
      obsDate: dateStr,
      teacherName: user ? (user.name || user.nickName || '') : '',
      userName: user ? (user.name || user.nickName || '教师') : '教师'
    });

    this.loadObsItemsByLevel(0);

    if (options.id) {
      this.setData({ recordId: options.id, isEdit: true });
      this.loadData(options.id);
    }
  },

  loadObsItemsByLevel(levelIndex) {
    const obsItems = getObsItems('sand_water', levelIndex);
    this.setData({ obsItems, levelIndex });
  },

  onLevelChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      levelIndex: index,
      classList: CLASS_LIST_BY_LEVEL[index],
      classIndex: 0
    });
    this.loadObsItemsByLevel(index);
  },

  onDateChange(e) {
    this.setData({ obsDate: e.detail.value });
  },

  onClassChange(e) {
    this.setData({ classIndex: parseInt(e.detail.value) });
  },

  onGameTypeChange(e) {
    this.setData({ gameTypeIndex: parseInt(e.detail.value) });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  onObsCheck(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const selected = e.detail.value.map(v => parseInt(v));
    const obsItems = [...this.data.obsItems];
    obsItems[index].selected = obsItems[index].options.map((_, i) => selected.includes(i));
    this.setData({ obsItems });
  },

  onInterveneCheck(e) {
    const selected = e.detail.value.map(v => parseInt(v));
    const interveneSelected = this.data.interveneOptions.map((_, i) => selected.includes(i));
    this.setData({ interveneSelected });
  },

  onStrategyCheck(e) {
    const selected = e.detail.value.map(v => parseInt(v));
    const strategySelected = this.data.strategyOptions.map((_, i) => selected.includes(i));
    this.setData({ strategySelected });
  },

  onEffectivenessChange(e) {
    this.setData({ effectivenessIndex: parseInt(e.detail.value) });
  },

  onShareCheck(e) {
    const selected = e.detail.value.map(v => parseInt(v));
    const shareSelected = this.data.shareOptions.map((_, i) => selected.includes(i));
    this.setData({ shareSelected });
  },

  onPlanInput(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const planInputs = [...this.data.planInputs];
    planInputs[index] = e.detail.value;
    this.setData({ planInputs });
  },

  onPlanLineChange(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ [`planInputs[${index}]`]: this.data.planInputs[index] });
  },

  addPhoto(e) {
    const slotIndex = e.currentTarget.dataset.slot;
    const slot = this.data.photoSlots[slotIndex];
    if (slot.images.length >= 9) {
      wx.showToast({ title: '最多9张图片', icon: 'none' });
      return;
    }
    wx.chooseImage({
      count: 9 - slot.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const photoSlots = [...this.data.photoSlots];
        photoSlots[slotIndex].images = [...photoSlots[slotIndex].images, ...res.tempFilePaths];
        this.setData({ photoSlots });
      }
    });
  },

  removePhoto(e) {
    const { slot, img } = e.currentTarget.dataset;
    const photoSlots = [...this.data.photoSlots];
    photoSlots[slot].images.splice(img, 1);
    this.setData({ photoSlots });
  },

  previewImage(e) {
    const { slot, img } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.photoSlots[slot].images[img],
      urls: this.data.photoSlots[slot].images
    });
  },

  onSlotInput(e) {
    const { slot, field } = e.currentTarget.dataset;
    const photoSlots = [...this.data.photoSlots];
    photoSlots[slot][field] = e.detail.value;
    this.setData({ photoSlots });
  },

  async loadData(id) {
    try {
      const res = await api.getObservation(id);
      const obs = res.observation;

      let obsData = {};
      try {
        obsData = JSON.parse(obs.obs_data || '{}');
      } catch (e) {}

      const gameTypeIndex = this.data.gameTypeList.indexOf(obsData.gameType || '');
      const levelIndex = this.data.levelList.indexOf(obsData.level || '小班');
      const classListForLevel = CLASS_LIST_BY_LEVEL[levelIndex] || CLASS_LIST_BY_LEVEL[0];
      const classIndex = classListForLevel.indexOf(obs.class_name || '');
      const obsDate = obs.observation_date ? obs.observation_date.slice(0, 10) : this.data.obsDate;

      const obsItems = getObsItems('sand_water', levelIndex);
      if (obsData.obsItems && obsData.obsItems.length > 0) {
        obsData.obsItems.forEach((saved, i) => {
          if (obsItems[i] && saved.selected) {
            obsItems[i].selected = saved.selected;
          }
        });
      }

      const IMAGE_BASE = 'https://aixint.cn';
      let photoSlots = JSON.parse(JSON.stringify(this.data.photoSlots));
      if (obsData.photoSlots && obsData.photoSlots.length > 0) {
        photoSlots = obsData.photoSlots.map(slot => ({
          ...slot,
          images: (slot.images || []).map(img =>
            img.startsWith('http') ? img : IMAGE_BASE + img
          )
        }));
      }

      this.setData({
        teacherName: obsData.teacherName || '',
        targetName: obs.target_name || '',
        classList: classListForLevel,
        classIndex: classIndex >= 0 ? classIndex : 0,
        obsDate,
        gameTypeIndex: gameTypeIndex >= 0 ? gameTypeIndex : 0,
        levelIndex: levelIndex >= 0 ? levelIndex : 0,
        obsItems,
        interveneSelected: obsData.interveneSelected || [false, false, false, false, false],
        strategySelected: obsData.strategySelected || [false, false, false, false, false, false, false],
        effectivenessIndex: obsData.effectivenessIndex !== undefined ? obsData.effectivenessIndex : -1,
        shareSelected: obsData.shareSelected || [false, false, false, false],
        planInputs: obsData.planInputs || ['', '', '', '', ''],
        strategyReason: obsData.strategyReason || '',
        shareRecord: obsData.shareRecord || '',
        otherPlan: obsData.otherPlan || '',
        summary: obsData.summary || '',
        photoSlots
      });
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  async handleSave() {
    const { targetName, classIndex, obsDate, photoSlots } = this.data;

    if (!targetName.trim()) {
      return wx.showToast({ title: '请输入观察对象', icon: 'none' });
    }

    this.setData({ loading: true });

    try {
      const IMAGE_BASE = 'https://aixint.cn';
      const uploadedPhotoSlots = await Promise.all(photoSlots.map(async (slot) => {
        if (!slot.images || slot.images.length === 0) {
          return slot;
        }
        const uploadedImages = await Promise.all(slot.images.map(async (img) => {
          if (img.startsWith('http://tmp') || img.startsWith('wxfile://') || !img.startsWith('http')) {
            try {
              return await api.uploadImage(img);
            } catch (e) {
              return img;
            }
          }
          return img;
        }));
        return { ...slot, images: uploadedImages };
      }));

      const data = {
        record_type: 'sand_water',
        class_name: this.data.classList[classIndex],
        target_name: targetName,
        observation_date: obsDate,
        obs_data: JSON.stringify({
          teacherName: this.data.teacherName,
          gameType: this.data.gameTypeList[this.data.gameTypeIndex],
          level: this.data.levelList[this.data.levelIndex],
          obsItems: this.data.obsItems,
          interveneOptions: this.data.interveneOptions,
          interveneSelected: this.data.interveneSelected,
          strategyOptions: this.data.strategyOptions,
          strategySelected: this.data.strategySelected,
          effectivenessOptions: this.data.effectivenessOptions,
          effectivenessIndex: this.data.effectivenessIndex,
          strategyReason: this.data.strategyReason,
          shareOptions: this.data.shareOptions,
          shareSelected: this.data.shareSelected,
          shareRecord: this.data.shareRecord,
          planOptions: this.data.planOptions,
          planInputs: this.data.planInputs,
          otherPlan: this.data.otherPlan,
          summary: this.data.summary,
          photoSlots: uploadedPhotoSlots
        })
      };

      if (this.data.isEdit) {
        await api.updateObservation(this.data.recordId, data);
      } else {
        await api.createObservation(data, []);
      }

      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => { wx.navigateBack(); }, 1000);
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  async handleExport() {
    if (!this.data.recordId) {
      return wx.showToast({ title: '请先保存记录再导出', icon: 'none' });
    }
    wx.showLoading({ title: '正在导出...' });
    try {
      const token = wx.getStorageSync('token');
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://aixint.cn/api/export/building-word/' + this.data.recordId,
          method: 'POST',
          header: { Authorization: `Bearer ${token}` },
          success: (r) => r.statusCode === 200 ? resolve(r.data) : reject(new Error(r.data.error || '导出失败')),
          fail: reject
        });
      });
      wx.hideLoading();
      if (res.success && res.file) {
        wx.showToast({ title: '导出成功', icon: 'success' });
        wx.downloadFile({
          url: 'https://aixint.cn' + res.file,
          success: (dl) => {
            wx.saveFile({
              tempFilePath: dl.tempFilePath,
              success: (saveRes) => {
                wx.openDocument({
                  filePath: saveRes.savedFilePath,
                  showMenu: true,
                  success: () => {},
                  fail: () => wx.showToast({ title: '文件已保存，可在文件夹中查看', icon: 'none' })
                });
              },
              fail: () => wx.showToast({ title: '保存失败', icon: 'none' })
            });
          },
          fail: () => wx.showToast({ title: '下载失败', icon: 'none' })
        });
      } else {
        wx.showToast({ title: res.error || '导出失败', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err.message || '导出失败', icon: 'none' });
    }
  }
});
