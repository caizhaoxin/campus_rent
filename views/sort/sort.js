var handle, events, _fn,
  utils = require ('../../common/utils/utils'),
  serviceItems = require('../../service/items/items.js'),
  seviceCart = require('../../service/cart/cart.js'),
  data = require('./data.js'),
  _fn;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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
handle = {
  render: function(callerPage) {
    _fn.init(callerPage);
    data.data.searchBox = {
      tapEvent: 'sortGotoSearch',
      autoFocus: false,
      showInput: false
    }
    callerPage.setData({
      currentView: 'sort',
      cyrrentData: data.data
    });
    //选中第几个tab
    _fn.select(0, callerPage);
  }
}

events = {
  sortChangeSort: function(e){
    var currentTarget = e.currentTarget,
        index = currentTarget.dataset.sortIndex;
    _fn.select(index,this);
  },
  sortGotoSearch: function (e){
    wx.navigateTo({
      url: '../search/search?autofoucs=true',
    });
  },
  sortClickProxy: function(e){
    var target = e.target,
        event = target.dataset.event;
    if(typeof _fn[event] == 'function'){
      _fn[event](e,this);
    }
  }
}

_fn = {
  init: function(callerPage) {
    if(callerPage.initedSort){
      return;
    }
    utils.mix(callerPage, events);
    callerPage = true;
  },
  select : function(index, callerPage) {
    var sortList = callerPage.data.currentData.sortList,
        i,s;
    
    for(i = 0; s = sortList[i]; i++){
      s.selected = i == index ? true : false;
    }

    //设置翻页
    callerPage.setData( callerPage.data );

    serviceItems.search({
      sortId : sortList[index].id
    },function(res) {
      var item = res.data.list.shift();
      res.data.list.push(item);

      callerPage.setData({
        'currentData.itemList' : res.data,
        'currentData.itemList.showAddCart' : true
      });
    });
  },
  addCart : function(e, callerPage) {
    var dataset = e.currentTarget.dataset,
        self = callerPage;

    serviceCart.add(dataset.sorteId, dataset.skuId, 1, function(res){
      self.setData({
        'cart.num' : res.data.num
      });
    });
  }
}

module.exports = handle;