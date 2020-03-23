// mypages/me/me.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "",
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loginChange: "loginButton",
    isManager: ''
  },
  
  //帮助
    helpMe: function() {
    wx.navigateTo({
      url: "/pages/views/help/help",
    })
  },
  // 关于我们
  aboutMe: function (){
    wx.navigateTo({
      url: '/pages/views/about/about',
    })
  },
  // 分享功能
  onShareAppMessage: function (res) {

    var that = this;

    return {

      title: '租租网',

      path: '/pages/views/user/user',

      success: function (res) {

        console.log("转发成功:" + JSON.stringify(res));

        that.shareClick();

      },

      fail: function (res) {

        console.log("转发失败:" + JSON.stringify(res));

      }

    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo);
              console.log("AAA");
              //用户已经授权过
            }
          })
        }
      }
    })
  },
  bindGetuserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
       console.log(e.detail.userInfo);
      wx.showLoading({
        title: '登录中...',
        mask: 'true'
      })
      that.setData({
        userInfo: e.detail.userInfo,
        loginChange: "picture"
      })
      app.globalData.userInfo = e.detail.userInfo;  //更改全局变量的userinfo
       wx.login({
          success: function (login_res) {
          console.log(login_res.code+" wx.login的code");
          if (login_res.code) {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              wx.request({
                  url: "https://huangwenxin.cn/login.php",
                  data:
                  {
                      code: login_res.code,
                      avatarUrl: e.detail.userInfo.avatarUrl,
                      city: e.detail.userInfo.city,
                      country: e.detail.userInfo.country,
                      gender: e.detail.userInfo.gender,
                      language: e.detail.userInfo.language,
                      nickName: e.detail.userInfo.nickName,
                      province: e.detail.userInfo.province
                  },
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                  },
                  success: function (request_res) {
                    console.log('login ' + request_res.data.openid);
                    console.log('login ' + request_res.data.isManager); 
                    app.globalData.loginStatus = 1;
                    app.globalData.openid = request_res.data.openid;
                    app.globalData.isManager = request_res.data.isManager;
                    wx.hideLoading();
                    wx.showToast({
                      title: '成功',
                      icon: 'succes',
                      duration: 1000,
                      mask: true
                    })
                    that.setData({
                      isManager: app.globalData.isManager
                    })
                  }
                })
            }
          }
        })
    } else {
      //用户按了拒绝按钮
    }
  },
  logOut: function () { //退出登录
    var that = this;
    wx.showModal({
      title: '你就这么忍心退出登录么!',
      content: '/(ㄒoㄒ)/~~',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          app.globalData.avatarUrl = null,
            app.globalData.userInfo = null,
            app.globalData.loginStatus = 0,
            app.globalData.openid = null,
            app.globalData.detailGoodId = "",
            app.globalData.isManager = 0;
            app.globalData.rent_seek_detailData = ''
          that.setData({
            loginChange: 'loginButton'
          })
        }
      }
    })
  }
})