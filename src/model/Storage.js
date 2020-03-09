class Storage {
  load(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : {};
  }

  save(key, values) {
    localStorage.setItem(key, JSON.stringify(values));
  }

  delete(key) {
    localStorage.removeItem(key);
  }

  keys() {
    return Object.keys(localStorage);
  }

}

export default new Storage();
export {Storage};
