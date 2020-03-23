// pages/views/sort/sort.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchBox: {
      autoFocus: true,
      showInput: true,
      blurEvent: 'search'
    },
    search_box_height: 0,
    winWidth: 0,
    winHeight: 0,
    hideden: false,
    curNav: 1,
    curIndex: 0,
    cart: [],
    cartToal: 0,
    viewIndex: "",
    navList: [
      {
        id: 1,
        name:'书籍'
      },
      {
        id: 2,
        name: '服装'
      },
      {
        id: 3,
        name: '道具'
      },
      {
        id: 4,
        name: '文具'
      },
      {
        id: 5,
        name: '电子产品'
      },
      {
        id: 6,
        name: '家具'
      },
      {
        id: 7,
        name: '交通工具'
      },
      {
        id: 8,
        name: '其他'
      }
    ],
    dishesList:"",
    dishes: []
  },
  sort: function (type) {
    var that = this;
    wx.request({
      url: "https://huangwenxin.cn/sort.php",
      data:
      {
          type: type
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        that.setData({
          dishesList: request_res.data
        });
      }
    })
  },
  tap: function(e){
      var index = e.currentTarget.dataset.index;
      app.globalData.detailGoodId = this.data.dishesList[index].id;
  },
  selectNav(e) {
    wx.showLoading({
      title: '处理中...',
      mask: 'true'
    })
    var that = this;
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    self = this;
    //console.log(this.data.navList[index].name);
    that.sort(that.data.navList[index].name);
    this.setData({
      curNav: id,
      curIndex: index
    })
    wx.hideLoading();
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.sort(that.data.navList[that.data.curIndex].name);
    // 获取系统信息，设置内容区域的宽高
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight - 60
        })
      }
    })
  }
})