// pages/practice/practiceitem.js
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
    wx.request({
        url: getApp().globalData.yurl +'/practiceItem',
        method: 'GET',
        data: {
            student_id: options.studentId,
            practice_id: options.practiceId
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
            var question_list = res.data.question,
                grades_list = res.data.grades,
                complete = [],
                grades = 0;
            for (var i = 0; i < question_list.length; i++) {
                for(var j=0;j<grades_list.length;j++) {
                    if(question_list[i].question_id == grades_list[j].question_id) {
                        question_list[i].postAnswer = parseInt(grades_list[j].postAnswer);
                        if (grades_list[j].answer == grades_list[j].postAnswer) {
                            complete[i] = 1;
                            grades++;
                        }else {
                            complete[i] = 2;
                        }
                        break;
                    }
                }
            }
            var showGrades = grades + '/' + grades_list.length;
            for (var i = 0; i < question_list.length; i++) {
                question_list[i].index = i;
                var option = question_list[i].optionDetail;
                question_list[i].subject = unescape(question_list[i].subject.replace(/\\u/g, "%u"));
                question_list[i].subject = question_list[i].subject.replace(/&nbsp;/g, '')
                option = unescape(option.replace(/\\u/g, "%u"));
                question_list[i].optionDetail = option.slice(1, option.length - 1);
                var lr = self.parseOption(question_list[i].optionDetail.split(','));          
                question_list[i].optionDetail = lr.list;
                question_list[i].optionDetail[question_list[i].postAnswer].checked = 'true';
                question_list[i].answer = lr.answer;
                question_list[i].total_analyse = lr.total_analyse;
            }
            self.setData({
                array: question_list,
                grades: showGrades,
                complete: complete,
                studentId: options.studentId,
                practiceId: options.practiceId
            })
        }
    })
  },
  parseOption: function (option_list) {
      console.log(option_list)
      var loop_num = option_list.length / 4,
          new_list = [],
          res = {},
          flag = ['A', 'B', 'C', 'D', 'E', 'F'],
          re_content = /"content":"(.+)"/,
          re_true_ans = /"answer":true/,
          re_false_ans = /"answer":false/,
          re_analyse = /"analyse":"(.+)"\}/,
          re_flag = /<[\/*\w]+>/g;
      res.postAnswer = 0;
      for (var i = 0; i < loop_num; i++) {
          var option_obj = {};
          for (var j = 0; j < 4; j++) {
              var str = option_list[4 * i + j];
              if(str) {
                str = str.replace(/\\/g, '');
                str = str.replace(re_flag, '');
                option_obj.value = i;
                if (re_content.test(str)) {
                    var content = RegExp.$1;
                    option_obj.content = flag[i] + '、' + content;
                    option_obj.content = option_obj.content.replace(/&nbsp;/g, '');
                } else if (re_true_ans.test(str)) {
                    option_obj.answer = true;
                    res.answer = i;
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
  adderr: function(e) {
    wx.request({
        url: getApp().globalData.yurl +'/addErrQuestion',
        method: 'POST',
        data: {
            studentId: this.data.studentId,
            questionId: this.data.array[e.target.dataset.index].question_id,
            practiceId: this.data.practiceId
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            wx.showToast({
                title: '已添加到错题本',
            })
        }
    })
  }
})