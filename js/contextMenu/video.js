function openThumbOfThisVideo () {
  const vd = AL.getSandboxData('window.vd');
  window.open(vd?.pic);
}

/**
 * 执行主体
 */
(function (type) {
  // 在新页面查看当前视频封面
  openThumbOfThisVideo();
})();