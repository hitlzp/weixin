// pages/practice/grades.js
var wxCharts = require('../../utils/wxcharts-min.js');
var pieChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    need_num: 0,
    real_num: 0,
    listData: [],
    listData2: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.request({
      url: getApp().globalData.yurl +'/gradeList',
        method: 'GET',
        data: {
            practiceId: options.practiceId
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            var grades_list = [],
                num_list = [],
                pie_list = [],
                list = res.data.list,
                list2 = res.data.list2;
            for(var i=0;i<list.length;i++) {
                if (grades_list.indexOf(list[i].grades)==-1) {
                    grades_list.push(list[i].grades);
                    num_list.push(0)
                }
            }

            for(var i=0;i<list.length;i++) {
                for(var j=0;j<grades_list.length;j++) {
                    if(list[i].grades==grades_list[j]) {
                        num_list[j]++;
                        break;
                    }
                }
            }

            for(var i=0;i<grades_list.length;i++) {
                var obj = {
                    name: grades_list[i],
                    data: num_list[i]
                };
                pie_list.push(obj);
            }

            var windowWidth = 320;
            try {
                var resw = wx.getSystemInfoSync();
                windowWidth = resw.windowWidth;
            } catch (e) {
                console.error('getSystemInfoSync failed!');
            }
            if (res.data.student_num == 0)
            {
              res.data.student_num =1;
            }
            pieChart = new wxCharts({
                animation: true,
                canvasId: 'pieCanvas',
                type: 'pie',
                series: pie_list,
                width: windowWidth,
                height: 300,
                dataLabel: true,
                series: [{
                  name: '未完成测试学生',
                  data: res.data.student_num - list.length,
                }, {
                  name: '完成测试学生',
                  data: list.length,
                }],
    
            });
            self.setData({
                need_num: res.data.student_num,
                real_num: list.length,
                listData: list,
                listData2: list2,
                practiceId: options.practiceId
            })
            console.log(list);
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

  questionlist: function () {
    console.log(this.data.practiceId)
    wx.redirectTo({
      url: '/pages/practice/list?practiceId=' + this.data.practiceId
    })
  },
  touchHandler: function(e) {
      console.log(pieChart.getCurrentDataIndex(e))
  }
})