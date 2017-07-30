// pages/practice/list.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question_list: [],
    yy:'1',
    something:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var replyArr = [];
    var new_list2 = [];
    var self = this;
    wx.request({
      url: getApp().globalData.yurl +'/examQuestionList',
        method: 'GET',
        data: {
            practiceId: options.practiceId
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            var scoreList = res.data;
            wx.request({
              url: getApp().globalData.yurl +'/questionList',
                method: 'GET',
                data: {
                    practice_id: options.practiceId
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    var question_list = res.data,
                        oneString = '',
                        detail_list = [];
                    if (question_list.length == 0)
                    {
                        self.setData({
                          something:"学生尚未做题！",
                        })
                    }
                    for (var i = 0; i < question_list.length; i++) {
                        oneString = ''
                        oneString = oneString + (Number(i) + 1).toString()+ '、'
                        question_list[i].index = i;

                        var option = question_list[i].optionDetail;
                        question_list[i].subject = unescape(question_list[i].subject.replace(/\\u/g, "%u"));
                        question_list[i].subject = question_list[i].subject.replace(/&nbsp;/g, '')
                        oneString = '<div class = "course-title">'+oneString + question_list[i].subject.replace(/&nbsp;/g, '')+'</div>'
                        
                        var totalimgurl = question_list[i].imgUrl.split(',')
                        for(var w = 0; w < totalimgurl.length;w++)
                        {
                          if (totalimgurl[w] != '')
                          {
                            oneString = oneString + '<img src = ' + totalimgurl[w] + ' style = "width:400px">'
                          }
                        }

                        option = unescape(option.replace(/\\u/g, "%u"));
                        question_list[i].optionDetail = option.slice(1, option.length - 1); 
                        var lr = self.parseOption(question_list[i].optionDetail.split(','), new_list2);
                        question_list[i].optionDetail = lr.list;

                        oneString = oneString + '<div class = "option-list">'
                        for (var k = 0; k < lr.list.length; k++) {
                          oneString = oneString + '<div class = "option">'
                          oneString = oneString + lr.list[k].content+'<div></div>'
                          oneString = oneString + '</div>'
                        }
                        oneString = oneString + '</div>'

                        question_list[i].answer = lr.answer;
                        question_list[i].total_analyse = lr.total_analyse;

                        replyArr.push(oneString)
                    }

                    for(var i=0;i<question_list.length;i++) {
                        detail_list[i] = [];
                        for(var j=0;j<scoreList.length;j++) {
                            if(question_list[i].question_id==scoreList[j].question_id && scoreList[j].postAnswer) {
                                detail_list[i].push(scoreList[j]);
                            }
                        }
                    }
                    for(var i=0;i<question_list.length;i++) {
                        var detail = detail_list[i],
                            trueNum = 0;
                        for(var j=0;j<detail.length;j++) {
                            if(detail[j].answer==detail[j].postAnswer) {
                                trueNum++;
                            }
                            var choose = parseInt(detail[j].postAnswer);
                            
                            question_list[i].optionDetail[choose].choose = question_list[i].optionDetail[choose].choose + detail[j].name + '、';
                        }
                        var trueRate = trueNum/detail.length;
                        if(isNaN(trueRate)){
                            trueRate = 0;
                        }
                        question_list[i].trueRate = (Math.round(trueRate * 10000) / 100).toFixed(2) + '%'
                        replyArr[i] = replyArr[i] + '<div class="true-answer" style = "width:100%">正确率：' + (Math.round(trueRate * 10000) / 100).toFixed(2) + '%'
                        console.log(question_list[i].optionDetail)
                        for (var uu = 0; uu < question_list[i].optionDetail.length;uu++)
                        {
                          if (question_list[i].optionDetail[uu].answer == true)
                          {
                            replyArr[i] = replyArr[i] + '<div style = "color:#0000FF">'+question_list[i].optionDetail[uu].theflag + question_list[i].optionDetail[uu].choose + '</div>'
                          }
                          else {
                            replyArr[i] = replyArr[i] + '<div style = "color:#FF0000">' + question_list[i].optionDetail[uu].theflag + question_list[i].optionDetail[uu].choose + '</div>'
                          }
                        }
                        replyArr[i] = replyArr[i] + '</div><br></br>'
                    }
                    self.setData({
                        question_list: question_list
                    })
                    console.log(new_list2)
                    for (let i = 0; i < replyArr.length; i++) {
                      WxParse.wxParse('reply' + i, 'html', replyArr[i], self);
                      if (i === replyArr.length - 1) {
                        WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, self)
                      }
                    }
                    
                }
            })
        }
    })
    
  },
  parseOption: function (option_list, new_list2) {
      var loop_num = option_list.length / 4,
          new_list = [],
          res = {},
          flag = ['A', 'B', 'C', 'D', 'E','F'],
          re_content = /"content":"(.+)"/,
          re_true_ans = /"answer":true/,
          re_false_ans = /"answer":false/,
          re_analyse = /"analyse":"(.+)"\}/,
          re_flag = /<[\/*\w]+>/g;
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
                    option_obj.theflag = flag[i] + '：';
                    option_obj.content = option_obj.content.replace(/&nbsp;/g, '');
                    option_obj.content = option_obj.content.replace(/&gt;/g, '');
                    option_obj.choose = '';
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
          new_list2.push(option_obj.content);
      }
      var total_analyse = "此题正确答案为：" + flag[res.answer] + ';';
      
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
  
  }
})