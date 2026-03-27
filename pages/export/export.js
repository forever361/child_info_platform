const api = require('../../utils/api.js');

Page({
  data: {
    // 导出选项
    exportType: 'single', // single | today | linked | custom
    selectedIds: [],
    targetName: '',
    linkedId: '',
    startDate: '',
    endDate: '',
    exportFormat: 'excel',

    // 数据
    list: [],
    loading: false,
    exporting: false
  },

  onShow() {
    this.loadMyRecords();
  },

  async loadMyRecords() {
    try {
      const res = await api.getObservations({ limit: 100 });
      this.setData({ list: res.list });
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    }
  },

  // 导出类型切换
  onExportTypeChange(e) {
    this.setData({ exportType: e.detail.value });
  },

  // 格式切换
  onFormatChange(e) {
    this.setData({ exportFormat: e.detail.value });
  },

  // 输入处理
  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  // 选择记录
  onSelectRecord(e) {
    const { id } = e.currentTarget.dataset;
    const { selectedIds } = this.data;
    const index = selectedIds.indexOf(id);

    if (index > -1) {
      selectedIds.splice(index, 1);
    } else {
      selectedIds.push(id);
    }

    this.setData({ selectedIds });
  },

  // 全选
  selectAll() {
    const allIds = this.data.list.map(item => item.id);
    this.setData({ selectedIds: allIds });
  },

  // 清空选择
  clearSelection() {
    this.setData({ selectedIds: [] });
  },

  // 开始导出
  async handleExport() {
    const { exportType, exportFormat, selectedIds, linkedId, targetName, startDate, endDate } = this.data;

    const params = { format: exportFormat };

    if (exportType === 'single' || exportType === 'custom') {
      if (selectedIds.length === 0) {
        return wx.showToast({ title: '请选择要导出的记录', icon: 'none' });
      }
      params.ids = selectedIds;
    } else if (exportType === 'linked') {
      if (!linkedId) {
        return wx.showToast({ title: '请输入串联ID', icon: 'none' });
      }
      params.linked_id = linkedId;
    } else if (exportType === 'today') {
      const today = new Date().toISOString().split('T')[0];
      params.start_date = today;
      params.end_date = today + ' 23:59:59';
    }

    if (targetName) params.target_name = targetName;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate + ' 23:59:59';

    this.setData({ exporting: true });

    try {
      let res;
      if (exportFormat === 'excel') {
        res = await api.exportExcel(params);
      } else {
        res = await api.exportWord(params);
      }

      if (res.success) {
        // 打开文件
        wx.downloadFile({
          url: 'http://8.134.189.98:3000' + res.file,
          success: (downRes) => {
            wx.openDocument({
              filePath: downRes.tempFilePath,
              success: () => {
                wx.showToast({ title: '导出成功', icon: 'success' });
              }
            });
          }
        });
      }
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    } finally {
      this.setData({ exporting: false });
    }
  }
});
