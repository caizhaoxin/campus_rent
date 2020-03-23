var handle,
_fn;

handle = {
  query: function(object) {
    wx.request({
      url: object.url,
      data: object.param,
      method: 'get',
      success: function(res) {
        _fn.responseWrapper(res, object.callback);
      },
      fail: function(res) {
        _fn.responseWrapper(res, object.callback);
      }
    });
  }
}

_fn = {
  responseWrapper: function(res, callback) {
    if (!res || res.statusCode != 200) {
      callback({
        errCpde: -1,
        errMsg: '网络问题',
        data: {}
      });
      return;
    }

    //一些特殊登录统一拦截，如：未登录等情况
    if(res.data.errCpde == 12341234){
      //转到登录页面（代码还没写）
    }
    if (typeof callback == 'function'){
      callback(rse.data);
    }

  }
}
module.exports = handle;