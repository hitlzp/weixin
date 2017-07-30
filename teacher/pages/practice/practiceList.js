// pages/practice/practiceList.js
var GetList = function (that) {
  that.setData({
    hidden: false
  });
  // 页面初始化 options为页面跳转所带来的参数
  wx.request({
    url: getApp().globalData.yurl + '/practiceList',
    method: 'GET',
    data: {
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      that.setData({
        array: res.data,
        hidden: true
      })
    }
  })
}

Page({
  data:{
    array: [],
    hidden: true,
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
  },
  onShow: function () {
    //  在页面展示之后先获取一次数据
    var that = this;
    GetList(that);
  },

  refresh: function (event) {
    //  该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    
    GetList(this)
  },

  viewScore: function(e) {
    console.log(e.target.dataset.practiceid);
    wx.navigateTo({
        url: '/pages/practice/grades?practiceId=' + e.target.dataset.practiceid
    })
  },

  startScore: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.yurl + '/startbtnToshowbtn',
      method: 'GET',
      data: {
        practice_id: e.target.dataset.practiceid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          array: res.data
        })
        GetList(that);
      }
    })
  },

  stopScore: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.yurl + '/endbtnToshowbtn',
      method: 'GET',
      data: {
        practice_id:e.target.dataset.practiceid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          array: res.data
        })
        GetList(that);
      }
    })
  }
})