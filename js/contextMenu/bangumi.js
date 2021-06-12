function openThumbOfThisBangumi () {
  const md = AL.getSandboxData('window.md');
  window.open(md?.cover);
}

/**
 * 执行主体
 */
(function (type) {
  // 在新页面查看当前 番剧/电影 封面
  openThumbOfThisBangumi();
})();