// coming.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startbtnstate:'disabled',
    endbtnstate: 'disabled',
    class_id:'',
    listData: [],
    listData2: [],
    sum1: 0,
    sum2: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    setInterval(function () {
      console.log(options.id)
      wx.request({
        url: getApp().globalData.yurl + '/classstate',
        method: 'GET',
        data: {
          class_id: options.id,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data[0].attend)
          if (res.data[0].attend == 0) {
            that.setData({
              startbtnstate: '',
              endbtnstate: 'disabled',
              class_id: options.id,
            })
          }
          else {
            that.setData({
              startbtnstate: 'disabled',
              endbtnstate: '',
              class_id: options.id,
            })
          }
          wx.request({
            url: getApp().globalData.yurl + '/showstulist',
            method: 'GET',
            data: {
              class_id: options.id,
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.setData({
                listData: res.data.comedstudent,
                listData2: res.data.notcomestudent,
                sum1: res.data.comedstudent.length,
                sum2: res.data.notcomestudent.length + res.data.comedstudent.length
              })
            }
          })
        }
      })
    }, 1000) //循环时间 这里是1秒 
  },

  startsign: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.yurl + '/startsign',
      method: 'GET',
      data: {
        class_id: this.data.class_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.redirectTo({
          url: '/pages/coming/coming?id=' + res.data
        })
      }
    })
  },
  endsign: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.yurl + '/endsign',
      method: 'GET',
      data: {
        class_id: this.data.class_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.redirectTo({
          url: '/pages/coming/coming2?id=' + res.data
        })
      }
    })
  }
})