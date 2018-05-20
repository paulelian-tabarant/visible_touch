import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import '../Grid.css';
import GridElement from './GridElement';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class GridComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      mouseDown: false,
      layout: props.layout,
    }
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown() {
    this.setState({
      mouseDown: true
    });
  }

  handleMouseUp() {
    this.setState ({
      mouseDown: false
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      layout: nextProps.layout
    })
  }

  render() {
    const length = this.state.layout.horizontal * this.state.layout.vertical;
    const colorsStyle = Array.apply(null, {length: length})
      .map(color => ({backgroundColor: getRandomColor()}));
    return (
      <Grid
        columns={this.state.layout.horizontal}
        className="grid-component"
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}>
        {colorsStyle.map((colorStyle, i) => (
          <Grid.Column className="grid-column" key={i}>
            <GridElement 
              colorStyle={colorStyle}
              color={this.props.color}
              mouseDown={this.state.mouseDown}/>
          </Grid.Column>
        ))}
      </Grid>
    );
  }
}

export default GridComponent;
