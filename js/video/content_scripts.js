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

      // 另一套样式，在点赞按钮上添加鼠标停留悬浮模块
      // this.likeBtn = document.querySelector(`#${ARC_TOOLBAR_REPORT} .like`);
      
      // 为点赞按钮添加漂浮按钮盒子
      // const extraLikeBox = document.createElement('div');
      // extraLikeBox.className = 'al-extra-like-box';

      // const likeAndOneCoinBtn = document.createElement('i');
      // likeAndOneCoinBtn.className = 'van-icon-videodetails_like extra-like like-and-one-coin';

      // // 添加按钮标识
      // const coinBadge = document.createElement('i');
      // coinBadge.className = 'van-icon-videodetails_throw extra-badge extra-badge-coin';
      // likeAndOneCoinBtn.appendChild(coinBadge);

      // extraLikeBox.appendChild(likeAndOneCoinBtn);

      // const likeAndFavBtn = document.createElement('i');
      // likeAndFavBtn.className = 'van-icon-videodetails_like extra-like like-and-fav';

      // 添加收藏标识
      // const favBadge = document.createElement('i');
      // favBadge.className = 'van-icon-videodetails_collec extra-badge extra-badge-fav';
      // likeAndFavBtn.appendChild(favBadge);

      // extraLikeBox.appendChild(likeAndFavBtn);
      
      // this.likeBtn.appendChild(extraLikeBox);
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
    // const url = document.querySelector('meta[itemprop="url"]').getAttribute('content');
    // return url.match(/(?<=av)\d+/)[0];
    return AL.getSandboxData('window.vd.aid');
  }

  getMyMID () {
    // return Cookie.getItem(UP_ID_KEY);
    return AL.getSandboxData('window.UserStatus.userInfo.mid');
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
    this.likeAndOneCoinBtn.addEventListener('click', e => {
      const aid = this.getVideoID();
      // 1-点赞；2-取消
      const like = this.getLikeState();
      VideoAPI.addCoin(aid, 1, like).then(res => {
        AL.hide(this.likeAndOneCoinBtn);
        AL.hide(this.likeAndTwoCoinBtn);
        AL.hide(this.likeAndOneCoinAndFavBtn);
        AL.toggle(this.likeBtn, ON_CLASS_NAME);
        AL.toggle(this.coinBtn, ON_CLASS_NAME);
      });
      // 禁止冒泡触发原来的点赞过程，悬停定位样式需要执行
      // e.stopPropagation();
    });
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
    this.likeAndTwoCoinBtn.addEventListener('click', e => {
      const aid = this.getVideoID();
      // 1-点赞；2-取消
      const like = this.getLikeState();
      VideoAPI.addCoin(aid, 2, like).then(res => {
        AL.hide(this.likeAndOneCoinBtn);
        AL.hide(this.likeAndTwoCoinBtn);
        AL.hide(this.likeAndOneCoinAndFavBtn);
        AL.toggle(this.likeBtn, ON_CLASS_NAME);
        AL.toggle(this.coinBtn, ON_CLASS_NAME);
      });
      // 禁止冒泡触发原来的点赞过程，悬停定位样式需要执行
      // e.stopPropagation();
    });
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
    this.likeAndFavBtn.addEventListener('click', async e => {
      const aid = this.getVideoID();
      const mid = this.getMyMID();
      const defaultFav = await this.getDefaultFav(aid, mid);
      const like = this.getLikeState();
      const promises = [
        VideoAPI.like(aid, like),
        VideoAPI.favToDefault(aid, defaultFav.id, defaultFav.fav_state)
      ]
      Promise.all(promises).then(res => {
        AL.toggle(this.likeAndFavBtn, ON_CLASS_NAME);
        AL.toggle(this.likeBtn, ON_CLASS_NAME);
        AL.toggle(this.favBtn, ON_CLASS_NAME);
      }).catch(e => console.log('请求失败'));
    });
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
    this.likeAndOneCoinAndFavBtn.addEventListener('click', async e => {
      const aid = this.getVideoID();
      const mid = this.getMyMID();
      const defaultFav = await this.getDefaultFav(aid, mid);
      const like = this.getLikeState();
      const promises = [
        VideoAPI.addCoin(aid, 1, like),
        VideoAPI.favToDefault(aid, defaultFav.id, defaultFav.fav_state)
      ]
      Promise.all(promises).then(res => {
        AL.hide(this.likeAndOneCoinBtn);
        AL.hide(this.likeAndTwoCoinBtn);
        AL.hide(this.likeAndOneCoinAndFavBtn);
        AL.toggle(this.likeAndFavBtn, ON_CLASS_NAME);
        AL.toggle(this.likeBtn, ON_CLASS_NAME);
        AL.toggle(this.coinBtn, ON_CLASS_NAME);
        AL.toggle(this.favBtn, ON_CLASS_NAME);
      }).catch(e => console.log('请求失败'));
    });
  }

  // postFormData (url, data) {
    // const form = document.createElement('form');
    // form.method = 'POST';
    // form.action = url;
    // Object.keys(data).forEach(key => {
    //   const input = document.createElement('input');
    //   input.name = key;
    //   input.value = data[key];
    //   form.appendChild(input);
    // });
    // document.body.appendChild(form);
    // form.submit();
  // }
}

const videoAL = new VideoAL();
videoAL.init();
