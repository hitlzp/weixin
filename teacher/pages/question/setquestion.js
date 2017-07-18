// pages/question/setquestion.js
Page({
  data:{
    array: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    wx.request({
      url: getApp().globalData.yurl +'/showQuestionList',
      method: 'GET',
      data: {
        exam_id: options.exam_id
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        var data = res.data;
        for(var i=0;i<data.length;i++) {
          var str = data[i].subject;
          var re_str = new RegExp('&nbsp;', 'mg');
          data[i].subject = str.replace(re_str, ' ');
          data[i].subject = unescape(data[i].subject.replace(/\\u/g, "%u"))
        }
        self.setData({
          array: data,
          course_id: options.course_id
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
  checkboxChange: function(e) {
    this.setData({
      questionList: e.detail.value
    })
  },
  bindcomPractice: function () {
    console.log(this.data.course_id)
    wx.redirectTo({
      url: '/pages/practice/startpractice?course_id=' + this.data.course_id + '&questionList=' + this.data.questionList.toString(),
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    });
  }
})