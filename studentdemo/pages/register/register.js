// pages/register/register0.js
Page({
  data: {},
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
    var re_studentId;
    wx.request({
      url: getApp().globalData.yurl + '/studentRegister',
      method: 'POST',
      data: {
        studentId: e.detail.value.studentId,
        userName: e.detail.value.userName,
        pwd: e.detail.value.pwd
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var state = res.data['haha']['user_exist'];
        if (state == 1) {
          wx.showToast({
            title: '用户已存在，请直接登录',
            icon: 'loading',
            duration: 2000
          })
        }
        else if (state == 2) {
          wx.showToast({
            title: '用户信息不全',
            icon: 'loading',
            duration: 2000
          })
        }
        else {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          })

          wx.setStorage({
            key: 'user',
            data: e.detail.value.email,
            success: function () {
              wx.reLaunch({
                url: '/pages/login/login'
              });
            }
          })
        }
      }
    })
  }
})