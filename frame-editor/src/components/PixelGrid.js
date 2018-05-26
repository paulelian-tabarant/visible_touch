import Grid from 'pixel-grid-react';
import React, { Component } from 'react';
import { Button, Divider } from 'semantic-ui-react';


function generateGrid(layout) {
  const cells = []
  for (let i = 0; i < layout.horizontal * layout.vertical; i++) {
    cells.push({
      width: 100 / layout.horizontal,
      color: 'rgba(49,49,49,1)',
      id: i
    })
  }
  return cells
};

class PixelGrid extends Component {
  constructor(props) {
    super(props);
    var cellsArray = Array.apply(null, {length: props.frames})
      .map(i => generateGrid(props.layout));
    this.state = {
      cellsArray: cellsArray,
      current: props.current,
    };
    this.updatePixel = this.updatePixel.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleClearCurrentFrame = this.handleClearCurrentFrame.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.layout !== nextProps.layout){
      this.setState({
        cells: generateGrid(nextProps.layout)
      });
    }
  }

  updatePixel(i) {
    // console.log('Update pixel', i);
    const state = this.state;
    const color = `rgba(${ this.props.color.r },`+
      `${ this.props.color.g },`+
      `${ this.props.color.b },`+
      `${ this.props.color.a })`;
    const updatedCell = Object.assign({}, state.cellsArray[state.current-1][i], {
      color
    });
    const cells = [].concat(
      state.cellsArray[state.current-1].slice(0, i),
      [updatedCell],
      state.cellsArray[state.current-1].slice(i + 1)
    );
    const cellsArray = state.cellsArray;
    cellsArray[state.current-1] = cells;
    this.setState({
      cellsArray: cellsArray,
    });
  }

  handleClear() {
    var cellsArray = Array.apply(null, {length: this.props.frames})
      .map(i => generateGrid(this.props.layout));
    this.setState({
      cellsArray: cellsArray,
    })
  }

  handleClearCurrentFrame() {
    var cellsArray = this.state.cellsArray;
    cellsArray[this.state.current-1] = generateGrid(this.props.layout);
    this.setState({
      cellsArray: cellsArray,
    });
  }

  handleSend() {
    console.log(this.state);
  }

  changeCurrentFrame(current) {
    this.setState({
      current: current
    });
  }

  render() {
    return (
      <div>
        <Button content="New" icon="file outline" color="green"
          onClick={this.handleClear}/>
        <Button content="Clear Current Frame" icon="close" color="red"
          onClick={this.handleClearCurrentFrame}/>
        <Button content="Send To Arduino" icon="send" color="blue"
          onClick={this.handleSend}/>
        <Divider />
        <Grid
          cells={this.state.cellsArray[this.state.current-1]}
          onCellEvent={this.updatePixel}
        />
      </div>
    )
  }
}

export default PixelGrid;