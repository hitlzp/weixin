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
      url: getApp().globalData.yurl + '/login',
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
        var state = res.data['haha']['user_exist'];
        if(state == 0)
        {
          wx.showToast({
            title: '用户不存在',
            icon: 'loading',
            duration: 2000
          })
        }
        else if(state == 1)
        {
          wx.showToast({
            title: '密码错误',
            icon: 'loading',
            duration: 2000
          })
        }
        else if (state == 3) {
          wx.showToast({
            title: '用户信息不全',
            icon: 'loading',
            duration: 2000
          })
        }
        else
        {
          wx.showToast({
            title: '登陆成功',
            icon: 'success',
            duration: 2000
          })
          wx.setStorage({
            key: 'userth',
            data: e.detail.value.user,
            success: function () {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }
          })
        }
      }
    })
  }
})