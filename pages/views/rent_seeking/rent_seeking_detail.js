  // pages/views/rent_seeking/rent_seeking_detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailDate: '',
    tableName: 'requirement',
    isManager: 0,
    isCollected: '0',
    isCollectionPage: '',
    footer_nav_index: 0,
    noDataMes: ''
  },
  // 分享功能
  onShareAppMessage: function (res) {

    var that = this;

    return {

      title: '租租网',

      path: '/pages/views/rent_seeking/rent_seeking_detail',

      success: function (res) {

        console.log("转发成功:" + JSON.stringify(res));

        that.shareClick();

      },

      fail: function (res) {

        console.log("转发失败:" + JSON.stringify(res));

      }

    }

  },
  //查看照片
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.detailDate.src
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var itemData = JSON.parse(options.itemData);
    wx.request({
      url: "https://huangwenxin.cn/getter/checkInfoExit.php",
      data:
        {
          tableName: 'requirement',
          id: itemData.id
        },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        console.log(request_res.data);
        if (request_res.data == '1') {
          console.log('abc');
          wx.request({
            url: "https://huangwenxin.cn/getter/get_if_collected.php",
            data:
              {
                openid: app.globalData.openid,
                tableName: 'requirement',
                id: itemData.id
              },
            method: 'GET',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            success: function (request_res) {
              console.log(request_res.data);
              wx.hideLoading();
              if (request_res.data == 1) {
                that.setData({
                  requirementList: request_res.data,
                  isCollected: '1'
                })
              }
            }
          })
          that.setData({
            detailDate: itemData,
            isManager: app.globalData.isManager,
            isCollectionPage: app.globalData.isCollectionPage
          })
        } else if (request_res.data == '0') {
          console.log('qwe');
          console.log(that.data.noDataMes);
          that.setData({
            noDataMes: "该信息已被删除。"
          })
        }
      }
    })
  },
  makeCall: function(){  //电话接口
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.detailDate.phoneNumber
    })
  },
  store: function(){   //收藏
    if (app.globalData.loginStatus == 0) {
      wx.showModal({
        title: '尊敬的用户请注意！',
        content: '请先在”我的“页面登录后再进行收藏操作'
      })
      return;
    }
    var that = this;
    wx.showLoading({
      title: '收藏中...',
      mask: 'true'
    })
    wx.request({
      url: "https://huangwenxin.cn/subber/subCollection.php",
      data:
        {
          tableName: that.data.tableName,
          id: that.data.detailDate.id,
          openid: app.globalData.openid
        },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        wx.hideLoading();
        wx.showToast({
          title: request_res.data.mes,
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        if (request_res.data.mes == '收藏成功') {
          that.setData({
            isCollected: 1
          })
        } else if (request_res.data.mes == '已取消') {
          that.setData({
            isCollected: 0
          })
        }
      }
    })
  },
  onHide: function (options) {
    this.setData({
      footer_nav_index: 0
    })
  },
  //选择微信
  select_footer_nav1: function (e) {
    if (this.data.footer_nav_index == 1) {
      this.setData({
        footer_nav_index: 0,
      });
    }
    else {
      this.setData({
        footer_nav_index: e.currentTarget.dataset.footer_nav_index,
      });
    };
    console.log();
  },

  // 选择电话
  select_footer_nav2: function (e) {
    if (this.data.footer_nav_index == 2) {
      this.setData({
        footer_nav_index: 0,
      });
    }
    else {
      this.setData({
        footer_nav_index: e.currentTarget.dataset.footer_nav_index,
      });
    };
  },
  // 跳转到私信
  trun_to_charRoom: function (e) {
    if (app.globalData.loginStatus == 0) {
      wx.showModal({
        content: '登录后才可以私信哦(*^_^*)'
      })
      return;
    }
    var myOpenid = app.globalData.openid;
    var detailDate = this.data.detailDate;
    var oppositeOpenid = detailDate.openid;
    console.log(myOpenid);
    console.log(oppositeOpenid);
    wx.navigateTo({
      url: '/pages/views/chatRoom/chatRoom?myOpenid=' + myOpenid + '&oppositeOpenid=' + oppositeOpenid + '&OppositeAvatarUrl=' + detailDate.avatarUrl
    })
  },
  deleteSubmit: function () {
    var that = this;
    wx.showModal({
      title: '您是否确定删除？',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.showLoading({
            title: '删除中...',
            mask: 'true'
          })
          wx.request({
            url: "https://huangwenxin.cn/deleteSubmit.php",
            data:
              {
                tableName: that.data.tableName,
                id: that.data.detailDate.id
              },
            method: 'GET',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            success: function (request_res) {
              //然后还要自动刷新对应的页面，没错就就是自动onLoad
             // app.globalData.haveSubmittedRequirement = 1;
              console.log(request_res.data);
              wx.hideLoading();
              wx.showToast({
                title: '删除成功',
                icon: 'succes',
                duration: 1000,
                mask: true
              })
              //返回前一个页面并调用前一个页面的onload
              var pages = getCurrentPages(); // 当前页面
              var beforePage = pages[pages.length - 2]; // 前一个页面
              wx.navigateBack({
                success: function () {
                  beforePage.onLoad(); // 执行前一个页面的onLoad方法
                }
              })
            }
          })
        }
      }
    })
  },
  wxIDCopy: function(){
    var that = this;
    wx.setClipboardData({
      data: that.data.detailDate.wxID,
      success: function (res) {
        wx.getClipboardData({//  这个api是把拿到的数据放到电脑系统中的
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
    wx.showToast({
      title: '复制成功',
    })
  }
})