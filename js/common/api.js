class CommonAPI {
  /**
   * 领取大会员优惠券
   * @param {number} type 1 - 5元B币券；2 - 10元会员购优惠券；
   */
  static receivePrivilege(type = 1) {
    const url = 'https://api.bilibili.com/x/vip/privilege/receive';
    const data = { type }
    return http.post(url, data);
  }

  /**
   * 获取大会员优惠券领取状态
   */
  static checkPrivileges() {
    const url = 'https://api.bilibili.com/x/vip/privilege/my';
    return http.get(url);
  }
}
