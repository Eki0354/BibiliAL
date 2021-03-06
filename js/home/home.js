class HomeAL {
  constructor () {
    this.elevatorEle = document.querySelector('#elevator');
    // this.elevatorBgEle = this.elevatorEle.querySelector('.bg23');
    // this.biliEarEle = this.elevatorEle.querySelector('.ear');
    this.itemListEle = this.elevatorEle.querySelector('.list-box>div:first-child');
    // 电梯状态：0-正常；1-编辑；2-排序
    this.elevatorStatus = 0;
  }

  init () {
    this.banConfig = this.getBanConfig();
    this.addSpeRec();

    this.checkListEle = this.createCheckList();
    this.elevatorEle.appendChild(this.checkListEle);
    this.banItemNodes();

    this.addSortEvent();

    this.addSpirit();
  }

  addSpirit () {
    const ele = document.createElement('div');
    ele.className = SPIRIT_CLASS_NAME;
    ele.addEventListener('click', e => {
      if (this.elevatorStatus === 2) return;
      // 目前仅需要传入0/1
      this.changeElevatorStatus(+!this.elevatorStatus);
    });
    const img = document.createElement('img');
    img.setAttribute('src', AL.isLogin() ? AL.getAvatarImg() : AL.get22Img());
    ele.appendChild(img);
    this.elevatorEle.appendChild(ele);
    this.spirit = ele;
  }

  // 向导航电梯添加 “特殊推荐” 项
  addSpeRec () {
    const title = ' 特别推荐 ';
    const ele = document.createElement('div');
    ele.className = 'item';
    ele.dataset[ABSTRACT_KEY] = 1;
    ele.innerText = title;
    ele.addEventListener('click', e => {
      window.scrollTo(0, document.getElementById('bili_report_spe_rec').offsetTop);
    });
    this.itemListEle.appendChild(ele);
    // 特殊推荐 项的节点与其他模块节点的父节点位于同一级，单独添加配置
    this.banConfig.push({
      id: document.querySelector('.proxy-box+div').id,
      title: title.trim(),
      isAbstract: true
    });
  }

  // 因为电梯项可排序，所以配置列表需要动态获取
  getBanConfig () {
    const items = this.itemListEle.querySelectorAll('.item');
    const modules = document.querySelectorAll('.proxy-box>div');
    const config = [];
    [].forEach.call(modules, (m, i) => {
      config.push({
        id: m.id,
        title: items[i].innerText.trim(),
        isAbstract: false
      });
    })
    return config;
  }

  changeElevatorStatus (status) {
    this.elevatorStatus = status;
    switch (status) {
      case 1: // 编辑
        AL.show(this.checkListEle);
        this.showAllItemNodes();
        break;
      case 2: // 排序
        AL.hide(this.spirit);
        AL.hide(this.checkListEle);
        this.showAllItemNodes(true);
        this.banItemAble();
        break;
      default: // 0 - 默认正常
        AL.show(this.spirit);
        AL.hide(this.checkListEle);
        this.banItemNodes();
        this.getItemList().forEach(n => AL.able(n));
        break;
    }
  }

  // 创建编辑复选框列表
  createCheckList () {
    const checkListEle = document.createElement('div');
    checkListEle.className = 'al-check-list-box';
    AL.hide(checkListEle);

    const limitedList = this.readLimitedList();

    this.getItemList().forEach(item => {
      const title = item.innerHTML.trim();
      const checkItem = document.createElement('input');
      checkItem.type = 'checkbox';
      checkItem.checked = !limitedList.includes(title);
      checkItem.value = title;
      checkListEle.appendChild(checkItem);
    });

    return checkListEle;
  }

  // 获取当前实际状态的限制列表
  getBlockedList () {
    return this.getCheckItemList().filter(e => !e.checked).map(e => e.value);
  }

  /**
   * 获取电梯导航所有项节点的列表
   */
  getItemList () {
    return [].slice.call(this.itemListEle.getElementsByClassName('item'));
  }

  /**
   * 获取电梯导航所有项对应复选框节点的列表
   */
  getCheckItemList () {
    return [].slice.call(this.checkListEle.getElementsByTagName('input'));
  }

  // 监听排序按钮点击事件，排序时隐藏非原网页节点
  addSortEvent () {
    this.elevatorEle.querySelector('.list-box>.sort').addEventListener('click', e => {
      this.changeElevatorStatus(this.elevatorStatus === 2 ? 0 : 2);
    });
  }

  readLimitedList () {
    const str = localStorage.getItem(ITEMS_KEY);
    return str ? str.split(',') : this.saveLimitedList();
  }

  // 利用函数特性，总是返回保存的list数据（因为是纯字符串数组，所以不需要JSON转换）
  saveLimitedList (list = DEFAULT_BANMODULES) {
    return localStorage.setItem(ITEMS_KEY, list) || list;
  }

  // 用于展开checkbox列表的同时显示完整列表
  showAllItemNodes (exceptAbstract = false) {
    this.getItemList().forEach(n => {
      AL.toggleVisible(n, exceptAbstract && !!+n.dataset[ABSTRACT_KEY]);
    });
  }

  banItemNodes () {
    const blockedList = this.getBlockedList();
    const itemNodeLists = this.itemListEle.querySelectorAll('.item');
    this.banConfig.forEach((c, i) => {
      const mEle = document.getElementById(c.id);
      const blocked = blockedList.includes(c.title);
      AL.toggleVisible(mEle, blocked);
      AL.toggleVisible(itemNodeLists[i], blocked);
    });
    this.saveLimitedList(blockedList);
  }

  banItemAble () {
    const checkList = this.getCheckItemList();
    this.getItemList().forEach((n, i) => AL.toggleAble(n, !checkList[i].checked));
  }
}
