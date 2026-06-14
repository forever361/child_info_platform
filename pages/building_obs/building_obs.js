const api = require('../../utils/api.js');

// 小班观察项目数据
const OBS_ITEMS_XIAOBAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境：',
    options: [
      '空间规划合理安全',
      '材料投放丰富且有层次（主体材料+辅助材料）',
      '满足幼儿当前建构需求'
    ],
    selected: [false, false, false]
  },
  {
    num: 2,
    title: '我是否关注了幼儿的兴趣与情绪：',
    options: [
      '幼儿对建构活动感兴趣，情绪愉悦',
      '幼儿愿意进入建构区并主动摆弄材料'
    ],
    selected: [false, false]
  },
  {
    num: 3,
    title: '我是否能识别幼儿的建构技能：',
    options: [
      '幼儿尝试使用平铺、垒高、架空、围合等简单技能',
      '幼儿能重复简单的搭建动作'
    ],
    selected: [false, false]
  },
  {
    num: 4,
    title: '我是否关注幼儿材料使用与习惯：',
    options: [
      '幼儿不随意扔摔材料、遵守游戏规则',
      '在教师提醒下能简单归位',
      '幼儿能选择自己感兴趣的材料'
    ],
    selected: [false, false, false]
  },
  {
    num: 5,
    title: '我是否关注了幼儿重点领域的学习与发展：',
    options: [
      '数学：在搭建中感知方位（如能感知上下、前后、里外等方位）',
      '科学：探索和发现材料的特性（如能按一定的规则对材料的形状、颜色有选择地进行建构）',
      '艺术：关注作品的美感（对称）',
      '其他：如形状、数量、分类等'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 6,
    title: '我是否关注了幼儿的学习品质（观察1-2点）：',
    options: [
      '幼儿能专注玩一会儿',
      '遇到小困难愿意再试试',
      '愿意模仿同伴的搭建',
      '能表现表征物主要特征',
      '幼儿开始有"像什么"的简单想象'
    ],
    selected: [false, false, false, false, false]
  }
];

// 中班观察项目数据
const OBS_ITEMS_ZHONGBAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境：',
    options: [
      '空间规划合理安全',
      '材料投放丰富且有层次（主体材料+辅助材料）',
      '满足幼儿当前建构需求'
    ],
    selected: [false, false, false]
  },
  {
    num: 2,
    title: '我是否关注了游戏主题与计划性：',
    options: [
      '幼儿有明确的搭建主题',
      '幼儿能围绕主题持续搭建',
      '幼儿开始出现"先想后做"的迹象'
    ],
    selected: [false, false, false]
  },
  {
    num: 3,
    title: '我是否关注了建构技能与合作：',
    options: [
      '幼儿能运用架空、围合、模式等中班典型技能',
      '幼儿愿意与同伴一起搭建',
      '幼儿能简单分工（如"你拿这个，我搭这里"）'
    ],
    selected: [false, false, false]
  },
  {
    num: 4,
    title: '我是否关注到幼儿重点领域的学习与发展（观察1-2点）：',
    options: [
      '数学：在搭建中感知方位（如能感知中间、旁边等方位）',
      '科学：能根据材料特点有选择地使用（如"这块大的放下面更稳"）',
      '艺术：关注作品的美感（平衡、对称）',
      '其他：如数量关系、分类、排序、测量、稳定性等'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 5,
    title: '我是否关注了幼儿的学习品质：',
    options: [
      '幼儿积极主动参与搭建',
      '遇到困难愿意尝试解决',
      '愿意与同伴合作，尝试协商',
      '创造性使用游戏材料，建构作品比较逼真'
    ],
    selected: [false, false, false, false]
  }
];

// 大班观察项目数据
const OBS_ITEMS_DABAN = [
  {
    num: 1,
    title: '我是否关注了游戏环境：',
    options: [
      '空间规划合理安全',
      '材料投放丰富且有层次（主体材料+辅助材料）',
      '满足幼儿当前建构需求'
    ],
    selected: [false, false, false]
  },
  {
    num: 2,
    title: '我是否关注了游戏计划与目的性：',
    options: [
      '幼儿能事先计划或画出设计图',
      '幼儿能按计划搭建，并在过程中灵活调整',
      '幼儿有明确的搭建主题，并能坚持完成'
    ],
    selected: [false, false, false]
  },
  {
    num: 3,
    title: '我是否关注了建构技能与创造性：',
    options: [
      '幼儿能熟练运用多种建构技能（架空、围合、盖顶、交叉等）',
      '幼儿能关注细节，进行装饰或丰富，建构物逼真、复杂',
      '幼儿能用建构作品进行假想游戏'
    ],
    selected: [false, false, false]
  },
  {
    num: 4,
    title: '我是否关注了合作与分工：',
    options: [
      '幼儿能与同伴共同设计方案',
      '幼儿能协商分工、互相配合',
      '幼儿在合作中能表达自己的想法，也能听取他人意见'
    ],
    selected: [false, false, false]
  },
  {
    num: 5,
    title: '我是否关注重点领域发展（观察1-2点）：',
    options: [
      '数学：能参照设计图搭建，在搭建中使用方位词（如"在我的左边搭高楼，右边搭花园"）',
      '科学：能根据材料特点灵活选择，关注结构的稳定与平衡',
      '艺术：作品有美感，关注对称、比例、均衡',
      '其他：如形体、数量关系、分类、排序、测量、稳定性等'
    ],
    selected: [false, false, false, false]
  },
  {
    num: 6,
    title: '我是否关注幼儿的学习品质：',
    options: [
      '幼儿积极主动、认真专注',
      '遇到困难敢于探究、尝试多种解决方法',
      '能自我反思，提出改进想法'
    ],
    selected: [false, false, false]
  }
];

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
  '我鼓励幼儿讲述，如"搭了什么""和谁一起玩""用了什么材料"等',
  '我利用照片或作品帮助幼儿回顾',
  '我"一对一倾听"至少1名幼儿的完整讲述，并真实记录其关键想法'
];

const PLAN_OPTIONS = [
  '丰富幼儿相关经验',
  '调整环境、材料',
  '针对个别幼儿（______）进行追踪指导',
  '在分享环节聚焦某个问题深入讨论'
];

const GAME_TYPE_LIST = ['建构游戏（积木）', '角色游戏', '表演游戏', '沙水游戏', '艺术创作', '其他游戏'];

// 年龄班对应的班级列表
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
    
    // 观察项目
    obsItems: [],
    
    // 介入指导
    interveneOptions: INTERVENE_OPTIONS,
    interveneSelected: [false, false, false, false, false],
    strategyOptions: STRATEGY_OPTIONS,
    strategySelected: [false, false, false, false, false, false, false],
    effectivenessOptions: EFFECTIVENESS_OPTIONS,
    effectivenessIndex: -1,
    strategyReason: '',
    
    // 回顾分享
    shareOptions: SHARE_OPTIONS,
    shareSelected: [false, false, false, false],
    shareRecord: '',
    
    // 后续计划
    planOptions: PLAN_OPTIONS,
    planInputs: ['', '', '', ''],
    otherPlan: '',
    summary: '',
    
    // 照片插槽
    photoSlots: [
      { images: [], description: '', analysis: '', voicePath: '' },
      { images: [], description: '', analysis: '', voicePath: '' },
      { images: [], description: '', analysis: '', voicePath: '' }
    ],
    
    loading: false,
    recordId: null,
    isEdit: false
  },

  onLoad(options) {
    // 初始化日期
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // 获取当前用户信息
    const user = wx.getStorageSync('user');
    
    this.setData({ 
      obsDate: dateStr,
      teacherName: user ? (user.name || user.nickName || '') : '',
      userName: user ? (user.name || user.nickName || '教师') : '教师'
    });

    // 加载观察项目数据
    this.loadObsItemsByLevel(0);

    // 检查是否编辑
    if (options.id) {
      this.setData({ recordId: options.id, isEdit: true });
      this.loadData(options.id);
    }
  },

  loadObsItemsByLevel(levelIndex) {
    const levelMap = {
      0: OBS_ITEMS_XIAOBAN,
      1: OBS_ITEMS_ZHONGBAN,
      2: OBS_ITEMS_DABAN
    };
    const obsItems = JSON.parse(JSON.stringify(levelMap[levelIndex] || OBS_ITEMS_XIAOBAN));
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
    const index = e.currentTarget.dataset.index;
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
    const value = e.detail.value;
    const planInputs = [...this.data.planInputs];
    planInputs[index] = value;
    this.setData({ planInputs });
  },

  onPlanLineChange(e) {
    // auto-height 在换行时需要触发一次 setData 才会重新计算高度
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ [`planInputs[${index}]`]: this.data.planInputs[index] });
  },

  // 照片操作
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
      
      // 解析观察数据
      let obsData = {};
      try {
        obsData = JSON.parse(obs.obs_data || '{}');
      } catch (e) {}

      // 游戏类型
      const gameTypeIndex = this.data.gameTypeList.indexOf(obsData.gameType || '');
      // 年龄班
      const levelIndex = this.data.levelList.indexOf(obsData.level || '小班');
      // 班级 - 从对应年龄班的列表中查找
      const classListForLevel = CLASS_LIST_BY_LEVEL[levelIndex] || CLASS_LIST_BY_LEVEL[0];
      const classIndex = classListForLevel.indexOf(obs.class_name || '');
      // 日期
      const obsDate = obs.observation_date ? obs.observation_date.slice(0, 10) : this.data.obsDate;

      // 观察项目（根据年龄班加载对应模板，再用已保存的selected状态）
      const levelMap = { 0: OBS_ITEMS_XIAOBAN, 1: OBS_ITEMS_ZHONGBAN, 2: OBS_ITEMS_DABAN };
      let obsItems = JSON.parse(JSON.stringify(levelMap[levelIndex] || OBS_ITEMS_XIAOBAN));
      if (obsData.obsItems && obsData.obsItems.length > 0) {
        obsData.obsItems.forEach((saved, i) => {
          if (obsItems[i] && saved.selected) {
            obsItems[i].selected = saved.selected;
          }
        });
      }

      // 介入选择
      let interveneSelected = [false, false, false, false, false];
      if (obsData.interveneSelected) {
        interveneSelected = obsData.interveneSelected;
      }

      // 策略选择
      let strategySelected = [false, false, false, false, false, false, false];
      if (obsData.strategySelected) {
        strategySelected = obsData.strategySelected;
      }

      // 有效性
      let effectivenessIndex = -1;
      if (obsData.effectivenessIndex !== undefined) {
        effectivenessIndex = obsData.effectivenessIndex;
      }

      // 回顾分享
      let shareSelected = [false, false, false, false];
      if (obsData.shareSelected) {
        shareSelected = obsData.shareSelected;
      }

      // 后续计划
      let planInputs = ['', '', '', ''];
      if (obsData.planInputs) {
        planInputs = obsData.planInputs;
      }

      // 图片插槽（处理图片URL）
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
        interveneSelected,
        strategySelected,
        effectivenessIndex,
        shareSelected,
        planInputs,
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
      // 上传 photoSlots 里的图片，替换临时路径为真实URL
      const IMAGE_BASE = 'https://aixint.cn';
      const uploadedPhotoSlots = await Promise.all(photoSlots.map(async (slot) => {
        if (!slot.images || slot.images.length === 0) {
          return slot;
        }
        const uploadedImages = await Promise.all(slot.images.map(async (img) => {
          // 如果是临时路径或不含域名，才需要上传
          if (img.startsWith('http://tmp') || img.startsWith('wxfile://') || !img.startsWith('http')) {
            try {
              return await api.uploadImage(img);
            } catch (e) {
              return img; // 失败保留原路径
            }
          }
          return img;
        }));
        return { ...slot, images: uploadedImages };
      }));

      const data = {
        record_type: 'building_obs',
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
