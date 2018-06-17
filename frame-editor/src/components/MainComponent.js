import React, { Component } from 'react';
import { Button, Divider, Header, Grid, Segment } from 'semantic-ui-react';
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

function generateGrid(layout) {
  const cells = []
  for (let i = 0; i < layout.horizontal * layout.vertical; i++) {
    cells.push({
      width: 100 / layout.horizontal,
      color: 'rgba(0,0,0,1)',
      id: i
    })
  }
  return cells
};

class MainComponent extends Component {
  constructor(props) {
    super(props);
    const defaultDelay = 250;
    let defaultDelays = Array.apply(null, {length: props.frames})
      .map(() => defaultDelay);
    let RGBAcolors = defaultColors.map((c, i) => getRGBA(c));
    var cellsArray = Array.apply(null, {length: props.frames})
      .map(i => generateGrid(props.layout));
    this.state = {
      color: {
        r: '255',
        g: '0',
        b: '0',
        a: '1',
      },
      cellsArray: cellsArray,
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
    this.handleDownload = this.handleDownload.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
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

  handleKeyDown = (event) => {
    let vKey = 86,
        cKey = 67,
        zKey = 90,
        leftArrowKey = 37,
        rightArrowKey = 39;
    let keyCode = event.keyCode, ctrlDown = event.ctrlKey;
    if(ctrlDown) {
      if(keyCode == cKey) {
        this.pixelGrid.handleFrameCopy();
      }
      else if (keyCode == vKey) {
        this.pixelGrid.handleFramePaste();
      }
      else if (keyCode == zKey) {
        this.pixelGrid.discardLastDrawing();
      }
    }
    else {
      if(keyCode == leftArrowKey) {
        this.frameSliders.decrement();
      }
      else if (keyCode == rightArrowKey) {
        this.frameSliders.increment();
      }
    }
  }

  handleMouseUp = (event) => {
    this.pixelGrid.endDrawing();
  }

  handleDownload() {
    this.pixelGrid.handleDownload();
  }

  handlePreview() {
    this.pixelGrid.handlePreview();
  }

  handleUpload(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      var obj = JSON.parse(event.target.result);
      this.setState({
        layout: obj.layout,
        delays: obj.delays,
        frames: obj.delays.length,
        cellsArray: obj.cellsArray,
      });
      this.pixelGrid.handleUpload(obj);
      this.frameSliders.handleUpload(obj.delays);
    }
    reader.readAsText(file);
  }

  render() {
    return (
      <div className="main-component" 
           onKeyDown={this.handleKeyDown} 
           onMouseUp={this.handleMouseUp}
           tabIndex='0'>
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
                ref={ref => {this.frameSliders = ref;}}
                delays={this.state.delays}
                frames={this.state.frames}
                current={this.state.current}
                changeCurrentFrame={this.changeCurrentFrame}
                changeDelays={this.changeDelays}/>
            </Grid.Column>
            <Grid.Column width="8">
              <Button content="Preview Pattern" icon="play" color="orange"
                onClick={this.handlePreview}/>
              <Button content="Save Pattern" icon="save" color="yellow"
                onClick={this.handleDownload}/>
              <label htmlFor="file" className="ui violet icon button">
                  <i className="upload icon"></i>
                  &nbsp; Load Pattern </label>
              <input type="file" id="file" style={{display:"none"}}
                onChange={this.handleUpload}/>
              <Divider />
              <PixelGrid
                ref={ref => {this.pixelGrid = ref;}}
                cellsArray={this.state.cellsArray}
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
