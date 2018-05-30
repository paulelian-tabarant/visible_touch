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
    if(inputValue === "") return;
    newDelays[current] = parseInt(inputValue);
    if(newDelays[current] !== NaN) {
      this.setState({
        delays: newDelays,
        inputValue: "",
      });
    }
  }

  handleInputChange = (event) => {
    this.setState({
      inputValue: event.target.value
    })
  }

  handleInputKey = (event) => {
    if(event.keyCode == 13) {
      this.handleSetDelay();
    }
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
            type="number"
            className="delay-input-field"
            value={inputValue}
            placeholder={`Current delay : ${curFrameDelay}ms`} action
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKey}>
            <input />
            <Button className="apply-delay" onClick={this.handleSetDelay}>Apply</Button>
          </Input>
        </div>
      </div>
    )
  }
}

export default FrameSliders;