async function receiv5BCoin () {
  try {
    await CommonAPI.receivePrivilege(1);
    alert('领取成功');
  } catch (error) {
    alert(error);
  }
}

/**
 * 执行主体
 */
(function (type) {
  // 领取大会员5元B币券
  receiv5BCoin();
})();