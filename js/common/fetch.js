function getQueryString(params) {
  return '?' + new URLSearchParams(params).toString();
  // return `?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`;
}

// 公共请求方法
function request(url, method, data, { params, ...options } = {}) {
  // 统一请求方法的大小写，防止判断不全
  method = method.toString().toUpperCase();
  // 合并初始请求设置和传入的设置参数
  options = Object.assign({
    method,
    credentials: 'include',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }, options);
  // get方式会将data作为参数进行请求，否则正常传递data
  if (method === 'GET') {
    params = data;
  } else {
    data.csrf = Cookie.getItem(CSRF_KEY);
    options.body = new URLSearchParams(data);
  }
  // 拼接请求参数
  params && (url += getQueryString(params));
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(async res => {
        const resData = await res.json();
        if (resData.code !== 0) reject('请求失败：' + resData.message);
        resolve(resData);
      })
      .catch(e => reject(e));
  });
}

const methods = ['get', 'post', 'put', 'delete'];
const http = {};
methods.forEach(m => { http[m] = (url, data, options) => request(url, m, data, options); });

