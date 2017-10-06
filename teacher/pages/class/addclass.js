// pages/class/addclass.js
Page({
  data:{
    btnDisabled: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      course_id: options.id
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  bindNameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindNumInput: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  bindPwdInput: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  bindFormSubmit: function(e) {
    var self = this;
    wx.request({
      url: getApp().globalData.yurl+'/addClass',
      method: 'POST',
      data: {
        course_id: self.data.course_id,
        name: e.detail.value.name,
        num: e.detail.value.num,
        pwd: e.detail.value.pwd,
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.add_success) {
          wx.reLaunch({
              url: '/pages/class/class?id='+self.data.course_id
          });
        }
      }
    })
  }
})