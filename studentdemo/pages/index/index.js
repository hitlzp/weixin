//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    array:[]
  },
  onLoad: function () {
    var self = this;
    wx.getStorage({
      key: 'user',
      success: function(res) {
        wx.request({
          url: getApp().globalData.yurl+'/showCourseListStudent',
          method: 'GET',
          data: {

          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            var data = res.data;
            //console.log(res.data.value)
            for(var i=0;i<data.length;i++) {
                data[i].course_name = unescape(data[i].course_name.replace(/\\u/g, "%u"));
            }
            self.setData({
              array: data
            })
          }
        })
      },

      fail: function(res) {
          wx.navigateTo({
              url: '/pages/login/login'
          });
      }
    })
  },
  bindCourseTap: function(e) {
    //console.log(e.currentTarget);
    wx.navigateTo({
        url: '/pages/class/class?id='+e.currentTarget.dataset.id
    });
  },
  bindCourseTap1: function (e) {
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    });
  },


})