//获取应用实例  
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: "",
    /**  * 页面配置  */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,

    /* 五星评分数据 */
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/images/normal.png',
    selectedSrc: '/images/selected.png',
    halfSrc: '/images/half.png',
    key: 0,//评分   
    comment: "" 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.userInfo);
    wx.request({
      url: "https://huangwenxin.cn/detailPage.php",
      data:
      {
          id: app.globalData.detailGoodId
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        that.setData({
          detailData: request_res.data
        });
        console.log(that.data.detailData);
      }
    })
    
    

    /*  获取系统信息 */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  //立即购买
  selletment: function (e) {
    wx.navigateTo({
      url: '/pages/selletment/selletment',
    })
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
  },

  submit: function (e) {
    var that = this;
    wx.showLoading({
      title: '提交中...',
      mask: 'true'
    })
    var that = this;
    console.log('这里是submit');
    wx.request({
      url: "https://huangwenxin.cn/comment.php",
      data:
        {
          openid: app.globalData.openid, 
          id: app.globalData.detailGoodId, 
          comment: e.detail.value.comment
        },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        that.setData({
          comment: ''
        })
        console.log(request_res.data);
        wx.hideLoading();
        wx.showToast({
          title: '评论成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  reset: function (e) {
    that.setData({
      comment: ''
    })
    console.log('这里是reset');
  }
})