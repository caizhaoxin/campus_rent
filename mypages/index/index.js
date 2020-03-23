Page({
  data: {
    searchBox : {
      autoFocus : true,
      showInput : true,
      blurEvent : 'search'
    }
  },

  play: function () {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  change: function () {
    console.log('执行了滚动')
  }


})