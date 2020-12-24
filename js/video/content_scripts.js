class VideoAL {
  constructor () {}

  init () {
    this.hideSlideAd();
    this.hideGameCards();
  }

  hideSlideAd () {
    AL.hide('.r-con .ad-report');
  }

  hideGameCards () {
    const cards = document.getElementsByClassName('video-page-game-card');
    [].forEach.call(cards, c => AL.hide(c.parentNode));
  }
}

const videoAL = new VideoAL();
videoAL.init();
