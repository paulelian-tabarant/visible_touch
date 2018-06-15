import React, { Component } from 'react';
import { Divider, Header, Grid, Segment } from 'semantic-ui-react';
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
Array()
class MainComponent extends Component {
  constructor(props) {
    super(props);
    const defaultDelay = 250;
    let defaultDelays = Array.apply(null, {length: props.frames})
      .map(() => defaultDelay);
    let RGBAcolors = defaultColors.map((c, i) => getRGBA(c));
    this.state = {
      color: {
        r: '255',
        g: '0',
        b: '0',
        a: '1',
      },
      colorPalette: RGBAcolors,
      delays: defaultDelays,
      selectedColor: 0,
      layout: props.layout,
      frames: props.frames,
      current: 1,
      serpentineMode: props.serpentineMode,
    }
    this.changeCurrentColor = this.changeCurrentColor.bind(this);
    this.changeDelays = this.changeDelays.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
    this.changeCurrentFrame = this.changeCurrentFrame.bind(this);
    this.handleColorPickerClick = this.handleColorPickerClick.bind(this);
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

  changeDelays(delays) {
    this.setState({
      delays: delays
    });
    this.pixelGrid.changeDelays(delays);
  }

  handleColorPickerClick(index) {
    this.setState({
      selectedColor: index,
    });
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
        <Grid divided>
          <Grid.Row columns="3">
            <Grid.Column width="4">
              <FrameSliders
                delays={this.state.delays}
                frames={this.state.frames}
                current={this.state.current}
                changeCurrentFrame={this.changeCurrentFrame}
                changeDelays={this.changeDelays}/>
            </Grid.Column>
            <Grid.Column width="8">
              <PixelGrid
                ref={ref => {this.pixelGrid = ref;}}
                color={this.state.color}
                current={this.state.current}
                delays={this.state.delays}
                frames={this.state.frames}
                layout={this.state.layout}
                serpentineMode={this.state.serpentineMode}/>
              {/* <GridComponent
                color={this.state.color}
                layout={this.state.layout}/> */}
            </Grid.Column>
            <Grid.Column width="4">
              <Segment className="color-palette">
                <Header as='h2'> Color Palette</Header>
                <Divider />
                <Grid divided='vertically'>
                  <Grid.Row columns={3}>
                    {this.state.colorPalette.map((color, i) =>
                      <Grid.Column key={i}>
                        <ColorPicker 
                          index={i}
                          color={this.state.colorPalette[i]}
                          changeCurrentColor={this.changeCurrentColor}
                          selected={i === this.state.selectedColor}
                          handleColorPickerClick={this.handleColorPickerClick}/>
                      </Grid.Column>)}
                  </Grid.Row>
                </Grid>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default MainComponent;
