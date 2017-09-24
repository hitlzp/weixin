// pages/practice/submit.js
var student_id,practice_id;
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
    practice_id=options.practiceId;
    student_id=options.studentId;
    wx.getStorage({
      key: 'class',
      success: function (res) {
        var classid = res.data;
        var open;
        wx.request({
          url: getApp().globalData.yurl + '/managePractice',
          method: 'get',
          data: {
            class_id: classid
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            open = res.data[0].practiceID;
            if (res.data[0].practiceID != practice_id) {
              console.log(res.data[0].practiceID);
              wx.redirectTo({
                url: '/pages/practice/practiceitem?practiceId=' + practice_id + '&studentId=' + student_id,
              })

            }


          }
        })
      },
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
    wx.getStorage({
      key: 'class',
      success: function (res) {
        var classid = res.data;
        //var open;
        wx.request({
          url: getApp().globalData.yurl + '/managePractice',
          method: 'get',
          data: {
            class_id: classid
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
           //console.log(res.data[0]);
            if (res.data[0].practiceID == '0') {
              console.log(1,res.data[0])
              wx.redirectTo({
                url: '/pages/practice/practiceitem?practiceId=' + practice_id + '&studentId=' + student_id,
              })

            }
            else{
              console.log(2, res.data[0]);
              wx.redirectTo({
                url: '/pages/practice/submit?practiceId=' + practice_id + '&studentId=' + student_id,
              })
            }


          }
        })
      },
    })

     
   
          //console.log(res.data[0].practiceID)





  }

})