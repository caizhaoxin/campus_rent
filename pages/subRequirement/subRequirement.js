// mypages/subGoods/subGoods.js
var app = getApp();
Page({
  data: {
    array: ['书籍', '服装', '道具', '文具', '电子产品', '家具', '交通工具', '其他'],
    selectdIndex: 0,   //类别选择的下标
    selectdIndexType: '书籍',   //类别选择的名字
    goodsName: '',      //商品名字
    goodsDescription: '',  //商品描述
    rental: 0,     //租金
    unit: "日",
    unitList: ['日', '月', '年'],
    pics: [],      //照片数组
    count: 0,      //图片数,最多三张
    isShow: true,
    id: "",        //货物在后台获得的ID
    sellerName: "", //商家的名字
    phoneNumber: "",  //商家的电话号码
    wxID: "",         //商家的微信ID
    canSwitch: 0
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    console.log(this.data.id + " onShow");
  },
  onLoad: function (options) {
    //先进行登录检查
    if (app.globalData.loginStatus == 0) {
      wx.showModal({
        title: '尊敬的用户请注意！',
        content: '请先在”我的“页面登录后再进行发货操作',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            wx.switchTab({
              url: "../user/user"
            })
            console.log('用户点击确定')
          } else {//这里是点击了取消以后
            wx.switchTab({
              url: "../user/user"
            })
            console.log('用户点击取消')
          }
        }
      })
    }
    // 生命周期函数--监听页面加载
    var that = this;
    isShow: (options.isShow == "true" ? true : false)
    wx.request
      ({
        url: "https://huangwenxin.cn/get_id.php",
        data: {},
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (request_res) {
          that.setData({
            id: request_res.data,
          })
          console.log(that.data.id + " onLoad");
        }
      })
  },
  //typepinker的index值改变
  typeChange: function (e) {
    var that = this;
    this.setData({
      selectdIndex: e.detail.value
    })
    var tempType = that.data.array[that.data.selectdIndex];
    this.setData({
      selectdIndexType: tempType
    })
    console.log(tempType);
    console.log(this.data.selectdIndex);
  },
  //dateChange改变
  unitChange: function (e) {
    var that = this;
    this.setData({
      unit: that.data.unitList[e.detail.value]
    })
  },
  // 图片选择并上传
  chooseImage: function () {
    var that = this,
      pics = that.data.pics;
    wx.chooseImage({
      count: 3 - pics.length, // 最多可以选择的图片张数，默认3
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '图片上传中...',
          mask: 'true'
        })
        var imgSrc = res.tempFilePaths;
        pics = pics.concat(imgSrc);
        if (pics.length >= 3) {
          that.setData({
            isShow: (!that.data.isShow)
          })
        } else {
          that.setData({
            isShow: (that.data.isShow)
          })
        }
        that.setData({
          count: pics.length,
          pics: pics
        })
        //上传图片
        for (var i = 0; i < that.data.pics.length; i++) {
          console.log(that.data.id);
          wx.uploadFile({
            url: 'https://huangwenxin.cn/photo_load.php',
            filePath: that.data.pics[i],
            name: 'photo',
            formData:
              {
                id: that.data.id
              },
            success: function (res) {
              console.log(res.data);
            }
          })
          console.log(i + " " + that.data.pics.length)
          if (i == that.data.pics.length - 1) {
            wx.hideLoading();
          }///////////////////
        }
        console.log(pics);
      }
    })
  },
  // 图片预览
  previewImage: function (e) {
    var that = this,
      //获取当前图片的下表
      index = e.currentTarget.dataset.index,
      //数据源
      pictures = this.data.pictures;
    wx.previewImage({
      //当前显示下表
      current: pictures[index],
      //数据源
      urls: pictures
    })
  },
  submit: function (e) {
    wx.showLoading({
      title: '提交中...',
      mask: 'true'
    })
    var that = this;
    console.log('这里是submit');
    wx.request({
      url: "https://huangwenxin.cn/subGoods.php",
      data:
        {
          openid: app.globalData.openid,
          goodsName: e.detail.value.goodsName,
          goodsDescription: e.detail.value.goodsDescription,
          selectdIndexType: that.data.selectdIndexType,
          rental: e.detail.value.rental,
          unit: that.data.unit,
          sellerName: e.detail.value.sellerName,
          phoneNumber: e.detail.value.phoneNumber,
          wxID: e.detail.value.wxID
        },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (request_res) {
        console.log(request_res.data);
        wx.hideLoading();
        wx.showToast({
          title: '成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        wx.switchTab({
          url: "../user/user"
        })
      }
    })
  },
  reset: function (e) {
    console.log('这里是reset');
    var that = this;
    var temp = that.data.startDate;
    that.setData({
      selectdIndex: 0,   //类别选择的下标
      selectdIndexType: '书籍',   //类别选择的名字
      goodsName: '',      //商品名字
      goodsDescription: '',  //商品描述
      rental: 0,     //租金
      pics: [],      //照片数组
      count: 0,      //图片数,最多三张
      isShow: true,
      id: "",        //货物在后台获得的ID
      contactor: "", //商家的名字
      phoneNumber: "",  //商家的电话号码
      selectdDate: temp   //买家选择的日期
    })
  }
})