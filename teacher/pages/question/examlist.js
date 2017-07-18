// pages/question/examlist.js
Page({
  data:{
    array: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    wx.request({
      url: getApp().globalData.yurl +'/showExamList',
      method: 'GET',
      data: {
        course_id: options.id
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        var data = res.data;
        for(var i=0;i<data.length;i++) {
          data[i].exam_name = unescape(data[i].exam_name.replace(/\\u/g, "%u"));
        }
        self.setData({
          array: data,
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
  bindClassTap: function(e) {
    wx.navigateTo({
        url: '/pages/question/setquestion?exam_id='+e.currentTarget.dataset.id+'&course_id='+this.data.course_id
    });
  }
})