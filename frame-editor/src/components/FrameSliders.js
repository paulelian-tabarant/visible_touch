import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'

class FrameSliders extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      frames: props.frames,
      current: props.current,
    };
  }

  handleFrameChange = (value) => {
    this.setState({
      current: value
    });
    this.props.changeCurrentFrame(value);
  }

  render() {
    let { frames, current } = this.state;
    return (
      <div className="slider-group">
        <Slider
          min={1}
          max={frames}
          value={current}
          orientation="horizontal"
          onChange={this.handleFrameChange}
        />
        <div className="value">Frame: {current}</div>
      </div>
    )
  }
}

export default FrameSliders;