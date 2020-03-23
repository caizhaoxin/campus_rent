// pages/views/rent_seeking/rent_seeking.js
var universityData = require('../universityData/GARUD.js');
var foodData = require('food.js');
var sortData = require('sort.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    universityFilter: "不限",
    campusFilter: "不限",
    displaycity: 0,
    university: "学校",
    money: "租金预算",
    selectType: '不限',
    select2: '不限',
    select3: '不限',
    showNavIndex: '',
    utName: '',
    temp: '',
    rent: "租金预算",
    food: '类型',
    tableName: 'requirement',
    requirementList: [],
    nowContition: '默认排序',

    loadingGif: true, //用来加载动画,会铺满整个页面的gif
    downGif: false, //下拉加载动画
    noData: false, //用来表示没有数据了

    //一开始导航栏的都是关闭的
    universityListOpen: false,
    foodListOpen: false,
    rentListOpen: false,
    sortListOpen: false,

    universityListClose: true,
    foodListClose: true,
    rentListClose: true,
    sortListClose: true,

    universityRotateStart: false,
    foodRotateStart: false,
    rentRotateStart: false,

    universityName: universityData.getUniversity(),
    foodName: foodData.getFoodList(),
    sortName: sortData.getSortData(),
    campus: {},
    endIndex: 0, //用于继续加载数据,
    getNum: 0,
    haveReachBottom: 0
  },
  // 分享功能
  onShareAppMessage: function (res) {

    var that = this;

    return {

      title: '租租网',

      path: '/pages/views/rent_seeking/rent_seeking',

      success: function (res) {

        console.log("转发成功:" + JSON.stringify(res));

        that.shareClick();

      },

      fail: function (res) {

        console.log("转发失败:" + JSON.stringify(res));

      }

    }

  },
  // 点击发布求租
  uploadRentseeking: function(e){
    wx.navigateTo({
      url: "/pages/views/upload/upload_rentSeeking_message/upload_rentSeeking_message",
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  initate: function() {
    var that = this;
    console.log(that.data.endIndex);
    wx.request({
      url: "https://huangwenxin.cn/sort.php",
      data:
        {
          endIndex: that.data.endIndex,
          tableName: that.data.tableName
        },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        //   console.log(request_res.data.length);
        console.log(request_res.data);
        var requirementList = that.data.requirementList;
        var requirementList = requirementList.concat(request_res.data);
        if (request_res.data.length == 0) {
          that.setData({
            noData: true
          })
        }
        that.setData({
          getNum: request_res.data.length,
          endIndex: that.data.endIndex + request_res.data.length,
          requirementList: requirementList,
          loadingGif: false,//整个页面加载的动画结束
          downGif: false, //下拉加载动画结束
          haveReachBottom: 0
        });
        // console.log(that.data.endIndex);
        var requirementList = that.data.requirementList;
        var condition = that.data.condition;
        if (condition == '租金由低到高') {
          requirementList.sort(that.sortRentalOrder);
          that.setData({
            requirementList: requirementList
          })
        } else if (condition == '租金由高到低') {
          requirementList.sort(that.sortRentalReorder);
          that.setData({
            requirementList: requirementList
          })
        } else if (condition == '默认排序') {
          requirementList.sort(that.moren);
          that.setData({
            requirementList: requirementList
          })
        }
      }
    })
  },
  onLoad: function(options) {
    this.initate();
  },
  onShow: function () {
    console.log(app.globalData.submitID);
    if (app.globalData.haveSubmittedRequirement == 1) {
      app.globalData.haveSubmittedRequirement = 0;
      this.setData({
        getNum: 0,
        endIndex: 0,
        requirementList: [],
        loadingGif: true, //用来加载动画,会铺满整个页面的gif
        downGif: false, //下拉加载动画
        noData: false, //用来表示没有数据了
        haveReachBottom: 0
      });
      this.initate();
    }
  },
  onHide: function() {
    this.setData({
      universityListOpen: false,
      foodListOpen: false,
      rentListOpen: false,
      sortListOpen: false,

      universityListClose: true,
      foodListClose: true,
      rentListClose: true,
      sortListClose: true,

      universityRotateStart: false,
      foodRotateStart: false,
      rentRotateStart: false,
      university: "学校",
      universityFilter: "不限",
      campusFilter: "不限",
      selectType: '不限',
      select2: '不限',
      select3: '不限',
      showNavIndex: '',
      utName: '',
      temp: '',
      infoType: "类型",
      food: '物品种类',
      tableName: 'requirement',
      nowContition: '默认排序',
      downGif: false
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      getNum: 0,
      endIndex: 0,
      requirementList: [],
      loadingGif: true, //用来加载动画,会铺满整个页面的gif
      downGif: false, //下拉加载动画
      noData: false, //用来表示没有数据了
      haveReachBottom: 0
    });
    that.initate();
    wx.stopPullDownRefresh();
  },
  scrolltolower: function (e) {
    var that = this;
    if (this.data.haveReachBottom == 0) {
      if (this.data.getNum != 0) {
        this.initate();
        that.setData({
          downGif: true,
          haveReachBottom: 1
        })
      } else {
        that.setData({
          downGif: false,
          noData: true,
          haveReachBottom: 1
        })
      }
    }
  },
  //点击学校
  universityList: function(e) {
    if (this.data.universityListOpen) {
      //如果是打开状态，那就全部关闭
      this.setData({

        universityListOpen: false,
        foodListOpen: false,
        rentListOpen: false,
        sortListOpen: false,
        universityRotateStart: false,
        foodRotateStart: false,
        rentRotateStart: false,

        showNavIndex: 0
      })
    } else {
      this.setData({
        universityListOpen: true,
        foodListOpen: false,
        rentListOpen: false,
        sortListOpen: false,

        universityListClose: false,
        foodListClose: true,
        rentListClose: true,
        sortListClose: true,

        universityRotateStart: true,
        foodRotateStart: false,
        rentRotateStart: false,

        showNavIndex: e.currentTarget.dataset.nav
      })
    }
  },

  //点击类型
  foodList: function(e) {
    if (this.data.foodListOpen) {
      //如果是打开状态，那就全部关闭
      this.setData({
        universityListOpen: false,
        foodListOpen: false,
        rentListOpen: false,
        sortListOpen: false,


        // universityListClose: true,

        // rentListClose: true,
        // sortListClose: true,

        universityRotateStart: false,
        foodRotateStart: false,
        rentRotateStart: false,

        showNavIndex: 0
      })
    } else {
      this.setData({
        universityListOpen: false,
        foodListOpen: true,
        rentListOpen: false,
        sortListOpen: false,


        universityListClose: true,
        foodListClose: false,
        rentListClose: true,
        sortListClose: true,

        universityRotateStart: false,
        foodRotateStart: true,
        rentRotateStart: false,

        showNavIndex: e.currentTarget.dataset.nav
      })
    }
  },
  //点击租金预算
  rentList: function(e) {
    if (this.data.rentListOpen) {
      //如果是打开状态，那就全部关闭
      this.setData({
        universityListOpen: false,
        foodListOpen: false,
        rentListOpen: false,
        sortListOpen: false,
        universityRotateStart: false,
        rentRotateStart: false,
        foodRotateStart: false,
        showNavIndex: 0
      })
    } else {
      this.setData({
        universityListOpen: false,
        foodListOpen: false,
        rentListOpen: true,
        sortListOpen: false,

        universityListClose: true,
        foodListClose: true,
        rentListClose: false,
        sortListClose: true,

        universityRotateStart: false,
        rentRotateStart: true,
        foodRotateStart: false,


        showNavIndex: e.currentTarget.dataset.nav
      })
    }
  },
  //点击排序
  sortList: function(e) {
    if (this.data.sortListOpen) {
      //如果是打开状态，那就全部关闭
      this.setData({
        foodListOpen: false,
        universityListOpen: false,
        rentListOpen: false,
        sortListOpen: false,


        universityRotateStart: false,
        foodRotateStart: false,
        rentRorateStart: false,

        showNavIndex: 0
      })
    } else {
      this.setData({
        universityListOpen: false,
        foodListOpen: false,
        rnetListOpen: false,
        sortListOpen: true,

        universityListClose: true,
        foodListClose: true,
        rentListClose: true,
        sortListClose: false,

        universityRotateStart: false,
        foodRotateStart: false,
        rentRorateStart: false,


        showNavIndex: e.currentTarget.dataset.nav
      })
    }
  },

  //选择学校
  selectUniversity: function(e) {
    var that = this;
    if (e.currentTarget.dataset.current_university == '不限') {
      this.setData({
        university: '学校'
      });
      that.onHide();
    } else {
      this.setData({
        university: e.currentTarget.dataset.current_university
      });
    }
    this.setData({
      campus: this.data.universityName[e.currentTarget.dataset.current_university],
      select1: e.target.dataset.current_university,
      universityFilter: e.currentTarget.dataset.current_university,
      campusFilter: '不限',
      select2: '不限'
    });
    this.onShow();
  },
  //选择校区
  selectCampus: function(e) {
    if (e.target.dataset.current_campus == '不限') {
      this.setData({
        select2: e.target.dataset.current_campus,
        universityListOpen: false,
        campusFilter: e.target.dataset.current_campus,
        showNavIndex: 0,
        //三角形转回去
        universityRotateStart: false,
      });
    } else {
      this.setData({
        select2: e.target.dataset.current_campus,
        university: e.currentTarget.dataset.current_campus,
        universityListOpen: false,
        //三角形转回去
        universityRotateStart: false,
        campusFilter: e.target.dataset.current_campus,
        showNavIndex: 0,
      });
    }
  },
  //选择物品类型
  selectType: function(e) {
    if (e.currentTarget.dataset.current_food == '不限') {
      this.setData({
        food: '物品种类',
      });
      this.onHide();
    } else {
      this.setData({
        food: e.currentTarget.dataset.current_food
      });
    }
    this.setData({
      selectType: e.target.dataset.current_food,
      foodListOpen: false,
      //三角形转回去
      foodRotateStart: false,
      showNavIndex: 0,
    });
    this.onShow();
  },
  //选择物品类型
  //排序函数：按租金顺序
  sortRentalOrder: function(a, b) {
    return a.rental - b.rental
  },
  //排序函数：按租金倒叙
  sortRentalReorder: function(a, b) {
    return b.rental - a.rental
  },
  //排序函数：按时间顺序从早到晚
  moren: function(a, b) {
    var dataA = new Date(a.submitTime);
    var dataB = new Date(b.submitTime);
    return dataB.getTime() - dataA.getTime()
  },
  selectSort: function(e) {
    var requirementList = this.data.requirementList;
    var that = this;
    var condition = e.target.dataset.current_sort
    that.setData({
      condition: condition
    })
    if (condition == '租金由低到高') {
      requirementList.sort(that.sortRentalOrder);
      that.setData({
        requirementList: requirementList
      })
    } else if (condition == '租金由高到低') {
      requirementList.sort(that.sortRentalReorder);
      that.setData({
        requirementList: requirementList
      })
    } else if (condition == '默认排序') {
      requirementList.sort(that.moren);
      that.setData({
        requirementList: requirementList
      })
    }
    this.onHide();
  },
  // 跳转到求租详情
  turn_to_rent_detal: function(e) {
    var itemData = e.currentTarget.dataset.itemdata;
    wx.navigateTo({
      url: '/pages/views/rent_seeking/rent_seeking_detail?itemData=' + JSON.stringify(itemData)
    })
  }
})