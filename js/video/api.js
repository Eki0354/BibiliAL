class VideoAPI {
  /**
   * 点赞
   * @param {*} aid 视频av号
   * @param {*} like 1-点赞；2-取消
   */
  static like (aid, like) {
    const url = 'https://api.bilibili.com/x/web-interface/archive/like';
    const data = {
      aid,
      like
    };
    return http.post(url, data);
  }

  /**
   * 投币 + 点赞
   * @param {*} aid 视频av号
   * @param {*} multiply 投币数 
   * @param {*} select_like 1-点赞；2-取消
   */
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
  
  /**
   * 获取收藏夹列表
   * @param {*} aid 视频av号
   * @param {*} mid 当前登录账号的mid
   */
  static getFavList (aid, mid) {
    const url = 'https://api.bilibili.com/x/v3/fav/folder/created/list-all';
    const params = {
      type: 2,
      rid: aid,
      up_mid: mid
    };
    return http.get(url, params);
  }

  /**
   * 收藏到 默认收藏夹
   * @param {*} aid 视频av号
   * @param {*} favID 收藏夹id
   * @param {*} favState 收藏状态
   */
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
