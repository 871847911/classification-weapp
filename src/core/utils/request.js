import Taro from '@tarojs/taro';
import boz from '@BOZ';
//import Raven from '@raven';

function getStorage(key) {
  return Taro.getStorage({ key }).then((res) => res.data).catch(() => '');
}

function updateStorage(data = {}) {
  return Promise.all([Taro.setStorage({ key: 'token', data: data['3rdSession'] || '' })]);
}

/** @发起请求
 * 支持请求方式： GET | POST | PUT | DELETE
 *
 * @param    {object}   query
 * 一）query 查询字段：
 * url
 * options
 *   method
 *   data
 *   fetchOptions
 *     showToast: false, // 异常捕获，显示提示弹层
 *     autoLogin: false  // 异常捕获，是否跳转至登录界面
 *     version: v2.0.8    // 降低 java 接口定义的版本号，以兼容无鉴权登录态
 *
 * api
 *
 * 二）api 定义接口类型：
 *   www_form_urlencoded_nurseTrainApi| mock_nurseTrainApi | nurseTrainApi
 *
 * @returns  {Promise}  result
 *
 * @date
 * @alias    request
 * @author   galaxyw<galaxybing@gmail.com>
 */

export default async function request(query) {
  let { url, options = {}, api } = query;

  //修复 二次请求服务端时，session 可能失效问题
  const token = await getStorage('token');
  let headers = token ? { 'token': token, 'token': token } : {};
  let params = {}; // For data config

  if (options) {
    // && options.method !== 'GET'
    let body = options.data;
    if (!api || api.split('_')[0] === 'www' || api.split('_')[0] === 'mock') {
      params =
        typeof body == 'string'
          ? body
          : typeof body == 'undefined'
            ? ''
            : Object.keys(body)
              .map(function (k) {
                let val = body[k];
                if (!val && (typeof val === 'object' || typeof val === 'undefined')) {
                  return encodeURIComponent(k) + '=';
                }
                return encodeURIComponent(k) + '=' + encodeURIComponent(typeof val === 'string' ? val : JSON.stringify(val));
              })
              .join('&');
      // params += `&version=${boz.api[`${boz.env}`].version}`;
      //
      headers = {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    } else {
      // 针对原有的老接口调用，使用的 Content-Type 消息头
      body = {
        ...body,
        // version: boz.api[`${boz.env}`].version
      };
      params = JSON.stringify(body); // 避免 调用函数单独执行：JSON.stringify 转换操作
      //
      headers = {
        ...headers,
        'Content-Type': 'application/json'
      };
    }

    // if((options.method=='GET' || options.method == 'PUT') && params) {
    // 后端接口如果未针对 PUT 请求传参作处理时，需要拼接传参形式
    //
    if ((options.method).toUpperCase() == 'GET' && params) {
      url += '?' + params;
    }
  }
  options.data = params;
  options.header = headers;

  const { showToast = false, autoLogin = false } = options.fetchOptions ? options.fetchOptions : {};
  return Taro.request({ url: (api ? boz['api'][`${boz.env}`][api] : '') + url, ...options })
    .then(async (response) => {
      let res = response.data;
      if (res && !res.success && res.errMsg) {

      }
      if (res.msg === "token失效，请重新登录") {
         checkIn();
      }
      return res;
    })
    .catch(async (error) => {
      await updateStorage({});
      if (showToast) {
        Taro.showToast({
          title: (error && error.errorMsg) || '网络异常',
          icon: 'none'
        });
      }
      autoLogin && checkIn(); // 登录状态已过期，请重新登录
      // Raven.captureException(new Error(res.errMsg), {
      //   level: 'error', // one of 'info', 'warning', or 'error'
      //   data: {
      //     method: options.method,
      //     url: (api ? boz['api'][`${boz.env}`][api] : '') + url,
      //     status_code: 200
      //   },
      //   logger: 'request.js',
      //   tags: { git_commit: 'request.js' }
      // });
    });
}

export function checkIn() {
  Taro.reLaunch({ url: '/pages/index/index' }) 
}
