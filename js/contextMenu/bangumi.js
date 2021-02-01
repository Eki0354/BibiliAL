function openThumbOfThisBangumi () {
  const node = document.querySelector('meta[property="og:image"]');
  const url = node.getAttribute('content');
  window.open(url);
}

/**
 * 执行主体
 */
(function (type) {
  // 在新页面查看当前 番剧/电影 封面
  openThumbOfThisBangumi();
})();