import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'

class LayoutSliders extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      layout: props.layout,
    };
  }

  handleOnChangeHorizontal = (value) => {
    var layout = {
      vertical: this.state.layout.vertical,
      horizontal: value,
    };
    this.setState({
      layout: layout
    });
    this.props.changeLayout(layout);
  }

  handleOnChangeVertical = (value) => {
    var layout = {
      vertical: value,
      horizontal: this.state.layout.horizontal,
    };
    this.setState({
      layout: layout
    });
    this.props.changeLayout(layout);
  }

  render() {
    let { layout } = this.state;
    return (
      <div className="slider-group">
        <Slider
          min={1}
          max={30}
          value={layout.vertical}
          orientation="horizontal"
          onChange={this.handleOnChangeVertical}
        />
        <div className="value">Number of rows: {layout.vertical}</div>
        <Slider
          min={1}
          max={16}
          value={layout.horizontal}
          orientation="horizontal"
          onChange={this.handleOnChangeHorizontal}
        />
        <div className="value">Number of columns: {layout.horizontal}</div>
      </div>
    )
  }
}

export default LayoutSliders;