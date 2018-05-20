import React, { Component } from 'react';
import { Divider, Header } from 'semantic-ui-react';
import ColorPicker from './ColorPicker';
import GridComponent from './GridComponent';
import LayoutSliders from './LayoutSliders';
import PixelGrid from './PixelGrid';


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
      layout: {
        vertical: 5,
        horizontal: 10,
      }
    }
    this.changeCurrentColor = this.changeCurrentColor.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
  }

  changeCurrentColor(color) {
    this.setState({
      color: color
    });
  }

  changeLayout(layout) {
    this.setState({
      layout: layout
    });
  }

  render() {
    return (
      <div className="main-component">
        <Header as="h1">Frame Editor</Header>
        <Divider />
        <LayoutSliders
          layout={this.state.layout}
          changeLayout={this.changeLayout}/>
        <Divider />
        <ColorPicker 
          color={this.state.color}
          changeCurrentColor={this.changeCurrentColor}/>
        <Divider />
        <GridComponent
          color={this.state.color}
          layout={this.state.layout}/>
        <PixelGrid
          color={this.state.color}
          layout={this.state.layout}/>
      </div>
    );
  }
}

export default MainComponent;
