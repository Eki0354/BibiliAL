function listen() {
  const { open } = XMLHttpRequest.prototype;

  XMLHttpRequest.prototype.open = function(method, url) {
    if (url.indexOf('api.bilibili.com/x/v2/dm/web/view') > -1) return this.close();
    open.apply(this, arguments);
  }
}

AL.safeInvoke(listen);
