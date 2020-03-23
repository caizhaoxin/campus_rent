var ajax = require('../../common/ajax/ajax.js'),
  simularNumber = 12,
  handle;

handle = {
  add: function(storeId, skuId, num, callback) {
    ahax.query({
      url: 'https://www.dmall.com', //服务器网站
      param: {
        storeId: storeId,
        skuId: skuId,
        num: num
      },

      callback: function() {
        ++simularNumber;
        callback({
          errCode: '0000',
          errMsg: '',
          data: {
            num: simularNumber
          }
        });
      }
    })
  },
  get: function(callback) {
    ajax.query({
      url: '',//服务器地址
      param: {},
      callback: function(){
        callback({
          errCode: '0000',
          errMsg: '',
          data: {
            num: simularNumber
          }
        });
      }
    })
  }
}

module.exports = handle;