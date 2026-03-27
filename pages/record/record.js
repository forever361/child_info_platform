const api = require('../../utils/api.js');

Page({
  data: {
    id: null,
    linkedId: null,
    recordType: 'individual',
    targetName: '',
    content: '',
    analysis: '',
    images: [],
    isEdit: false,
    loading: false
  },

  onLoad(options) {
    console.log('record page load', options);
    if (options.id) {
      this.setData({ id: options.id, isEdit: true });
      this.loadData(options.id);
    }
    if (options.linkedId) {
      this.setData({ linkedId: options.linkedId });
    }
  },

  async loadData(id) {
    console.log('loadData', id);
    try {
      const res = await api.getObservation(id);
      const obs = res.observation;
      
      // 后端已解析 images 字段为数组，直接使用
      let images = obs.images;
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images || '[]');
        } catch (e) {
          images = [];
        }
      }
      // 图片URL需要完整路径才能在小程序显示
      const IMAGE_BASE = 'http://8.134.189.98:3000';
      images = (images || []).map(img => {
        // 如果已经是完整URL，直接返回
        if (img.startsWith('http')) return img;
        // 否则添加前缀
        return IMAGE_BASE + img;
      });
      
      this.setData({
        recordType: obs.record_type,
        targetName: obs.target_name,
        content: obs.content,
        analysis: obs.analysis,
        images: images
      });
      console.log('loaded', obs);
    } catch (err) {
      console.error('load error', err);
      wx.showToast({ title: err.message, icon: 'none' });
    }
  },

  // 选择图片
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

  // 删除图片
  removeImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images });
  },

  onTypeChange(e) {
    console.log('type change', e.detail.value);
    this.setData({ recordType: e.detail.value });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    console.log('input', field, e.detail.value);
    this.setData({ [field]: e.detail.value });
  },

  async handleSubmit() {
    console.log('submit', this.data);
    const { recordType, targetName, id, linkedId, images } = this.data;

    if (!targetName.trim()) {
      return wx.showToast({ title: '请输入观察对象*', icon: 'none' });
    }

    this.setData({ loading: true });

    try {
      const data = {
        record_type: recordType,
        target_name: targetName,
        content: this.data.content,
        analysis: this.data.analysis,
        linked_id: linkedId || ''
      };
      console.log('submitting', data);

      if (id) {
        // 编辑模式：区分已保存的图片和新增的图片
        const IMAGE_BASE = 'http://8.134.189.98:3000';
        
        // 已保存的图片：来自服务器，包含 /files/ 或完整URL
        // 新增的图片：来自本地，格式为 http://tmp/ 或 wxfile://
        const existingImages = [];
        const newImages = [];
        
        images.forEach(img => {
          if (img.startsWith('http://tmp') || img.startsWith('wxfile://')) {
            // 本地临时图片，是新增的
            newImages.push(img);
          } else {
            // 来自服务器的图片，需要提取相对路径
            existingImages.push(img.startsWith(IMAGE_BASE) ? img.replace(IMAGE_BASE, '') : img);
          }
        });
        
        // 先上传新增的图片
        let allImages = [...existingImages];
        if (newImages.length > 0) {
          for (const img of newImages) {
            const url = await api.uploadImage(img);
            allImages.push(url);
          }
        }
        
        console.log('saving images:', allImages);
        await api.updateObservation(id, { ...data, images: JSON.stringify(allImages) });
        wx.showToast({ title: '更新成功', icon: 'success' });
        
        // 更新后直接跳转详情页
        wx.redirectTo({ url: `/pages/detail/detail?id=${id}` });
      } else {
        // 新建模式：上传所有图片
        await api.createObservation(data, images);
        wx.showToast({ title: '创建成功', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
    } catch (err) {
      console.error('submit error', err);
      wx.showToast({ title: err.message, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  }
});
