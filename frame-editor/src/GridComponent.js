import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

const colors = [
  'red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue',
  'violet', 'purple', 'pink', 'brown', 'grey', 'black',
];

class GridComponent extends Component {
  render() {
    return (
      <Grid columns={5} padded>
        {colors.map(color => (
          <Grid.Column color={color} key={color}>
          </Grid.Column>
        ))}
      </Grid>
    );
  }
}

export default GridComponent;
