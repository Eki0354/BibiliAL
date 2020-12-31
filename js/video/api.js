class VideoAPI {
  static like (aid, like) {
    const url = 'https://api.bilibili.com/x/web-interface/archive/like';
    const data = {
      aid,
      like
    };
    return http.post(url, data);
  }

  // 投一个硬币，默认点赞
  static addCoin (aid, multiply, select_like = 1) {
    const url = 'https://api.bilibili.com/x/web-interface/coin/add';
    const data = {
      aid,
      multiply,
      select_like,
      cross_domain: true
    };
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json, text/plain, */*'
      }
    };
    return http.post(url, data, options);
  }
  
  // 获取收藏夹列表
  static getFavList (aid, mid) {
    const url = 'https://api.bilibili.com/x/v3/fav/folder/created/list-all';
    const params = {
      type: 2,
      rid: aid,
      up_mid: mid
    };
    return http.get(url, params);
  }

  // 收藏到 默认收藏夹
  static favToDefault (aid, favID, favState) {
    const url = 'https://api.bilibili.com/x/v3/fav/resource/deal';
    const data = {
      rid: aid,
      type: 2,
      jsonp: 'jsonp'
    };
    data[favState === 0 ? 'add_media_ids' : 'del_media_ids'] = favID;
    return http.post(url, data);
  }
}
