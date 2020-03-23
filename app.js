App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    toView: "item-5";
  },

  onShareAppMessage: function () {
    return {
      title: '分享快乐',
      path: '/pages/views/source_of_good/source_of_good'
    }
  },

  globalData: {
    avatarUrl: null,
    userInfo: null,
    loginStatus: 0,
    openid: '',
    detailGoodId: "",
    rent_seek_detailData: '',
    isManager: 0, 
    isCollectionPage: '0',
    haveSubmittedGoods: 0,
    haveSubmittedRequirement: 0,
    submitID: [],
    requirementID: [],
  },
})
