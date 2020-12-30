class AL {
  /**
   * 根据原函数特性，不给force指定默认值，不传时即实现取反效果
   * @param {*} e 操作节点。也可传入选择器字符串。
   * @param {*} key 需要操作的类名。
   * @param {*} force 是否指定强制转换属性
   */
  static toggle (e, key, force) {
    e = typeof e === 'string' ? document.querySelector(e) : e;
    e.classList.toggle(key, force);
  }

  static toggleAll (list, key, force) {
    list = typeof list === 'string' ? document.querySelectorAll(list) : list;
    [].forEach.call(list, e => e.classList.toggle(key, force));
  }

  static markAds (e) {
    e.setAttrite('href')
  }

  static toggleVisible (e, force) {
    AL.toggle(e, HIDE_KEY, force);
  }

  static show (e) {
    AL.toggleVisible(e, false);
  }

  static hide (e) {
    AL.toggleVisible(e, true);
  }

  static toggleAble (e, force) {
    AL.toggle(e, DISABLED_KEY, force);
  }

  static able (e) {
    AL.toggleAble(e, false);
  }

  static disable (e) {
    AL.toggleAble(e, true);
  }

  static moveToLast (e) {
    const parent = e.parentNode;
    parent.removeChild(e);
    parent.appendChild(e);
  }

  static isLogin () {
    return !!document.getElementsByClassName(IS_LOGIN_KEY).length;
  }

  static getAvatarImg () {
    return document.querySelector('#app .bili-avatar .bili-avatar-face').dataset.src;
  }

  static get22Img () {
    return 'data:image/png;base64,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';
  }
}