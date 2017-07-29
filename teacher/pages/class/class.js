// pages/class/class.js
Page({
  data:{
    array: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    wx.request({
      url: getApp().globalData.yurl+'/showClassList',
      method: 'GET',
      data: {
        course_id: options.id
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        self.setData({
          array: res.data,
          course_id: options.id
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
  createClass: function() {
    wx.navigateTo({
        url: '/pages/class/addclass?id='+this.data.course_id
    });
  },

  bindClassTap: function(e) {
    //console.log(e.currentTarget.dataset.classid);
      wx.navigateTo({
        url: '/pages/class/classstudent?classid=' + this.data.course_id
      });
      wx.setStorage({//将小班课程id存入缓存
        key: 'smallclassid',
        data: e.currentTarget.dataset.classid,
      })
  }
})