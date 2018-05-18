import React, { Component } from 'react';

class GridElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorStyle: props.colorStyle
    };
  }

  render() {
    const colorStyle = this.state.colorStyle;
    return (
      <div
        className="grid-element"
        style={colorStyle}>
      </div>
    )
  };
}

export default GridElement;