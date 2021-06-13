class FollowAL {
  async init() {
    this.tabContentVisible = false;

    this.followList = this.readList();

    if (!this.followList) {
      this.mid = AL.getMyMID();
      this.following = await this.getFollowings();
      const list = await this.getFullFollowList();
      this.followList = this.formatFollowList(list);
      this.saveList();
    }

    await this.confirmDOMLoaded();
    this.appendFollowTabButton();
    this.appendTabContent();
  }

  /**
   * 获取所有已关注Up的列表
   * @param {number} ps 单页列表长度
   */
  async getFullFollowList(ps = 50) {
    const pages = Math.ceil(this.following / ps);
    const promises = Array(pages)
      .fill(null)
      .map((n, i) => this.getSinglePageFollowList(i + 1, ps));
    // 直接获取Promise.all的返回结果，可以保证列表按页面顺序排列
    const res = await Promise.all(promises);
    return res.flat();
  }

  /**
   * 获取已关注的人数
   */
  async getFollowings() {
    const res = await FollowAPI.getRelationInfo(this.mid);
    return res?.data?.following || 0;
  }

  /**
   * 获取单页关注列表
   * @param {number} pn 页数
   * @param {number} ps 单页列表长度
   */
  async getSinglePageFollowList(pn = 1, ps = 50) {
    const res = await FollowAPI.getFollowList(this.mid, pn, ps);
    return res?.data?.list || [];
  }

  /**
   * 格式化关注列表数据
   * @param {Array} list 关注列表
   */
  formatFollowList(list) {
    return list.map(({ mid, mtime, uname, special }) => ({ mid, mtime, uname, special: !!special }));
  }

  /**
   * 当前页面是否已选中 全部关注
   */
  isFullListTab() {
    const { tagid } = AL.getQuery();
    return tagid === undefined || tagid == -1;
  }

  /**
   * 确保Tab按钮目标父节点已加载
   */
  async confirmDOMLoaded() {
    let tabsNode = this.getTabsNode();
    while (!tabsNode) {
      await new Promise(resolve => {
        setTimeout(_ => {
          tabsNode = this.getTabsNode();
          resolve();
        }, 500);
      })
    }
  }

  // 获取tab按钮父节点
  getTabsNode() {
    return document.querySelector('#page-follows .follow-tabs');
  }

  // 获取关注列表父节点
  getFollowContentNode() {
    return document.querySelector('#page-follows .follow-content');
  }

  // 添加 快捷操作 Tab按钮
  appendFollowTabButton() {
    const btn = document.createElement('span');
    btn.textContent = '快捷操作';

    const tabsNode = this.getTabsNode();
    tabsNode.appendChild(btn);

    // 给三个按钮添加事件，点击时使active类名互斥
    [...tabsNode.childNodes].forEach(tn => {
      tn.addEventListener('click', e => {
        const tabsNode = document.querySelector('#page-follows .follow-tabs');
        [...tabsNode.childNodes].forEach(n => n.classList.remove('active'));
        e.target.classList.add('active');

        if (this.followList.length < 1) return;
        const isAL = e.target.textContent === '快捷操作';
        if (isAL === this.tabContentVisible) return;
        this.tabContentVisible = !this.tabContentVisible;
        const contentNodes = document.querySelectorAll('#page-follows .follow-content > .content');
        [...contentNodes].forEach((n, i) => AL.toggleVisible(n, isAL ? !i : !!i));

        AL.toggleVisible(contentNodes[1].firstChild);
      })
    });
  }

  // 创建关注列表操作导航栏
  createTabNav() {
    const unfollowBtn = document.createElement('div');
    unfollowBtn.className = 'btn-follow be-dropdown fans-action-follow';
    unfollowBtn.innerHTML = '<span class="fans-action-text">取消关注</sapn>';

    unfollowBtn.addEventListener('click', e => {
      this.followList.forEach(item => {
        if (!item.selected) return;
        this.unfollow(item.mid);
      })
    });

    const nav = document.createElement('div');
    nav.className = 'al-follow-content-nav al-hide';
    nav.appendChild(unfollowBtn);

    return nav;
  }

  // 添加 快捷操作 内容列表
  appendTabContent() {
    const ul = document.createElement('ul');
    ul.className = 'al-follow-list';

    this.followList.forEach((item, index) => {
      const { mid, uname, special } = item;

      const link = document.createElement('a');
      link.className = 'al-follow-link';
      if (special) link.classList.add('al-follow-link-special');
      link.href = 'https://space.bilibili.com/' + mid;
      link.target = '_blank';
      link.textContent = uname;
      
      const li = document.createElement('li');
      li.className = 'al-follow-list-item';
      // li.innerHTML = `
      //   <div class="follow-select" style="display: block; margin-top: 0;">
      //     <div class="icon icon-follow-watched"></div>
      //   </div>
      // `;
      li.appendChild(this.createSelectNode(index));
      li.appendChild(link);

      ul.appendChild(li);
    });

    const nav = this.createTabNav();

    const content = document.createElement('div');
    content.className = 'content al-follow-content al-hide';

    content.appendChild(nav);
    content.appendChild(ul);

    const followContentNode = this.getFollowContentNode();
    followContentNode.appendChild(content);
  }

  // 创建关注列表单选框节点
  createSelectNode(index) {
    const icon = document.createElement('div');
    icon.className = 'icon icon-follow-watched';
    icon.addEventListener('click', e => {
      AL.toggle(e.target, 'icon-follow-selected');
      this.followList[index].selected = !this.followList[index].selected;
    });

    const node = document.createElement('div');
    node.className = 'follow-select al-follow-select-item';
    node.appendChild(icon);
    return node;
  }

  /**
   * 获取本地关注列表数据
   */
  readList() {
    return localStorage.get(FOLLOW_LIST_KEY);
  }

  /**
   * 将关注列表数据存储到本地
   */
  saveList() {
    localStorage.set(FOLLOW_LIST_KEY, this.followList);
  }

  /**
   * 关注
   * @param {string} mid 被关注用户的mid
   */
  follow(mid) {
    return FollowAPI.modifyRelation(mid, 1);
  }

  /**
   * 取关
   * @param {string} mid 被取关用户的mid
   */
  unfollow(mid) {
    return FollowAPI.modifyRelation(mid, 2);
  }
}

const followAL = new FollowAL();
followAL.init();
