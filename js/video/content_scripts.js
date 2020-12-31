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
      this.likeBtn = ops.querySelector('.like');
      this.coinBtn = ops.querySelector('.coin');
      this.favBtn = ops.querySelector('.collect');
      const likeState = this.getLikeState();
      const coinState = this.getCoinState();
      const favState = this.getFavState();

      // 添加 点赞+一个币 按钮
      // 投币不可取消，且点赞状态可点击原按钮取消，所以已投币时不予添加显示此按钮
      if (coinState < 2) {
        this.likeAndOneCoinBtn = document.createElement('span');
        this.likeAndOneCoinBtn.title = '点赞 + 一个硬币';
        this.likeAndOneCoinBtn.className = 'al-extra-like';
        AL.toggle(this.likeAndOneCoinBtn, ON_CLASS_NAME, likeState + coinState >= 4);
        this.likeAndOneCoinBtn.innerHTML = `
          <i class="van-icon-videodetails_like like-and-one-coin">
            <i class="van-icon-videodetails_throw extra-badge"></i>
          </i>
        `;

        // 添加事件
        this.likeAndOneCoinBtn.addEventListener('click', e => {
          const aid = this.getVideoID();
          // 1-点赞；2-取消
          const like = this.getLikeState();
          VideoAPI.addCoin(aid, 1, like).then(res => {
            AL.toggle(this.likeAndOneCoinBtn, ON_CLASS_NAME);
            AL.toggle(this.likeBtn, ON_CLASS_NAME);
            AL.toggle(this.coinBtn, ON_CLASS_NAME);
          })
          // 禁止冒泡触发原来的点赞过程，悬停定位样式需要执行
          // e.stopPropagation();
        });

        ops.appendChild(this.likeAndOneCoinBtn);
      }

      // 添加 点赞+默认收藏 按钮
      this.likeAndFavBtn = document.createElement('span');
      this.likeAndFavBtn.title = '点赞 + 默认收藏';
      this.likeAndFavBtn.className = 'al-extra-like';
      AL.toggle(this.likeAndFavBtn, ON_CLASS_NAME, likeState + favState >= 4);
      this.likeAndFavBtn.innerHTML = `
        <i class="van-icon-videodetails_like like-and-fav-default">
          <i class="van-icon-videodetails_collec extra-badge"></i>
        </i>
      `;

      // 添加事件
      this.likeAndFavBtn.addEventListener('click', async e => {
        const aid = this.getVideoID();
        const mid = this.getUpMID();
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

      ops.appendChild(this.likeAndFavBtn);

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
    const url = document.querySelector('meta[itemprop="url"]').getAttribute('content');
    return url.match(/(?<=av)\d+/)[0];
  }

  getUpMID () {
    return Cookie.getItem(UP_ID_KEY);
  }

  async getDefaultFav (aid, mid) {
    const res = await VideoAPI.getFavList(aid, mid);
    return res.data.list.find(i => i.title === '默认收藏夹');
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
