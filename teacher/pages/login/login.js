// pages/login/login.js
Page({
  data: {

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  bindFormSubmit: function (e) {
    wx.request({
      url: 'http://127.0.0.1:3000/login',
      method: 'POST',
      //entryOption为1表示是老师
      data: {
        user: e.detail.value.user,
        pwd: e.detail.value.pwd,
        entryOption: 1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.setStorage({
          key: 'user',
          data: e.detail.value.user,
          success: function () {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }
        })
      }
    })
  }
})