import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import { Input, Button } from 'semantic-ui-react'
import 'react-rangeslider/lib/index.css'

class FrameSliders extends Component {
  constructor(props, context) {
    super(props, context);
    const { defaultDelay } = this.props;
    let defaultDelays = new Array(props.frames).fill(defaultDelay);
    this.state = {
      frames: props.frames,
      current: props.current,
      delays: defaultDelays,
      inputValue: "",
    };
  }

  handleFrameChange = (value) => {
    this.setState({
      current: value,
      inputValue: "",
    });
    this.props.changeCurrentFrame(value);
  }

  handleSetDelay = () => {
    const { current, delays, inputValue } = this.state;
    let newDelays = delays.slice();
    newDelays[current] = parseInt(inputValue);
    this.setState({
      delays: newDelays,
    });
  }

  handleInputChange = (event) => {
    this.setState({
      inputValue: event.target.value
    })
  }

  render() {
    let { frames, current, delays, inputValue } = this.state;
    let curFrameDelay = delays[current];
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
        <div className="delay-input-group">
          <Input 
            className="delay-input-field"
            value={inputValue}
            placeholder={`Current delay : ${curFrameDelay}ms`} action
            onChange={this.handleInputChange}>
            <input />
            <Button className="apply-delay" onClick={this.handleSetDelay}>Apply</Button>
          </Input>
        </div>
      </div>
    )
  }
}

export default FrameSliders;