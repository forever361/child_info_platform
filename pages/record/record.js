const api = require('../../utils/api.js');

// 领域数据（对应《3-6岁儿童学习与发展纲要》）
const DOMAIN_DATA = {
  1: { // 健康领域
    label: '健康领域（含动作与生活）',
    levels: ['优秀', '良好', '一般', '需关注'],
    dimensions: [
      { name: '生活自理', desc: '进餐、盥洗、穿衣、整理物品等习惯' },
      { name: '大肌肉动作', desc: '走、跑、跳、钻、爬、平衡、投掷' },
      { name: '精细动作', desc: '握笔、折纸、串珠、使用工具、手眼协调' },
      { name: '安全与健康', desc: '自我保护意识、情绪稳定、适应集体' }
    ]
  },
  2: { // 语言领域
    label: '语言领域',
    levels: ['优秀', '良好', '一般', '需关注'],
    dimensions: [
      { name: '倾听理解', desc: '能认真听、听懂指令、理解日常与故事内容' },
      { name: '表达交流', desc: '口齿清晰、词汇丰富、能完整讲述与交流' },
      { name: '早期阅读', desc: '对图书感兴趣、理解画面、有阅读习惯' },
      { name: '文明用语', desc: '主动问候、礼貌表达、恰当使用语言' }
    ]
  },
  3: { // 社会领域
    label: '社会领域',
    levels: ['优秀', '良好', '一般', '需关注'],
    dimensions: [
      { name: '自我意识', desc: '情绪管理、自信表达、适应集体生活' },
      { name: '人际交往', desc: '主动交往、友好合作、愿意分享、帮助他人' },
      { name: '冲突处理', desc: '能协商解决、不攻击、懂得等待与轮流' },
      { name: '规则意识', desc: '遵守班级常规、游戏规则、活动秩序' },
      { name: '归属感', desc: '喜爱班级、喜爱幼儿园，尊重师长同伴' }
    ]
  },
  4: { // 科学领域
    label: '科学领域（探究与认知）',
    levels: ['优秀', '良好', '一般', '需关注'],
    dimensions: [
      { name: '探究兴趣', desc: '好奇好问、喜欢观察、乐于尝试' },
      { name: '数感与认知', desc: '数量、形状、比较、排序、对应等经验' },
      { name: '逻辑思维', desc: '简单分类、推理、发现事物关系' },
      { name: '自然感知', desc: '对动植物、天气、材料等自然现象感兴趣' }
    ]
  },
  5: { // 艺术领域
    label: '艺术领域（感受与表现）',
    levels: ['优秀', '良好', '一般', '需关注'],
    dimensions: [
      { name: '音乐感受', desc: '喜欢唱歌、律动，感受节奏旋律' },
      { name: '美术表现', desc: '愿意涂画、手工创作，大胆表达想象' },
      { name: '审美情趣', desc: '欣赏美、愿意表现，参与艺术活动' }
    ]
  },
  6: { // 学习品质
    label: '学习品质（专注力+习惯）',
    levels: ['优秀', '良好', '一般', '需关注'],
    dimensions: [
      { name: '专注力', desc: '活动持续时间、抗干扰、不分心' },
      { name: '任务意识', desc: '能坚持完成任务、不轻易放弃' },
      { name: '学习习惯', desc: '积极参与、大胆尝试、认真操作' },
      { name: '独立性', desc: '自主思考、自主解决简单问题' }
    ]
  }
};

Page({
  data: {
    id: null,
    linkedId: null,
    recordType: 'individual',
    targetName: '',
    classIndex: 0,
    classList: ['小班1班', '小班2班', '中班1班', '中班2班', '大班1班', '大班2班'],
    dateIndex: [0, 0, 0, 0, 0],
    dateList: [[], [], [], [], []],
    observationDate: null,
    observationDateStr: '',
    domainIndex: 0,
    domainList: ['请选择领域', '健康领域', '语言领域', '社会领域', '科学领域', '艺术领域', '学习品质'],
    domainLabels: ['', '健康领域（含动作与生活）', '语言领域', '社会领域', '科学领域（探究与认知）', '艺术领域（感受与表现）', '学习品质（专注力+习惯）'],
    levelList: ['优秀', '良好', '一般', '需关注'],
    currentDimensions: [],
    analysis: '',
    images: [],
    isEdit: false,
    loading: false
  },

  onLoad(options) {
    console.log('record page load', options);
    this.initDatePicker();
    if (options.id) {
      this.setData({ id: options.id, isEdit: true });
      this.loadData(options.id);
    }
    if (options.linkedId) {
      this.setData({ linkedId: options.linkedId });
    }
    if (options.targetName) {
      this.setData({ targetName: decodeURIComponent(options.targetName) });
    }
    if (options.className) {
      const className = decodeURIComponent(options.className);
      const classIndex = this.data.classList.indexOf(className);
      if (classIndex >= 0) {
        this.setData({ classIndex });
      }
    }
  },

  initDatePicker() {
    const now = new Date();
    const years = [], months = [], days = [], hours = [], minutes = [];
    for (let y = 2020; y <= 2030; y++) years.push(String(y));
    for (let m = 1; m <= 12; m++) months.push(String(m).padStart(2, '0'));
    for (let d = 1; d <= 31; d++) days.push(String(d).padStart(2, '0'));
    for (let h = 0; h <= 23; h++) hours.push(String(h).padStart(2, '0'));
    for (let m = 0; m <= 59; m++) minutes.push(String(m).padStart(2, '0'));

    const dateList = [years, months, days, hours, minutes];
    const dateIndex = [
      years.indexOf(String(now.getFullYear())),
      months.indexOf(String(now.getMonth() + 1).padStart(2, '0')),
      days.indexOf(String(now.getDate()).padStart(2, '0')),
      hours.indexOf(String(now.getHours()).padStart(2, '0')),
      minutes.indexOf(String(now.getMinutes()).padStart(2, '0'))
    ];

    const observationDate = new Date();
    const observationDateStr = observationDate.getFullYear() + '-' + String(observationDate.getMonth() + 1).padStart(2, '0') + '-' + String(observationDate.getDate()).padStart(2, '0') + ' ' + String(observationDate.getHours()).padStart(2, '0') + ':' + String(observationDate.getMinutes()).padStart(2, '0');

    this.setData({ dateList, dateIndex, observationDate, observationDateStr });
  },

  onDateChange(e) {
    const { dateList } = this.data;
    const [yearIdx, monthIdx, dayIdx, hourIdx, minIdx] = e.detail.value;
    const dateStr = dateList[0][yearIdx] + '-' + dateList[1][monthIdx] + '-' + dateList[2][dayIdx] + ' ' + dateList[3][hourIdx] + ':' + dateList[4][minIdx];
    this.setData({
      dateIndex: e.detail.value,
      observationDate: new Date(dateStr.replace(' ', 'T')),
      observationDateStr: dateStr
    });
  },

  onClassChange(e) {
    this.setData({ classIndex: e.detail.value });
  },

  onTypeChange(e) {
    this.setData({ recordType: e.detail.value });
  },

  onDomainChange(e) {
    const index = parseInt(e.detail.value);
    let currentDimensions = [];
    if (index > 0 && DOMAIN_DATA[index]) {
      currentDimensions = DOMAIN_DATA[index].dimensions.map(dim => ({
        ...dim,
        levelIndex: 0,
        level: '优秀'
      }));
    }
    this.setData({ domainIndex: index, currentDimensions });
  },

  onDimensionChange(e) {
    const { index } = e.currentTarget.dataset;
    const levelIndex = parseInt(e.detail.value);
    const currentDimensions = [...this.data.currentDimensions];
    currentDimensions[index].levelIndex = levelIndex;
    currentDimensions[index].level = this.data.levelList[levelIndex];
    this.setData({ currentDimensions });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  async loadData(id) {
    console.log('loadData', id);
    try {
      const res = await api.getObservation(id);
      const obs = res.observation;

      let images = obs.images;
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images || '[]');
        } catch (e) {
          images = [];
        }
      }
      const IMAGE_BASE = 'https://aixint.cn';
      images = (images || []).map(img =>
        img.startsWith('http') ? img : IMAGE_BASE + img
      );

      // 解析领域分析数据
      let analysisData = null;
      let domainIndex = 0;
      let currentDimensions = [];
      if (obs.analysis_data) {
        try {
          analysisData = JSON.parse(obs.analysis_data);
          domainIndex = analysisData.domainIndex || 0;
          if (domainIndex > 0 && DOMAIN_DATA[domainIndex]) {
            currentDimensions = DOMAIN_DATA[domainIndex].dimensions.map((dim, i) => ({
              ...dim,
              levelIndex: analysisData.dimensions && analysisData.dimensions[i]
                ? this.data.levelList.indexOf(analysisData.dimensions[i].level)
                : 0,
              level: analysisData.dimensions && analysisData.dimensions[i]
                ? analysisData.dimensions[i].level
                : '优秀'
            }));
          }
        } catch (e) {}
      }

      const classIndex = this.data.classList.indexOf(obs.class_name) || 0;
      this.setData({
        recordType: obs.record_type,
        targetName: obs.target_name,
        classIndex: classIndex >= 0 ? classIndex : 0,
        observationDate: obs.observation_date ? new Date(obs.observation_date.replace(' ', 'T')) : new Date(),
        observationDateStr: obs.observation_date ? obs.observation_date.slice(0, 16) : '',
        domainIndex: domainIndex,
        currentDimensions: currentDimensions,
        analysis: obs.analysis || '',
        images: images
      });
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    }
  },

  chooseImage() {
    const count = 9 - this.data.images.length;
    if (count <= 0) {
      return wx.showToast({ title: '最多9张图片', icon: 'none' });
    }
    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = [...this.data.images, ...res.tempFilePaths];
        this.setData({ images: newImages });
      }
    });
  },

  removeImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images });
  },

  async handleSubmit() {
    const { recordType, targetName, classIndex, domainIndex, currentDimensions, analysis, id, linkedId, images, content } = this.data;

    if (!targetName.trim()) {
      return wx.showToast({ title: '请输入观察对象*', icon: 'none' });
    }
    if (!this.data.classList[classIndex]) {
      return wx.showToast({ title: '请选择班级*', icon: 'none' });
    }

    this.setData({ loading: true });

    try {
      // 构造分析数据
      let analysisData = null;
      if (domainIndex > 0 && currentDimensions.length > 0) {
        analysisData = {
          domainIndex: domainIndex,
          domainLabel: this.data.domainLabels[domainIndex],
          dimensions: currentDimensions.map(d => ({ name: d.name, level: d.level }))
        };
      }

      const data = {
        record_type: recordType,
        class_name: this.data.classList[classIndex],
        target_name: targetName,
        observation_date: this.data.observationDate ? this.data.observationDate.toISOString().slice(0, 19).replace('T', ' ') : null,
        content: this.data.content || '',
        analysis: analysis || '',
        analysis_data: analysisData ? JSON.stringify(analysisData) : '',
        linked_id: linkedId || ''
      };

      if (id) {
        // 编辑
        const IMAGE_BASE = 'https://aixint.cn';
        const existingImages = [];
        const newImages = [];
        images.forEach(img => {
          if (img.startsWith('http://tmp') || img.startsWith('wxfile://')) {
            newImages.push(img);
          } else {
            existingImages.push(img.startsWith(IMAGE_BASE) ? img.replace(IMAGE_BASE, '') : img);
          }
        });
        let allImages = [...existingImages];
        if (newImages.length > 0) {
          for (const img of newImages) {
            const url = await api.uploadImage(img);
            allImages.push(url);
          }
        }
        await api.updateObservation(id, { ...data, images: JSON.stringify(allImages) });
        wx.showToast({ title: '更新成功', icon: 'success' });
        setTimeout(() => { wx.navigateBack(); }, 500);
      } else {
        // 新建
        await api.createObservation(data, images);
        wx.showToast({ title: '创建成功', icon: 'success' });
        setTimeout(() => { wx.navigateBack(); }, 1000);
      }
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  }
});
