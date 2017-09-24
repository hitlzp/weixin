// pages/practice/startpractice.js
var practiceId, student_id, class_id;
Page({
  data:{
    answer: [],
    complete: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的
    var self = this;
    practiceId=options.practiceId,
    class_id = options.class_id;
    wx.getStorage({
      key: 'user',
      success: function(res){
       student_id = res.data;
       console.log(options.practiceId)
        wx.request({
          url: getApp().globalData.yurl +'/questionListStudent',
          method: 'GET',
          data: {
            //student_id: student_id,
            practice_id: options.practiceId,
            class_id: options.class_id
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res.data)
            var question_list = res.data;
            for(var i=0;i<question_list.length;i++) {
              question_list[i].index = i;
              var option = question_list[i].optionDetail;
              question_list[i].subject = unescape(question_list[i].subject.replace(/\\u/g, "%u"));
              question_list[i].subject = question_list[i].subject.replace(/&nbsp;/g, '')
              option = unescape(option.replace(/\\u/g, "%u"));
              question_list[i].optionDetail = option.slice(1,option.length-1);
              var lr = self.parseOption(question_list[i].optionDetail.split(','));
              question_list[i].optionDetail = lr.list;
              question_list[i].answer = lr.answer;
              question_list[i].total_analyse = lr.total_analyse;
            }
            self.setData({
              array: question_list,
              practiceId: options.practiceId,
              studentId: student_id
            })
          }
        })
      }
    })
  },
  parseOption:function(option_list) {
    var loop_num = option_list.length/4,
        new_list = [],
        res = {},
        flag = ['A','B','C','D','E','F'],
        re_content = /"content":"(.+)"/,
        re_true_ans = /"answer":true/,
        re_false_ans = /"answer":false/,
        re_analyse = /"analyse":"(.+)"\}/,
        re_flag = /<[\/*\w]+>/g;
    for(var i=0;i<loop_num;i++) {
      var option_obj = {};
      for(var j=0;j<4;j++) {
        var str = option_list[4*i+j];
        if(str) {
            str = str.replace(/\\/g,'');
            str = str.replace(re_flag, '');
            option_obj.value = i;
            if(re_content.test(str)) {
                var content = RegExp.$1;
                option_obj.content = flag[i] + '、' + content;
                option_obj.content = option_obj.content.replace(/&nbsp;/g, '');
            }else if(re_true_ans.test(str)) {
            option_obj.answer = true;
            res.answer = i;
            }else if(re_false_ans.test(str)) {
            option_obj.answer = false;
            }else if(re_analyse.test(str)) {
            option_obj.analyse = RegExp.$1;
            option_obj.analyse = option_obj.analyse.replace(/&nbsp;/g, ' ')
            }
        }
      }
      new_list.push(option_obj);
    }
    var total_analyse = "此题正确答案为："+flag[res.answer]+';';
    for(var i=0;i<new_list.length;i++) {
      if (new_list[i].analyse) {
        total_analyse += (flag[i] + '、' +new_list[i].analyse);
      }
    }
    res.list = new_list;
    res.total_analyse = total_analyse;
    return res;
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
  radioChange: function(e) {
    var ans = this.data.answer,
        list = this.data.array;
    ans.push({
      index: e.currentTarget.dataset.index,
      postAnswer: e.detail.value,
      answer: list[e.currentTarget.dataset.index].answer,
      question_id: list[e.currentTarget.dataset.index].question_id
    })

    this.setData({
      answer: ans
    })
  },
  submitPractice: function() {
    var open;
    wx.getStorage({
      key: 'class',
      success: function(res) {
        var classid=res.data;
        wx.request({
          url: getApp().globalData.yurl +'/managePractice',
          method: 'get',
          data: {
            class_id: classid
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            open=res.data[0].practiceID;
            if (res.data[0].practiceID == '0') {
             // console.log(res.data);
              wx.navigateTo({
                url: '/pages/class/classindex?practiceId=' + practiceId + '&classId=' + classid
              })
              wx.showToast({
                title: '测试系统未开放',
                icon: 'loading'
              })
            }
     

          }
        })
      },
    })
  if (open == '0') {
      // console.log(res.data);
    wx.showToast({
      title: '测试系统未开放',
      icon: 'loading'
    })
      wx.navigateTo({
        url: '/pages/class/classindex?practiceId=' + practiceId + '&classId=' + classid
      })

    }
    else{
  if (this.data.answer.length < this.data.array.length) {
      wx.showToast({
        title: '你还有题目没有作答',
        icon: 'loading'
      })
    } else {
      var self = this,
        grades = 0,
        complete = [];

      for (var i = 0; i < this.data.answer.length; i++) {
        if (this.data.answer[i].answer == this.data.answer[i].postAnswer) {
          complete[i] = 1;
          grades++;
        } else {
          complete[i] = 2;
        }
      }
      var showGrades = grades + '/' + this.data.answer.length;
      //console.log('haha');
      //console.log(self.data.studentId, self.data.practiceId)
      wx.request({
        url: getApp().globalData.yurl + '/postAnswer',
        method: 'POST',
        data: {
          list: self.data.answer,
          student_id: self.data.studentId,
          goodNum: grades,
          totalNum: self.data.answer.length,
          practice_id: self.data.practiceId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function () {
          console.log('haha1');
          wx.navigateTo({
            url: '/pages/practice/submit?practiceId=' + self.data.practiceId + '&studentId=' + self.data.studentId
          })

        }
      })

      wx.showToast({
        title: '你的练习已提交'
      })
      this.setData({
        complete: complete,
        grades: showGrades
      })
    }


  }
  }



})