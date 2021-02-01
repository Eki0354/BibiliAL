function openThumbOfThisVideo () {
  const node = document.querySelector('meta[itemprop=thumbnailUrl]');
  const url = node.getAttribute('content');
  window.open(url);
}

/**
 * 执行主体
 */
(function (type) {
  // 在新页面查看当前视频封面
  openThumbOfThisVideo();
})();