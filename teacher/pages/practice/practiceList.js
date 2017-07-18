// pages/practice/practiceList.js
Page({
  data:{
    array: [],
    windowHeight:0
  },

  onLoad:function(options){
    var that =this
    wx.getSystemInfo({
      success: function (res) { 
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })

    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    wx.request({
      url: getApp().globalData.yurl + '/practiceList',
      method: 'GET',
      data: {
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        self.setData({
          array: res.data
        })
      }
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

  UpperEventHandle:function(){
    var self = this;
    wx.request({
      url: getApp().globalData.yurl + '/practiceList',
      method: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        self.setData({
          array: res.data
        })
      }
    })
    console.log('下拉刷新');
  },

  viewScore: function(e) {
    console.log(e.target.dataset.practiceid);
    wx.navigateTo({
        url: '/pages/practice/grades?practiceId=' + e.target.dataset.practiceid
    })
  }
})