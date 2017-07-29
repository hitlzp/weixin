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
    listData2: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: getApp().globalData.yurl + '/classstate',
      method: 'GET',
      data: {
        class_id : options.id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data[0].attend)
        if (res.data[0].attend == 0)
        {
          that.setData({
            startbtnstate: '',
            endbtnstate:'disabled',
            class_id: options.id,
          })
        }
        else{
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
              listData2: res.data.notcomestudent
            })
          }
        })

      }
    })
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
          url: '/pages/coming/coming?id=' + res.data
        })
      }
    })
  }
})