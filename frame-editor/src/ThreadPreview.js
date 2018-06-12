class ThreadPreview {
  constructor(that, delays) {
    this.that = that;
    this.delays = delays;
    this.index = 0;
    this.stopBool = false;
  }

  run() {
    if (this.stopBool) {
      return ;
    }
    if (this.index === this.delays.length){
      this.index = 0;
    }
    this.that.setState({
      current: this.index+1
    });
    this.index += 1;
    setTimeout(this.run.bind(this), this.delays[this.index-1]);
  }

  start() {
    this.run();
  }

  stop() {
    this.stopBool = true;
  }
}

export default ThreadPreview;