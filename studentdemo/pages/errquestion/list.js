// pages/errquestion/list.js
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
    var self = this;
    wx.getStorage({
        key: 'user',
        success: function(res) {
            var studentId = res.data;
            wx.request({
                url: getApp().globalData.yurl +'/geterrDefault',
                method: 'GET',
                data: {
                    studentId: res.data
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    var course_list = res.data.course,
                        question_list = res.data.list,
                        id_list = [],
                        err_course = [];
                    for(var i=0;i<course_list.length;i++) {
                        if(id_list.indexOf(course_list[i].course_id)==-1) {
                            id_list.push(course_list[i].course_id);
                            var name = unescape(course_list[i].course_name.replace(/\\u/g, "%u"));
                            name = name.replace(/&nbsp;/g, '')
                            err_course.push({
                                name: name,
                                value: course_list[i].course_id
                            })
                        }
                    }

                    for (var i = 0; i < question_list.length; i++) {
                        question_list[i].index = i;
                        var option = question_list[i].optionDetail;
                        question_list[i].subject = unescape(question_list[i].subject.replace(/\\u/g, "%u"));
                        question_list[i].subject = question_list[i].subject.replace(/&nbsp;/g, '')
                        option = unescape(option.replace(/\\u/g, "%u"));
                        question_list[i].optionDetail = option.slice(1, option.length - 1);
                        var lr = self.parseOption(question_list[i].optionDetail.split(','));
                        question_list[i].optionDetail = lr.list;
                        question_list[i].answer = lr.answer;
                        question_list[i].total_analyse = lr.total_analyse;
                    }
                    self.setData({
                        course_list: err_course,
                        question_list: question_list,
                        studentId: studentId
                    })
                }
            })
        },
    })
  },
  parseOption: function (option_list) {
      var loop_num = option_list.length / 4,
          new_list = [],
          res = {},
          flag = ['A', 'B', 'C', 'D', 'D', 'D'],
          re_content = /"content":"(.+)"/,
          re_true_ans = /"answer":true/,
          re_false_ans = /"answer":false/,
          re_analyse = /"analyse":"(.+)"\}/,
          re_flag = /<[\/*\w]+>/g,
          re_span = /<span.+>/g;
      for (var i = 0; i < loop_num; i++) {
          var option_obj = {};
          for (var j = 0; j < 4; j++) {
              var str = option_list[4 * i + j];
              if (str) {
                  str = str.replace(/\\/g, '');
                  str = str.replace(re_flag, '');
                  option_obj.value = i;
                  if (re_content.test(str)) {
                      var content = RegExp.$1;
                      option_obj.content = flag[i] + '、' + content.replace(re_span, '');
                      option_obj.content = option_obj.content.replace(/&nbsp;/g, '');
                  } else if (re_true_ans.test(str)) {
                      option_obj.answer = true;
                      res.answer = i;
                      if (i == 4) {
                          new_list.pop();
                      } else if (i == 5) {
                          new_list.pop();
                          new_list.pop();
                      }
                  } else if (re_false_ans.test(str)) {
                      option_obj.answer = false;
                  } else if (re_analyse.test(str)) {
                      option_obj.analyse = RegExp.$1;
                      option_obj.analyse = option_obj.analyse.replace(/&nbsp;/g, ' ')
                  }
              }
          }
          new_list.push(option_obj);
      }

      var total_analyse = "此题正确答案为：" + flag[res.answer] + ';';
      for (var i = 0; i < new_list.length; i++) {
          if (new_list[i].analyse) {
              total_analyse += (flag[i] + '、' + new_list[i].analyse);
          }
      }
      res.list = new_list;
      res.total_analyse = total_analyse;
      return res;
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
  bindChange: function(e) {
      var self = this;
      wx.request({
          url: getApp().globalData.yurl +'/geterrList',
          method: 'GET',
          data: {
              studentId: this.data.studentId,
              courseId: this.data.course_list[e.detail.value[0]].value
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
              var question_list = res.data;
              for (var i = 0; i < question_list.length; i++) {
                  question_list[i].index = i;
                  var option = question_list[i].optionDetail;
                  question_list[i].subject = unescape(question_list[i].subject.replace(/\\u/g, "%u"));
                  question_list[i].subject = question_list[i].subject.replace(/&nbsp;/g, '')
                  option = unescape(option.replace(/\\u/g, "%u"));
                  question_list[i].optionDetail = option.slice(1, option.length - 1);
                  var lr = self.parseOption(question_list[i].optionDetail.split(','));
                  question_list[i].optionDetail = lr.list;
                  question_list[i].answer = lr.answer;
                  question_list[i].total_analyse = lr.total_analyse;
              }
              self.setData({
                  question_list: question_list
              })
          }
      })
  }
})