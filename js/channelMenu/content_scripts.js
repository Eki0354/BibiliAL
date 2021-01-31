class ChannelMenuAL {
  init () {
    this.banHeaderItemNodes(this.readLimitedList());
  }

  readLimitedList () {
    const str = localStorage.getItem(ITEMS_KEY);
    return str ? str.split(',') : this.saveLimitedList();
  }

  // 获取头部频道菜单列表
  getHeaderItemList () {
    return [].slice.call(document.getElementById(PRIMARY_CHANNEL_MENU_ID).childNodes);
  }

  banHeaderItemNodes (blockedList) {
    this.getHeaderItemList().forEach(n => {
      const title = n.querySelector('.item>.name>span').firstChild.nodeValue;
      AL.toggleVisible(n, blockedList.includes(title));
    });
  }
}

const channelMenuAL = new ChannelMenuAL();
channelMenuAL.init();
