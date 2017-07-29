// pages/class/classstudent.js
Page({
  data: {
    array: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    self.setData({
      course_id: options.classid,
    })
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
  
  setquestion: function () {
    wx.navigateTo({
      url: '/pages/question/examlist?id=' + this.data.course_id
    });
  },
  cominglist: function () {
    wx.getStorage({
      key: 'smallclassid',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/coming/coming?id=' + res.data
        });

      }
    })
  },

})