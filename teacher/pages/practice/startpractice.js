// pages/practice/startpractice.js
Page({
  data: {
    choose_class: '',
    time: '00:01',
    date: '2017-04-01',
    end_date: '2017-09-01',
    end_time: '00:01',
    smallclass_id: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var questionList = options.questionList.split(','),
      self = this;

    wx.request({
      url: getApp().globalData.yurl + '/showClassList',
      method: 'GET',
      data: {
        course_id: options.course_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var date = new Date(),
          start_date = self.getDateStr(date),
          h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
          m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),

          start_time = h + ':' + m;
        date.setDate(date.getDate() + 30);
        var end_date = self.getDateStr(date);

        self.setData({
          class_list: res.data,
          course_id: options.course_id,
          question_num: questionList.length,
          questionList: questionList,
          date: start_date,
          time: start_time,
          end_date: end_date,
          end_time: start_time,
          classId: res.data[0].class_id
        })
        wx.getStorage({
          key: 'smallclassid',
          success: function (res) {
            self.setData({
              smallclass_id:res.data
            })
          }
        })
      }
    })
  },

  getDateStr: function (dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  bindChangePick: function (e) {
    var self = this;
    this.setData({
      choose_class: self.data.class_list[e.detail.value[0]].name,
      classId: self.data.class_list[e.detail.value[0]].class_id
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    this.setData({
      end_date: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      end_time: e.detail.value
    })
  },
  practiceNameInput: function (e) {
    this.setData({
      practiceName: e.detail.value
    })
  },
  practiceNumInput: function (e) {
    this.setData({
      practiceNum: e.detail.value
    })
  },

  submitSetting: function () {
    var self = this;
    wx.request({
      url: getApp().globalData.yurl +'/setpractice',
      method: 'POST',
      data: {
        courseId: self.data.course_id,
        classId: self.data.smallclass_id,
        startDate: self.data.date,
        startTime: self.data.time,
        endDate: self.data.end_date,
        endTime: self.data.end_time,
        practiceName: self.data.practiceName,
        questionList: self.data.questionList,
        practiceNum: self.data.practiceNum
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var studentlist =[]
        for(var w =0; w < res.data.allstu.length;w++)
        {
          studentlist.push(res.data.allstu[w].student_id)
        }
        wx.request({
          url: getApp().globalData.yurl + '/savegradesconfig',
          method: 'POST',
          data: {
            practiceid: res.data.practice_id,
            questionlist: self.data.questionList,
            studentlist:studentlist
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log('what?')
            wx.redirectTo({
              url: "/pages/class/class?id="+self.data.course_id
            })
          }
        })
      }
    })
  }
})