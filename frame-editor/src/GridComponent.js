import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import GridElement from './GridElement';
import './Grid.css';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const colors = [
  'red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue',
  'violet', 'purple', 'pink', 'brown', 'grey', 'black',
];

const colorsStyle = colors.map(color => (
  {
    backgroundColor: getRandomColor(),
  }
));

class GridComponent extends Component {
  render() {
    return (
      <Grid columns={5}>
        {colorsStyle.map((colorStyle, i) => (
          <Grid.Column className="grid-column" key={i}>
            <GridElement colorStyle={colorStyle} />
          </Grid.Column>
        ))}
      </Grid>
    );
  }
}

export default GridComponent;
