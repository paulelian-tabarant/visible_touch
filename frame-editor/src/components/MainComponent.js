import React, { Component } from 'react';
import { Divider, Header } from 'semantic-ui-react';
import ColorPicker from './ColorPicker';
import GridComponent from './GridComponent';
import LayoutSliders from './LayoutSliders';
import PixelGrid from './PixelGrid';
import FrameSliders from './FrameSliders';


class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: {
        r: 86,
        g: 188,
        b: 93,
        a: 1,
      },
      layout: {
        vertical: 1,
        horizontal: 10,
      },
      frames: 10,
      current: 1,
    }
    this.changeCurrentColor = this.changeCurrentColor.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
    this.changeCurrentFrame = this.changeCurrentFrame.bind(this);
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

  changeCurrentFrame(current) {
    this.setState({
      current: current
    });
    this.pixelGrid.changeCurrentFrame(current);
  }

  render() {
    return (
      <div className="main-component">
        <Header as="h1">Frame Editor</Header>
        {/* <Divider />
        <LayoutSliders
          layout={this.state.layout}
          changeLayout={this.changeLayout}/> */}
        <Divider />
        <ColorPicker 
          color={this.state.color}
          changeCurrentColor={this.changeCurrentColor}/>
        <Divider />
        <FrameSliders
          frames={this.state.frames}
          current={this.state.current}
          changeCurrentFrame={this.changeCurrentFrame}/>
        <Divider />
        <PixelGrid
          ref={ref => {this.pixelGrid = ref;}}
          color={this.state.color}
          current={this.state.current}
          frames={this.state.frames}
          layout={this.state.layout}/>
        {/* <GridComponent
          color={this.state.color}
          layout={this.state.layout}/> */}
      </div>
    );
  }
}

export default MainComponent;
