import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import ColorPicker from './ColorPicker';
import GridComponent from './GridComponent';


class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: {
        r: 241,
        g: 112,
        b: 19,
        a: 1,
      },
    }
    this.changeCurrentColor = this.changeCurrentColor.bind(this);
  }

  changeCurrentColor(color) {
    this.setState({
      color: color
    });
  }

  render() {
    return (
      <div className="main-component">
        <Header as="h1">Frame Editor</Header>
        <GridComponent color={this.state.color}/>
        <ColorPicker 
          color={this.state.color}
          changeCurrentColor={this.changeCurrentColor}/>
      </div>
    );
  }
}

export default MainComponent;
