const api = require('../../utils/api.js');
const { drawRadarChart } = require('../../utils/chart-radar.js');
const { drawTrendChart } = require('../../utils/chart-trend.js');

const DOMAIN_ICONS = ['💪', '💬', '👫', '🔬', '🎨', '📚'];
const HOME_TIPS_TEMPLATES = [
  '建议家长每天安排固定的亲子阅读时间，帮助孩子养成良好的阅读习惯。',
  '鼓励孩子参与简单的家务劳动，如整理玩具、收拾碗筷，培养生活自理能力。',
  '多带孩子进行户外活动，促进大肌肉动作发展，增强体质。',
  '为孩子创造与同龄伙伴交流的机会，帮助提升人际交往能力。',
  '在日常生活中引导孩子观察自然现象，培养科学探究兴趣。',
  '尊重孩子的兴趣爱好，给予积极的鼓励和肯定，增强自信心。'
];

Page({
  data: {
    loading: true,
    loadingStep: '正在加载观察数据...',
    error: null,
    reportData: null,
    genTime: '',
    homeTips: [],
    canvasWidth: 320
  },

  onLoad(options) {
    const { target_name, class_name } = options;
    if (!target_name) {
      this.setData({ loading: false, error: '缺少参数：target_name' });
      return;
    }
    this.setData({ targetName: decodeURIComponent(target_name), className: decodeURIComponent(class_name || '') });
    this.loadReport();
    this.setData({ genTime: this.formatNow() });
  },

  onReady() {
    // Get canvas width for responsive charts
    wx.getSystemInfo({
      success: (res) => {
        this.setData({ canvasWidth: Math.min(res.windowWidth - 48, 340) });
      }
    });
  },

  async loadReport() {
    this.setData({ loading: true, error: null, loadingStep: '正在加载观察数据...' });
    try {
      const targetName = this.data.targetName;
      const className = this.data.className;
      this.setData({ loadingStep: '正在生成AI评语，请稍候...' });
      const res = await api.generateReport(targetName, className);
      const tips = this.pickHomeTips(res.domainSummary);
      // 解析 analysis_data 字符串为对象，供图表使用
      if (res.observations) {
        res.observations = res.observations.filter(o => o && o.observation_date);
        res.observations.forEach(o => {
          if (o.analysis_data && typeof o.analysis_data === 'string') {
            try { o.analysisData = JSON.parse(o.analysis_data); } catch(e) { o.analysisData = null; }
          }
        });
      }
      this.setData({
        loading: false,
        reportData: res,
        homeTips: tips,
        genTime: this.formatNow()
      });
      // Draw charts after data is ready
      setTimeout(() => this.drawCharts(), 100);
    } catch (err) {
      this.setData({ loading: false, error: err.message || '加载失败，请重试' });
    }
  },

  retryLoad() {
    this.loadReport();
  },

  drawCharts() {
    const { reportData, canvasWidth } = this.data;
    if (!reportData || !reportData.domainSummary) return;
    // Radar chart
    try {
      drawRadarChart('radarChart', reportData.domainSummary, canvasWidth);
    } catch (e) {
      console.error('Radar chart error:', e);
    }
    // Trend chart
    try {
      if (reportData.observations && reportData.observations.length > 1) {
        console.log('Drawing trend chart with', reportData.observations.length, 'observations');
        drawTrendChart('trendChart', reportData.observations, canvasWidth + 20);
      } else {
        console.log('Trend chart skipped: obs count =', reportData.observations?.length);
      }
    } catch (e) {
      console.error('Trend chart error:', e);
    }
  },

  levelClass(level) {
    const map = { '优秀': 'excellent', '良好': 'good', '一般': 'normal', '需关注': 'attention' };
    return map[level] || 'normal';
  },

  pickHomeTips(domainSummary) {
    // Pick 3 tips based on domains that need most attention
    const sorted = [...domainSummary].sort((a, b) => {
      const score = (l) => { const m = { '优秀': 0, '良好': 1, '一般': 2, '需关注': 3 }; return m[l] || 2; };
      return score(a.level) - score(b.level);
    });
    const tips = [];
    const usedIndices = new Set();
    for (const d of sorted) {
      if (tips.length >= 3) break;
      const di = d.domainIndex;
      if (!usedIndices.has(di)) {
        tips.push(HOME_TIPS_TEMPLATES[di - 1] || HOME_TIPS_TEMPLATES[0]);
        usedIndices.add(di);
      }
    }
    while (tips.length < 3) tips.push(HOME_TIPS_TEMPLATES[tips.length]);
    return tips;
  },

  formatNow() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  },

  saveReport() {
    wx.showToast({ title: '报告已生成，可截图保存', icon: 'none', duration: 2000 });
  },

  onShareAppMessage() {
    const { reportData } = this.data;
    return {
      title: `${reportData?.childName || ''} 的成长报告`,
      path: `/pages/report/report?target_name=${encodeURIComponent(this.data.targetName || '')}&class_name=${encodeURIComponent(this.data.className || '')}`
    };
  }
});
