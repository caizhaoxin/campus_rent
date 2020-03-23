// pages/views/upload/upload_rentSeeking_message/upload_rentSeeking_message.js
var util = getApp();
var universityData = require('../../universityData/universityData.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    tableName: 'requirement',
    select_food_type: "选择物品类型 >",
    pics: [],      //照片数组
    count: 0,      //图片数,最多三张
    isShow: true,
    select_university: "选择学校 >",
    startDate: "",
    endDate: "",
    selectedStartDate: "",
    selectedEndDate: "",
    food_type_index: 0,
    food_type: [
      "书籍",
      "服装",
      "道具",
      "文具",
      "电子产品",
      "家具",
      "交通工具",
      "其他"
    ],
    multiArray: '',
    campus: '',
    multiIndex: [99999, 99999],
    haveChooseUniversity: 0
  },
  // 学校选择器
  select_university(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      university_index: e.detail.value
    })
  },

  // 选择物品类型选择器
  select_food_type (e){
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      food_type_index: e.detail.value,
    })
    var select_food_type = this.data.food_type[e.detail.value];
    this.setData({
      select_food_type: select_food_type
    })
    console.log('picker发送选择改变，携带值为', this.data.select_food_type);
  },
  

  //查看照片
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.pics
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  //删除图片
  deletePic: function (e) {
    var index = e.currentTarget.dataset.idx;
    var pics = this.data.pics;
    console.log(pics.splice(index, 1));
    this.setData({
      pics: pics
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    if (app.globalData.loginStatus == 0) {
      wx.showModal({
        title: '尊敬的用户请注意！',
        content: '请先在”我的“页面登录后再进行发布求组操作',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            wx.switchTab({
              url: "/pages/views/user/user"
            })
            console.log('用户点击确定');
          } else {//这里是点击了取消以后
            wx.switchTab({
              url: "/pages/views/user/user"
            })
          }
        }
      })
    }
    var that = this;
    var multiArray = universityData.getUniversityData();
    var campus = universityData.getCampusData();
    multiArray[1] = campus[0];
    console.log(multiArray);
    console.log(campus);
    this.setData({
      multiArray: multiArray,
      campus: campus
    })
    wx.request
      ({
        url: "https://huangwenxin.cn/getter/get_store.php",
        data: {
          openid: app.globalData.openid,
          tableName: that.data.tableName
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (request_res) {
          that.setData({
            id: request_res.data.id,
            selectedStartDate: request_res.data.startDate,
            selectedEndDate: request_res.data.startDate,
            startDate: request_res.data.startDate,
            endDate: request_res.data.endDate
          })
          console.log('onLoad ' + request_res.data.id);
        }
      })
  },
  selectedStartDateChange: function(e){
    this.setData({
      selectedStartDate : e.detail.value
    })
    var selectedStartDate = this.data.selectedStartDate;
    var start_date = new Date(this.data.selectedStartDate.replace(/-/g, "/"));
    var end_date = new Date(this.data.selectedEndDate.replace(/-/g, "/"));
    var days = end_date.getTime() - start_date.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    if(day < 0){
      this.setData({
        selectedEndDate: selectedStartDate
      })
    }
  },
  selectedEndDateChange: function (e) {
    this.setData({
      selectedEndDate: e.detail.value
    })
    var selectedEndDate = this.data.selectedEndDate;
    var start_date = new Date(this.data.selectedStartDate.replace(/-/g, "/"));
    var end_date = new Date(this.data.selectedEndDate.replace(/-/g, "/"));
    var days = end_date.getTime() - start_date.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    if (day < 0) {
      this.setData({
        selectedStartDate: selectedEndDate
      })
    }
  },
  submit: function(e){
    var that = this;
    var selectedEndDate = this.data.selectedEndDate;
    var start_date = new Date(this.data.selectedStartDate.replace(/-/g, "/"));
    var end_date = new Date(this.data.selectedEndDate.replace(/-/g, "/"));
    var days = end_date.getTime() - start_date.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    if (day < 0) {
      this.setData({
        selectedStartDate: selectedEndDate
      })
    }
  },
  submit: function (e) {
    var that = this;
    //拼接warnning
    var warnning = '';
    var reg = /、$/gi;//此处是正则,去顿号
    var haveSelect = 0; var haveWrite = 0;
    warnning += '请';
    if (that.data.select_food_type == '选择物品类型 >' || that.data.multiIndex[0] == 99999) {
      warnning += '填选';
      haveSelect = 1;
    }
    if (that.data.select_food_type == '选择物品类型 >') {
      warnning += '物品类型、';
    }
    if (that.data.multiIndex[0] == 99999) {
      warnning += '交易地点、';
    }
    warnning = warnning.replace(reg, "");
    if (haveSelect == 1) warnning += ',';
    if (e.detail.value.linkmanName == '' || e.detail.value.rental == '' || e.detail.value.requirementText == '' || (e.detail.value.wxID == '' && e.detail.value.phoneNumber == '')
    ) {
      warnning += '填写';
    }
    if (e.detail.value.linkmanName == '') {
      warnning += '联系人姓名、';
    }
    if (e.detail.value.wxID == '' && e.detail.value.phoneNumber == '') {
      warnning += '微信号码或手机号码、';
    }
    if (e.detail.value.rental == '') {
      warnning += '租金、';
    }
    if (e.detail.value.requirementText == '') {
      warnning += '物品描述、';
    }
    if (warnning != '请') {
      var reg = /、$/gi;//此处是正则
      warnning = warnning.replace(reg, "");
      wx.showModal({
        content: warnning,
        success: function (res) {
          return;
        }
      })
    }else{
      wx.showLoading({
        title: '提交中...',
        mask: 'true'
      })
      var location = that.data.multiArray[0][that.data.multiIndex[0]] + " " + that.data.multiArray[1][that.data.multiIndex[1]];
      wx.request({
        url: "https://huangwenxin.cn/subber/subRequirement.php",
        data:
          {
            id: that.data.id,
            openid: app.globalData.openid,
            linkmanName: e.detail.value.linkmanName,
            selectdIndexType: that.data.select_food_type,
            university: that.data.multiArray[0][that.data.multiIndex[0]],
            campus: that.data.multiArray[1][that.data.multiIndex[1]],
            requirementText: e.detail.value.requirementText,
            rental: e.detail.value.rental,
            selectedStartDate: that.data.selectedStartDate,
            selectedEndDate: that.data.selectedEndDate,
            phoneNumber: e.detail.value.phoneNumber,
            wxID: e.detail.value.wxID,
            pics: that.data.pics
          },
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: function (request_res) {
          app.globalData.haveSubmittedRequirement = 1;
          console.log(request_res.data);
          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          wx.navigateTo({
            url: "/pages/views/back/back"
          })
        }
      })
    }
  },
  // 图片选择并上传
  chooseImage: function () {
    var that = this,
      pics = that.data.pics;
    wx.chooseImage({
      count:  9 - pics.length, // 最多可以选择的图片张数，默认3
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '图片上传中...',
          mask: 'true'
        })
        var imgSrc = res.tempFilePaths;
        pics = pics.concat(imgSrc);
        if (pics.length >= 9) {
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
            url: 'https://huangwenxin.cn/photoStore/photo_load.php',
            filePath: that.data.pics[i],
            name: 'photo',
            formData:
            {
                id: that.data.id,
                tableName: that.data.tableName
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
  bindMultiPickerColumnChange: function (e) {
    var that = this;
    if (e.detail.column == 0) {
      var multiArray = that.data.multiArray;
      var campus = that.data.campus;
      multiArray[1] = campus[e.detail.value];
      this.setData({
        multiArray: multiArray
      })
    }
  },
  bindMultiPickerChange: function (e) {
    console.log(e.detail.value);
    var multiIndex = [e.detail.value[0], e.detail.value[1]];
    this.setData({
      multiIndex: multiIndex,
      haveChooseUniversity: 1
    })
  },
  bindMultiPickerColumnCancel: function(){
    var multiIndex = this.data.multiIndex;
    if (multiIndex[0] == 99999 && multiIndex[1] == 99999) {
      this.setData({
        haveChooseUniversity: 0
      })
    }
  }
})