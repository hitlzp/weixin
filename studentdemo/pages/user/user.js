// pages/user/user.js
var app = getApp()
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
      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
          //更新数据
          that.setData({
              userInfo: userInfo
          })
      })

      wx.getStorage({
          key: 'user',
          success: function(res) {
              wx.get
              that.setData({
                  studentId: res.data
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
  logout: function() {
      wx.removeStorage({
          key: 'user',
          success: function(){
            wx.reLaunch({
                url: '/pages/index/index',
            })
          }
      })
  },
  errorJump: function() {
      wx.navigateTo({
          url: '/pages/errquestion/list',
      })
  },
  gradesJump: function() {
      wx.navigateTo({
          url: '/pages/user/grades?studentId='+this.data.studentId,
      })
  },
  infoJump: function() {
      wx.navigateTo({
          url: '/pages/user/info?studentId=' + this.data.studentId,
      })
  }
})