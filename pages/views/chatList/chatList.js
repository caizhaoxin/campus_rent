// pages/views/chatList/chatList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noLogin: '',
    chatDataList: ''
  },
  getChatData: function(){
    var that = this;
    if (app.globalData.loginStatus == 0) {
      this.setData({
        noLogin: '要登录才可以跟别人悄悄话哦😀'
      })
    } else {
      wx.showLoading({
        title: '加载中....',
      });
      wx.request({
        url: "https://huangwenxin.cn/getter/getChatList.php",
        data:
          {
            myOpenid: app.globalData.openid
          },
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: function (request_res) {
          console.log(request_res.data[0]);
          that.setData({
            noLogin: '',
            chatDataList: request_res.data
          })
          wx.hideLoading();
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getChatData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getChatData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getChatData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getChatData();
  },
  trun_to_charRoom: function (e) {
    console.log(e.currentTarget.dataset.avatarurl);
    var myOpenid = app.globalData.openid;
    var oppositeOpenid = e.currentTarget.dataset.senteropenid;
    var avatarUrl = e.currentTarget.dataset.avatarurl;
    wx.navigateTo({
      url: '/pages/views/chatRoom/chatRoom?myOpenid=' + myOpenid + '&oppositeOpenid=' + oppositeOpenid + '&OppositeAvatarUrl=' + avatarUrl
    })
  },
})