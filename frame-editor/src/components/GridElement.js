import React, { Component } from 'react';

class GridElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorStyle: props.colorStyle
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }

  handleClick() {
    this.setState({
      colorStyle: {
        backgroundColor: 
          `rgba(${ this.props.color.r },
          ${ this.props.color.g },
          ${ this.props.color.b },
          ${ this.props.color.a })`,
      }
    })
  }

  handleMouseEnter() {
    if (this.props.mouseDown) this.handleClick();
  }

  render() {
    const colorStyle = this.state.colorStyle;
    return (
      <div
        className="grid-element"
        style={colorStyle}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}>
      </div>
    )
  };
}

export default GridElement;