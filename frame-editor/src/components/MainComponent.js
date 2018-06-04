import React, { Component } from 'react';
import { Divider, Header, Grid } from 'semantic-ui-react';
import ColorPicker from './ColorPicker';
import GridComponent from './GridComponent';
import LayoutSliders from './LayoutSliders';
import PixelGrid from './PixelGrid';
import FrameSliders from './FrameSliders';

const RED = [255, 0, 0, 1], 
GREEN = [0, 255, 0, 1], 
BLUE = [0, 0, 255, 1],
WHITE = [255, 255, 255, 1], 
GREY = [110, 110, 110, 1], 
BLACK = [0, 0, 0, 1];
const defaultColors = [RED, GREEN, BLUE, BLACK, GREY, WHITE];

function getRGBA(color) {
  let RGBAcolor = {
    'r': color[0],
    'g': color[1],
    'b': color[2],
    'a': color[3],
  }
  return RGBAcolor;
}

class MainComponent extends Component {
  constructor(props) {
    super(props);
    let RGBAcolors = defaultColors.map((c, i) => getRGBA(c));
    this.state = {
      color: {
        r: '255',
        g: '255',
        b: '255',
        a: '1',
      },
      colorPalette: RGBAcolors,
      layout: props.layout,
      frames: props.frames,
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
    const defaultDelay = 250;
    return (
      <div className="main-component">
        <Header as="h1">Frame Editor</Header>
        {/* <Divider />
        <LayoutSliders
          layout={this.state.layout}
          changeLayout={this.changeLayout}/> */}
        <Divider />
        <Grid divided='vertically'>
          <Grid.Row columns={this.state.colorPalette.length}>
            {this.state.colorPalette.map((color, i) =>
              <Grid.Column key={i}>
                <ColorPicker 
                color={this.state.colorPalette[i]}
                changeCurrentColor={this.changeCurrentColor}/>
              </Grid.Column>)}
          </Grid.Row>
        </Grid>
        <Divider />
        <FrameSliders
          frames={this.state.frames}
          current={this.state.current}
          changeCurrentFrame={this.changeCurrentFrame}
          defaultDelay={defaultDelay}/>
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
