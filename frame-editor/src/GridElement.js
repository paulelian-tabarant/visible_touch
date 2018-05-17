import React, { Component } from 'react';

class GridElement extends Component {
  render() {
    return (
      <div
        className="grid-element"
        style={this.props.colorStyle}>
      </div>
    )
  };
}

export default GridElement;