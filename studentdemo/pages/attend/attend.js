// pages/attend/attend.js
var latitude= 0,
  longitude= 0,
    altitude= 0,
    name='0',
    id1=0,
    class_;
var app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    //altitude: 0,
    hidden_condition: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    id1 = options.Id;
    class_=options.classId;
    wx.getStorage({
      key: 'user',
      success: function(res) {
        var name1=res.data;
        name=name1;
        self.setData({
          name:name1,
          class_:options.classId

        })
      },
    })
    console.log('name:', options.Id);


    if (options.Id =='0') {
      self.setData({
        hidden_condition: -1
      })
    //console.log('1')
    } else {
      self.setData({
        id: options.Id
      }) 
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {

          self.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            altitude: res.altitude,
          })
          latitude = res.latitude;
          longitude = res.longitude;
          altitude = res.altitude
          console.log(' studentID:', name);
          wx.request({
            url: getApp().globalData.yurl +'/studentAttend',
            method: 'POST',
            data: {
              studentID: name,
              number1: id1,
              latitude: res.latitude,
              longitude: res.longitude,
              altitude: res.altitude,
              classID:class_
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data.user_exist)
              if (res.data.user_exist == 0) {
                wx.showToast({
                  title: '签到成功',
                })
              } else {
                // console.log(res.data);
                self.setData({
                  hidden_condition: 1
                })
                wx.showToast({
                  title: '签到失败',
                })


              }
            }

          })
        }



      })

    }

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
  
  }
})