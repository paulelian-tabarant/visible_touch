import Grid from 'pixel-grid-react';
import React, { Component } from 'react';


function generateGrid(layout) {
  const cells = []
  for (let i = 0; i < layout.horizontal * layout.vertical; i++) {
    cells.push({
      width: 100 / layout.horizontal,
      color: 'rgb(49, 49, 49)',
      id: i
    })
  }
  return cells
};


class PixelGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cells: generateGrid(props.layout)
    };
    this.updatePixel = this.updatePixel.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.layout != nextProps.layout){
      this.setState({
        cells: generateGrid(nextProps.layout)
      });
    }
  }

  updatePixel(i) {
    // console.log('Update pixel', i);
    const state = this.state
    const color = `rgba(${ this.props.color.r },
      ${ this.props.color.g },
      ${ this.props.color.b },
      ${ this.props.color.a })`;
    const updatedCell = Object.assign({}, state.cells[i], {
      color
    })
    const cells = [].concat(
      state.cells.slice(0, i),
      [updatedCell],
      state.cells.slice(i + 1)
    )
    this.setState(Object.assign({}, this.state, {
      cells
    }))
  }
  render() {
    return (
      <Grid
        cells={this.state.cells}
        onCellEvent={this.updatePixel}
      />
    )
  }
}

export default PixelGrid;