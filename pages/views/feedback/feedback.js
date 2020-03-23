// pages/views/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  submit: function(e){
    if (e.detail.value.title == '' ||
      e.detail.value.text == '') {
      wx.showModal({
        content: '要填写完整哦(*^_^*)'
      })
    } else {
      wx.showLoading({
        title: '意见上传中...',
        mask: 'true'
      })
      wx.request({
        url: "https://huangwenxin.cn/subber/feedback.php",
        data:
          {
            title: e.detail.value.title,
            text: e.detail.value.text
          },
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: function (request_res) {
          console.log(request_res.data);
          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          wx.navigateTo({
            url: '/pages/views/back/back',
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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