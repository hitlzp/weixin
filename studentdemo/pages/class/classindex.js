// pages/class/classindex.js
var class_ = '0';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'0',
    classId:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    class_=options.classId;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        self.setData({
          name: res.data,
          classId: options.classId,
        }),
          wx.setStorage({
            key: 'class',
            data: options.classId,
            success: function () {

            }
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
    console.log(class_);
    wx.request({
      url: getApp().globalData.yurl +'/manageAttend',
      method: 'get',
      data: {
        class_id: class_,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data[0].attend);
        if (res.data[0].attend != 0) {
          wx.navigateTo({
            url: '/pages/attend/attend?Id=' + res.data[0].attend+'&classId='+class_
          })
        }
        else {
          wx.showToast({
            title: '签到系统未开放',
          })
        }
      }
    })

  },
  bindCourseTap2: function (e) {
    wx.request({
      url: getApp().globalData.yurl +'/managePractice',
      method: 'get',
      data: {
        class_id: class_,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data[0].practiceID);
        if (res.data[0].practiceID != '0') {
          wx.navigateTo({
            url: '/pages/practice/startpractice?practiceId=' + res.data[0].practiceID+'&classId'+class_
          })
          console.log(res.data[0].practiceID)
        }
        else {
          wx.showToast({
            title: '测试系统未开放',
          })
        }
      }
    })

  }
})