/**
 * 添加右键菜单
 */
(function () {
  chrome.contextMenus.create({
    title: '查看视频封面图片',
    contexts: ['page'],
    documentUrlPatterns: ['https://*.bilibili.com/video/*'],
    onclick: (info, tab) => { chrome.tabs.executeScript(tab.id, { file: 'js/contextMenu.js' }); }
  });
})();
