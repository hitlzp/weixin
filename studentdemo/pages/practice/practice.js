// pages/practice/practiceList.js
//需要一个下拉刷新
Page({
  data:{
    array: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var self = this,
        student_id;
    wx.getStorage({
      key: 'user',
      success: function(res){
        student_id = res.data;
        wx.request({
          url: getApp().globalData.yurl +'/practiceList',
          method: 'GET',
          data: {
            student_id: student_id
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            var curDate = new Date(),
                practiceList = res.data.practice,
                gradesList = res.data.grades;
            for (var i = 0; i < practiceList.length;i++) {
                for(var j=0;j<gradesList.length;j++) {
                    if(practiceList[i].practiceId==gradesList[j].practice_id) {
                        practiceList[i].complete = true;
                        break;
                    }
                }
                var start_date = new Date(practiceList[i].startDate + ' ' + practiceList[i].startTime),
                    end_date = new Date(practiceList[i].endDate + ' ' + practiceList[i].endTime);
                if (start_date < curDate && end_date > curDate && !practiceList[i].complete) {
                    practiceList[i].canPractice = true;
                } else if (end_date < curDate && !practiceList[i].complete) {
                    practiceList[i].noComplete = true;
                }else if(start_date>curDate) {
                        practiceList[i].willStart = true;
                }
            }
            self.setData({
                array: practiceList,
                student_id: student_id
            })
          }
        })
      },
      fail: function() {
        wx.showToast({
          title: '请登录'
        })
      }
    })

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  startPractice: function(e) {
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/practice/startpractice?practiceId='+item.practiceId
    })
  },
  bindPracticeTap: function(e) {
      var item = e.currentTarget.dataset.item;
      if (item.canPractice) {
          this.startPractice(e)
      } else if (item.complete) {
          wx.navigateTo({
              url: '/pages/practice/practiceitem?practiceId=' + item.practiceId+'&studentId='+this.data.student_id
          })
      }
  }
})