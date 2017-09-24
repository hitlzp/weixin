// pages/question/questionlist.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options.practiceId);
    wx.request({
          url: getApp().globalData.yurl +'/questionList',
          method: 'GET',
          data: {
            practice_id: options.practiceId,
            class_id:options.class_id
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            /*var question_list = res.data;
            for(var i=0;i<question_list.length;i++) {
              question_list[i].index = i;
              var option = question_list[i].optionDetail;
              question_list[i].subject = unescape(question_list[i].subject.replace(/\\u/g, "%u"));
              option = unescape(option.replace(/\\u/g, "%u"));
              question_list[i].optionDetail = option.slice(1,option.length-1);
              question_list[i].optionDetail = self.parseOption(question_list[i].optionDetail.split(','))
            }
            self.setData({
              array: question_list,
              practiceId: options.practiceId
            })*/
          }
        })
  },
  parseOption:function(option_list) {
    var loop_num = option_list.length/4,
        new_list = [],
        re_content = /"content":"(.+)"/,
        re_true_ans = /"answer":true/,
        re_false_ans = /"answer":false/,
        re_analyse = /"analyse":"(.+)"\}/,
        re_flag = /<[\/*\w]+>/g;
    for(var i=0;i<loop_num;i++) {
      var option_obj = {};
      for(var j=0;j<4;j++) {
        var str = option_list[4*i+j];
        str = str.replace(/\\/g,'');
        str = str.replace(re_flag, '');
        option_obj.value = i;
        if(re_content.test(str)) {
          option_obj.content = RegExp.$1;
        }else if(re_true_ans.test(str)) {
          option_obj.answer = true;
        }else if(re_false_ans.test(str)) {
          option_obj.answer = false;
        }else if(re_analyse.test(str)) {
          option_obj.analyse = RegExp.$1;
        }
      }
      new_list.push(option_obj);
    }
      if(new_list.length>4 && !new_list[4].answer) {
        new_list.pop();
      }else if(new_list.length>4 && new_list[4].answer) {
        new_list.shift();
      }
    return new_list;
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
  }
})