// Default Interval = 30 minutes
const DEFUALT_INTERVAL = 1000 * 60 * 30;

class Poll {
  constructor() {
    this.timeout = undefined;
    this.shouldReSync = undefined;
    this.tabInFocus = true;
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('focus', this.onFocus);
    window.addEventListener('blur', this.onBlur);
  }

  removeListeners() {
    window.removeEventListener('focus', this.onFocus);
    window.removeEventListener('blur', this.onBlur);
  }

  tearDown() {
    this.stop();
    this.removeListeners();
  }

  onFocus = () => {
    this.tabInFocus = true;
    this.onRefocus();
  }

  onBlur = () => {
    this.tabInFocus = false;
  }

  start(cb, interval = DEFUALT_INTERVAL) {
    this.cb = cb;
    this.interval = interval;
    this.stop();
    this.cycle();
  }

  stop = () => clearTimeout(this.timeout);

  cycle() {
    this.timeout = setTimeout(() => {
      if (this.tabInFocus) {
        this.cb();
        this.cycle();
      } else {
        // if the tab isnt in focus, kill the poll
        // and wait for it to re-focus
        this.shouldReSync = true;
        this.stop();
      }
    }, this.interval);
  }

  onRefocus() {
    if (this.shouldReSync) {
      this.shouldReSync = false;

      // immidiatly call the cb to catch the state back up.
      this.cb();
      this.setupListeners();
      this.cycle();
    }
  }
}

export default Poll;
