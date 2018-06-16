import 'react-rangeslider/lib/index.css';
import '../FrameSliders.css';
import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import { Input, Button, Header, Segment, Divider } from 'semantic-ui-react';

class FrameSliders extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      frames: props.frames,
      current: props.current,
      delays: props.delays,
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
    newDelays[current-1] = parseInt(inputValue);
    if(newDelays[current-1] !== NaN) {
      this.setState({
        delays: newDelays,
        inputValue: "",
      });
      this.props.changeDelays(newDelays);
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

  increment = () => {
    const { current } = this.state;
    if(current < this.props.frames)
      this.handleFrameChange(current + 1);
  }

  decrement = () => {
    const { current } = this.state;
    if(current > 1)
      this.handleFrameChange(current - 1);
  }

  render() {
    let { frames, current, delays, inputValue } = this.state;
    let curFrameDelay = delays[current-1];
    return (
      <Segment className="slider-group">
        <Header as='h2'>Frame Selector</Header>
        <Divider />
        <Slider
          min={1}
          max={frames}
          value={current}
          orientation="horizontal"
          onChange={this.handleFrameChange}
        />
        <Header as='h4' className="value">Frame: {current}</Header>
        <div className="delay-input-group">
          <Input
            fluid
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
      </Segment>
    )
  }
}

export default FrameSliders;