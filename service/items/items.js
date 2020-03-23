var ajax = require ('../../common/ajax/ajax.js'),
data = require('data.js'),
handle;

handle = {
  search: function(param, callback) {
    ajax.query({
      url: 'https://www.dmall.com',//服务器地址
      param : param,
      callback : function() {
        callback(data);
      }
    });
  }
}

module.exports = handle;