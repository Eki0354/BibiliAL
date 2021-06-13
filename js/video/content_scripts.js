class VideoAL {
  constructor () {}

  init () {
    this.hideSlideAd();
    this.hideGameCards();
    window.addEventListener('load', e => this.initLike());
  }

  hideSlideAd () {
    AL.hide('.r-con .ad-report');
  }

  hideGameCards () {
    const cards = document.getElementsByClassName('video-page-game-card');
    [].forEach.call(cards, c => AL.hide(c.parentNode));
  }

  // 初始化点赞按钮
  initLike (times = 0) {
    // 判断时间超过10s，则确认当前页面为未登录状态
    if (times >= 20) return '未登录，不需初始化点赞';
    // 登录状态初始化后，视频下方的操作栏会刷新一次，所以在未初始化完成时循环判断
    if (!AL.isLogin()) return setTimeout(() => this.initLike(times + 1), 500);

    setTimeout(() => {
      const ops = document.querySelector(`#${ARC_TOOLBAR_REPORT} .ops`);
      this.likeBtn = ops.querySelector(':scope .like');
      this.coinBtn = ops.querySelector(':scope .coin');
      this.favBtn = ops.querySelector(':scope .collect');
      const likeState = this.getLikeState();
      const coinState = this.getCoinState();
      const favState = this.getFavState();

      // 添加 点赞+一个币 按钮
      // 投币不可取消，且点赞状态可点击原按钮取消，所以已投币时不予添加显示此按钮
      if (coinState < 2) {
        this.initLikeAndOneCoinBtn(likeState + coinState >= 4);
        ops.appendChild(this.likeAndOneCoinBtn);
      }

      // 添加 点赞+默认收藏 按钮
      this.initLikeAndFavBtn(likeState + favState >= 4);
      ops.appendChild(this.likeAndFavBtn);

      // 添加 点赞+两个币 按钮
      // 投币不可取消，且点赞状态可点击原按钮取消，所以已投币时不予添加显示此按钮
      if (coinState < 2) {
        this.initLikeAndTwoCoinBtn(likeState + coinState >= 4);
        ops.appendChild(this.likeAndTwoCoinBtn);
      }

      // 添加 点赞+一个币+默认 按钮
      // 投币不可取消，且点赞状态可点击原按钮取消，所以已投币时不予添加显示此按钮
      if (coinState < 2) {
        this.initLikeAndOneCoinAndFavBtn(likeState + coinState + favState >= 6);
        ops.appendChild(this.likeAndOneCoinAndFavBtn);
      }
    }, 500);
  }

  getLikeState () {
    return +this.likeBtn.classList.contains('on') + 1;
  }

  getCoinState () {
    return +this.coinBtn.classList.contains('on') + 1;
  }

  getFavState () {
    return +this.favBtn.classList.contains('on') + 1;
  }

  getVideoID () {
    return AL.getSandboxData('window.vd.aid');
  }

  async getDefaultFav (aid, mid) {
    const res = await VideoAPI.getFavList(aid, mid);
    return res.data.list.find(i => i.title === '默认收藏夹');
  }

  initLikeAndOneCoinBtn (state) {
    this.likeAndOneCoinBtn = document.createElement('span');
    this.likeAndOneCoinBtn.title = '点赞 + 一个硬币';
    this.likeAndOneCoinBtn.className = 'al-extra-like';
    AL.toggle(this.likeAndOneCoinBtn, ON_CLASS_NAME, state);
    this.likeAndOneCoinBtn.innerHTML = `
      <i class="van-icon-videodetails_like like-and-one-coin">
        <div class="extra-badge-box">
          <i class="van-icon-videodetails_throw extra-badge"></i>
        </div>
      </i>
    `;

    // 添加事件
    this.likeAndOneCoinBtn.addEventListener('click', e => this.halfBuck(1));
  }

  initLikeAndTwoCoinBtn (state) {
    this.likeAndTwoCoinBtn = document.createElement('span');
    this.likeAndTwoCoinBtn.title = '点赞 + 两个硬币';
    this.likeAndTwoCoinBtn.className = 'al-extra-like';
    AL.toggle(this.likeAndTwoCoinBtn, ON_CLASS_NAME, state);
    this.likeAndTwoCoinBtn.innerHTML = `
      <i class="van-icon-videodetails_like like-and-two-coin">
        <div class="extra-badge-box">
          <i class="van-icon-videodetails_throw extra-badge"></i>
          <i class="van-icon-videodetails_throw extra-badge"></i>
        </div>
      </i>
    `;

    // 添加事件
    this.likeAndTwoCoinBtn.addEventListener('click', e => this.halfBuck(2));
  }

  initLikeAndFavBtn (state) {
    this.likeAndFavBtn = document.createElement('span');
    this.likeAndFavBtn.title = '点赞 + 默认收藏';
    this.likeAndFavBtn.className = 'al-extra-like';
    AL.toggle(this.likeAndFavBtn, ON_CLASS_NAME, state);
    this.likeAndFavBtn.innerHTML = `
      <i class="van-icon-videodetails_like like-and-fav-default">
        <div class="extra-badge-box">
          <i class="van-icon-videodetails_collec extra-badge"></i>
        </div>
      </i>
    `;

    // 添加事件
    this.likeAndFavBtn.addEventListener('click', e => this.halfBuck(0, true));
  }

  initLikeAndOneCoinAndFavBtn (state) {
    this.likeAndOneCoinAndFavBtn = document.createElement('span');
    this.likeAndOneCoinAndFavBtn.title = '点赞 + 一个硬币 + 默认收藏';
    this.likeAndOneCoinAndFavBtn.className = 'al-extra-like';
    AL.toggle(this.likeAndOneCoinAndFavBtn, ON_CLASS_NAME, state);
    this.likeAndOneCoinAndFavBtn.innerHTML = `
      <i class="van-icon-videodetails_like like-and-one-coin-and-fav-default">
        <div class="extra-badge-box">
          <i class="van-icon-videodetails_throw extra-badge"></i>
          <i class="van-icon-videodetails_collec extra-badge"></i>
        </div>
      </i>
    `;

    // 添加事件
    this.likeAndOneCoinAndFavBtn.addEventListener('click', async e => this.halfBuck(1, true));
  }

  /**
   * 点赞 + 投币 + 收藏
   * @param {*} coins 投币数
   * @param {*} needFav 是否收藏到默认文件夹
   */
  async halfBuck(coins = 0, needFav = false) {
    const aid = this.getVideoID();
    // 1-点赞；2-取消
    const like = this.getLikeState();
    let mid, defaultFav, promises = [];

    // 判断是否收藏到默认收藏夹
    if (needFav) {
      mid = AL.getMyMID();
      defaultFav = await this.getDefaultFav(aid, mid);
      promises.push(VideoAPI.favToDefault(aid, defaultFav.id, defaultFav.fav_state));
    }

    // 投币 + 点赞 调用一个接口实现，单独点赞 则是另一个独立接口
    if (coins) {
      promises.push(VideoAPI.addCoin(aid, coins, like));
    } else {
      promises.push(VideoAPI.like(aid, like));
    }

    try {
      await Promise.all(promises);

      // 投币不可逆，投币后隐藏所有可投币的按钮并切换原投币按钮状态
      if (coins) {
        AL.hide(this.likeAndOneCoinBtn);
        AL.hide(this.likeAndTwoCoinBtn);
        AL.hide(this.likeAndOneCoinAndFavBtn);
        AL.toggle(this.coinBtn, ON_CLASS_NAME);
      }

      // 切换 点赞 + 收藏 按钮和原收藏按钮状态
      if (needFav) {
        AL.toggle(this.likeAndFavBtn, ON_CLASS_NAME);
        AL.toggle(this.favBtn, ON_CLASS_NAME);
      }

      // 切换原点赞按钮状态
      AL.toggle(this.likeBtn, ON_CLASS_NAME);
    } catch (error) {
      const ops = ['点赞'];
      if (coins) ops.push('投币 * ' + coins);
      if (needFav) ops.push('默认收藏');
      alert(`[${ops.join('，')}] 请求失败`);
      console.log('请求失败: ' + error.message);
    }
  }
}

const videoAL = new VideoAL();
videoAL.init();
