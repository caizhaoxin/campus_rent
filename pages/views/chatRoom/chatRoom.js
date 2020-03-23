// pages/views/chatRoom/chatRoom.js
//console.log("chat " + options.myOpenid + " " + options.oppositeOpenid);
const app = getApp();
var inputVal = '';
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    cusHeadIcon: "",
    msgList: "",
    myOpenid: 'A',
    otherOpenid: 'B',
    OppositeAvatarUrl: '',
    MyAvatarUrl: '',
    myOpenid: '',
    oppositeOpenid: '',
    inputVal: ''
  },
  /**
   * 初始化数据
   */
  initData: function () {
    var that = this;
    inputVal = '';
    wx.request({
      url: "https://huangwenxin.cn/getter/getChat.php",
      data:
        {
          myOpenid: that.data.myOpenid,
          oppositeOpenid: that.data.oppositeOpenid
        },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        console.log(request_res.data);
        that.setData({
          msgList: request_res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cusHeadIcon: "",
      myOpenid: options.myOpenid,
      oppositeOpenid: options.oppositeOpenid,
      MyAvatarUrl: app.globalData.userInfo.avatarUrl,
      OppositeAvatarUrl: options.OppositeAvatarUrl
    });
    this.initData();
    wx.request({
      url: "https://huangwenxin.cn/makeChatDataHaveRead.php",
      data:
        {
          myOpenid: options.myOpenid,
          oppositeOpenid: options.oppositeOpenid,
        },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        console.log(request_res.data);
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.initData();
  },
  /**
   * 获取聚焦
   */
  focus: function (e) {
    var that = this;
    that.initData();
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (that.data.msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    var that = this;
    that.initData();
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (that.data.msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  submitChatMes: function(chatMes){
    var that = this;
    wx.request({
      url: "https://huangwenxin.cn/subber/subChat.php",
      data:
        {
          myOpenid: that.data.myOpenid,
          oppositeOpenid: that.data.oppositeOpenid,
          text: chatMes
        },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        console.log(request_res.data);
        that.initData();
        that.setData({
          inputVal: ''
        })
        wx.hideLoading();
      }
    })
  },
  sendClick: function (e) {
    wx.showLoading({
      title: '发送中...',
      mask: 'false'
    })
    this.submitChatMes(e.detail.value);
  },
  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  },
  input: function(e){
    this.setData({
      inputVal: e.detail.value
    })
    console.log(this.data.inputVal);
  },
  bottonSubmit: function(){
    this.submitChatMes(this.data.inputVal);
  }
})