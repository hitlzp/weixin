//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    array: []
  },
  onLoad: function () {
    var self = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        console.log(res.data)
        wx.request({
          url: 'http://127.0.0.1:3000/showCourseList',
          method: 'post',
          data: {
            themail: res.data
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var data = res.data;
            console.log(data.length)
            for (var i = 0; i < data.length; i++) {
              data[i].course_name = unescape(data[i].course_name.replace(/\\u/g, "%u"));
            }
            self.setData({
              array: data
            })
          }
        })
      },
      fail: function (res) {
        // fail
        console.log("fail");
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }
    })
  },
  bindCourseTap: function (e) {
    wx.navigateTo({
      url: '/pages/class/class?id=' + e.currentTarget.dataset.id
    });
  }
})