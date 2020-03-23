// 我的收藏
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    startX: 0, //开始坐标
    startY: 0,
    goodsList: '',
    requirementList: '',
    loadingGif: true,
    noneGood: false,
    
    noneRequirement: false

  },

  /**  * 滑动切换tab   */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    console.log(e.detail.current);
  },


  /**  * 点击tab切换  */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current

      })
      console.log(e.currentTarget.dataset.current)
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.isCollectionPage = 1;
    console.log(app.globalData.isCollectionPage+" collection");
    var that = this;
    if (app.globalData.loginStatus==0){
      wx.showModal({
        content: '请先在”我的“页面登录后再进行查看收藏操作',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            wx.switchTab({
              url: "/mypages/user/user"
            })
          }
        }
      })
    }else{
    /*  wx.showLoading({
        title: '数据加载中...',
        mask: 'true'
      })*/
      wx.request({
        url: "https://huangwenxin.cn/getter/getMyCollection.php",
        data:
          {
            openid: app.globalData.openid
          },
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        //加载完成
        success: function (request_res) {
          setTimeout(function () {
            if (request_res.data.goodsList == '') {
              that.setData({
                noneGood: true
              });
            };
            if (request_res.data.requirementList == ''){
              that.setData({
                noneRequirement: true
              });
            };

            that.setData({
              
              goodsList: request_res.data.goodsList,
              requirementList: request_res.data.requirementList,
              loadingGif: false
            });
          });//延时
          console.log(request_res.data);
          console.log(that.data.noneGood); //没加that.data!!!!!
         // wx.hideLoading();
        }
      })
    }
  },
  onUnload: function () {
    app.globalData.isCollectionPage = 0;
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.onLoad();
  },
  deleteColleciton: function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var tableName = e.currentTarget.dataset.tablename;
    var openid = app.globalData.openid;
    wx.showModal({
      title: '您是否确定删除收藏？',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.showLoading({
            title: '删除收藏中...',
            mask: 'true'
          })
          wx.request({
            url: "https://huangwenxin.cn/subber/subCollection.php",
            data:
              {
                tableName: tableName,
                id: id,
                openid: openid
              },
            method: 'GET',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            success: function (request_res) {
              wx.hideLoading();
              wx.showToast({
                title: '成功',
              })
              setTimeout(function () {
                that.setData({
                  loadingGif: true
                });
              });
              setTimeout(function () {
                //调用当前页面的onload方法
                that.onLoad();
              });

            }
          })
        }
      }
    })
  },
  switch_to_requirement: function(e){
    var itemData = e.currentTarget.dataset.itemdata;
    wx.navigateTo({
      url: '/pages/views/rent_seeking/rent_seeking_detail?itemData=' + JSON.stringify(itemData)
    })
  },
  switch_to_store: function (e) {
    var itemData = e.currentTarget.dataset.itemdata;
    wx.navigateTo({
      url: '/pages/views/source_of_good_detail/source_of_good_detail?itemData=' + JSON.stringify(itemData)
    })
  }
})