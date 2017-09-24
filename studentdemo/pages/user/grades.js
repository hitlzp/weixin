// pages/user/grades.js
var wxCharts = require('../../utils/wxcharts-min.js');
var app = getApp();
var std;
var lineChart = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var self = this;
      std = options.studentId;
      wx.request({
        url: getApp().globalData.yurl +'/getAllGrades',
          method: 'GET',
          data: {
              studentId: options.studentId
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            //console.log(res.data);
              var course_list = res.data.course,
                  grades_list = res.data.grades,
                  new_grades = res.data;
            
              //console.log(course_list, grades_list)
 /*             for(var i=0;i<course_list.length;i++) {
                  var name = unescape(course_list[i].course_name.replace(/\\u/g, "%u"));
                  name = name.replace(/&nbsp;/g, '')
                  var obj = {}
                  obj.name = name;
                  obj.goodNum = 0;
                  obj.totalNum = 0;
                  for(var j=0;j<grades_list.length;j++) {
                    if(grades_list[j].courseId==course_list[i].course_id) {
                        obj.goodNum += grades_list[j].goodNum;
                        obj.totalNum += grades_list[j].totalNum;
                    }
                  }
                  new_grades.push(obj);
              }
              //console.log(new_grades)*/
              self.setData({
                  data: new_grades
              })
          }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindCourseTap1: function (e) {
    //console.log(e.currentTarget);
    wx.navigateTo({
      url: '/pages/practice/submit?practiceId=' +e.currentTarget.dataset.id+ '&studentId=' +std
    })

  }
})