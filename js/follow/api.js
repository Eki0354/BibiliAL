class FollowAPI {
  /**
   * 获取用户关系数据
   * @param {string} vmid 用户mid
   */
  static getRelationInfo(vmid) {
    const url = 'https://api.bilibili.com/x/relation/stat';
    const params = { vmid };
    return http.get(url, params);
  }

  /**
   * 获取用户关注列表
   * @param {string} vmid 用户mid
   * @param {number} pn 页数
   * @param {number} ps 单页列表长度，范围为1-50
   */
  static getFollowList(vmid, pn = 1, ps = 50) {
    const url = 'https://api.bilibili.com/x/relation/followings';
    const params = {
      vmid,
      pn,
      ps,
      order: 'desc',
      order_type: 'attention'
    }
    return http.get(url, params);
  }

  /**
   * 关注/取关某个Up
   * @param {*} fid Up的mid
   * @param {*} state 状态：1 - 关注；2 - 取关；
   */
  static modifyRelation(fid, state) {
    const url = 'https://api.bilibili.com/x/relation/modify';
    const data = {
      fid,
      act: state,
      re_src: 11,
      jsonp: 'jsonp'
    }
    return http.post(url, data);
  }
}
