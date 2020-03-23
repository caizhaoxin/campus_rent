//获取应用实例  
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**  * 页面配置  */
    winWidth: 0,
    winHeight: 0,
    userImage: app.globalData.avatarUrl,
    // tab切换  
    currentTab: 0,
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: "https://huangwenxin.cn/getRequirement.php",
      data:
      {
          openid: app.globalData.openid
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        that.setData({
          requirementList: request_res.data
        });
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  /**  * 滑动切换tab   */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /**  * 点击tab切换  */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})