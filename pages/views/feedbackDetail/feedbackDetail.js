// pages/views/feedbackDetail/feedbackDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbackList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('24323423d23f23f');
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
      mask: 'true'
    })
    wx.request({
      url: "https://huangwenxin.cn/getter/getfeedback.php",
      data:{},
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        console.log('24323423d23f23f');
        console.log(request_res.data);
        wx.hideLoading();
        wx.showToast({
          title: '成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        that.setData({
          feedbackList: request_res.data
        })
      }
    })
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  }
})