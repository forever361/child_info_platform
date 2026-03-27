const API_BASE = 'https://d2025bbf545a5f5e-8-134-189-98.serveousercontent.com/api';

const getToken = () => wx.getStorageSync('token');

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = getToken();
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    };
    if (token) {
      header.Authorization = `Bearer ${token}`;
    }

    wx.request({
      url: API_BASE + options.url,
      method: options.method || 'GET',
      data: options.data,
      header,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('user');
          wx.redirectTo({ url: '/pages/login/login' });
          reject(new Error('未授权'));
        } else {
          reject(new Error(res.data.error || '请求失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

export const login = (code, userInfo) => request({ url: '/auth/login', method: 'POST', data: { code, userInfo } });
export const getUserInfo = () => request({ url: '/auth/me' });
export const getObservations = (params) => request({ url: '/observations', data: params });
export const getObservation = (id) => request({ url: `/observations/${id}` });
export const getLinkedObservations = (linkedId) => request({ url: `/observations/linked/${linkedId}` });

// 上传单张图片（返回URL）
export const uploadImage = (filePath) => {
  return new Promise((resolve, reject) => {
    const token = getToken();
    wx.uploadFile({
      url: API_BASE + '/observations/upload',
      filePath: filePath,
      name: 'image',
      header: { Authorization: `Bearer ${token}` },
      success: (res) => {
        console.log('upload response', res);
        try {
          const result = JSON.parse(res.data);
          if (result.url) {
            resolve(result.url);
          } else {
            reject(new Error(result.error || '上传失败'));
          }
        } catch (e) {
          console.error('parse error', e);
          reject(new Error('解析响应失败'));
        }
      },
      fail: (err) => {
        console.error('upload fail', err);
        reject(new Error('上传失败'));
      }
    });
  });
};

export const createObservation = (data, imagePaths) => {
  // 如果有图片，先上传所有图片获取URLs
  if (imagePaths && imagePaths.length > 0) {
    return new Promise((resolve, reject) => {
      Promise.all(imagePaths.map(path => uploadImage(path)))
        .then((urls) => {
          // 所有图片上传成功后，创建记录
          const dataWithImages = { ...data, images: JSON.stringify(urls) };
          request({ url: '/observations', method: 'POST', data: dataWithImages })
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
  }
  // 没有图片直接提交
  return request({ url: '/observations', method: 'POST', data });
};

export const updateObservation = (id, data) => request({ url: `/observations/${id}`, method: 'PUT', data });
export const deleteObservation = (id) => request({ url: `/observations/${id}`, method: 'DELETE' });
export const exportExcel = (params) => request({ url: '/export/excel', method: 'POST', data: params });
export const exportWord = (params) => request({ url: '/export/word', method: 'POST', data: params });

export default {
  login, getUserInfo, getObservations, getObservation,
  getLinkedObservations, createObservation, updateObservation,
  deleteObservation, exportExcel, exportWord, uploadImage
};
