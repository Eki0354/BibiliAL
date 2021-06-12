/**
 * 添加右键菜单
 */
(async function () {
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

  async function hasReceived5BCoin() {
    const res = await CommonAPI.checkPrivileges();
    if (res.code !== 0) return false;
    const item = res.data.list.find(i => i.type === 1);
    return !!item?.state;
  }

  const hasReceived = await hasReceived5BCoin();
  if (!hasReceived) {
    chrome.contextMenus.create({
      title: '领取大会员5元B币券',
      contexts: ['page'],
      documentUrlPatterns: ['*://*.bilibili.com/*'],
      onclick: (info, tab) => { chrome.tabs.executeScript(tab.id, { file: 'js/contextMenu/privilege.js' }); }
    });
  }
})();
