// pages/class/class.js

Page({
  data:{
    array: [],
    hidden_condition: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    wx.getStorage({
      key: 'user',
      success: function(res){
        var student_id = res.data;
        wx.request({
          url: getApp().globalData.yurl +'/showClassList',
          method: 'GET',
          data: {
            course_id: options.id,
            student_id: student_id
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            var class_list = [];
            for(var i=0;i<res.data.allmyclass.length;i++) {
              class_list.push(res.data.allmyclass[i].class_id);
            }
            self.setData({
              array: res.data.classmess,
              studentClass: class_list,
              course_id: options.id,
              student_id: student_id
            })
          }
        })
      },
      fail: function(res) {
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
  bindClassTap: function(e) {
    var class_id = e.currentTarget.dataset.id;
    console.log(class_id, this.data)
    if(this.data.studentClass.indexOf(class_id)==-1) {
        console.log("yes")
        this.setData({
          hidden_condition: true,
          class_id: class_id
        })
    }
    else{
      wx.showToast({
        title: '已填加',
      }),
        wx.navigateTo({
        url: '/pages/class/classindex?classId=' + class_id 
        })
    }
  },
  bindInputPwd: function(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  submitPwd: function(e) {
    var self = this;
    wx.request({
      url: getApp().globalData.yurl +'/joinClass',
      method: 'POST',
      data: {
        course_id: self.data.course_id,
        student_id: self.data.student_id,
        class_id: self.data.class_id,
        pwd: self.data.pwd
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        self.setData({
          hidden_condition: false
        })
        if(res.data.join_success) {
            wx.showToast({
              title: '恭喜你已加入该课程'
            })
            var class_list = self.data.studentClass;
            class_list.push(self.data.class_id);
            self.setData({
              studentClass: class_list
            })
            wx.navigateTo({
              url: '/pages/class/classindex?classId=' + self.data.class_id
            })
        }else {
            wx.showToast({
              title: '密码错误',
              icon: 'loading'
            })
        }
      }
    })
  }
})