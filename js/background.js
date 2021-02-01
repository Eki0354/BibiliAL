/**
 * 添加右键菜单
 */
(function () {
  chrome.contextMenus.create({
    title: '查看视频封面图片',
    contexts: ['page'],
    documentUrlPatterns: ['*://*.bilibili.com/video/*'],
    onclick: (info, tab) => { chrome.tabs.executeScript(tab.id, { file: 'js/contextMenu/video.js' }); }
  });
  chrome.contextMenus.create({
    title: '查看视频封面图片',
    contexts: ['page'],
    documentUrlPatterns: ['*://*.bilibili.com/bangumi/play/*'],
    onclick: (info, tab) => { chrome.tabs.executeScript(tab.id, { file: 'js/contextMenu/bangumi.js' }); }
  });
})();
