Storage.prototype.get = function (key) {
  const res = this.getItem(key);
  return res && JSON.parse(res);
}

Storage.prototype.set = function (key, value) {
  this.setItem(key, JSON.stringify(value));
}
