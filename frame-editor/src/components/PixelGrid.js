import axios from 'axios';
import Grid from 'pixel-grid-react';
import React, { Component } from 'react';
import fileDownload from 'js-file-download';
import { Button, Dimmer, Divider, Message, Icon, Label } from 'semantic-ui-react';
import ThreadPreview from '../ThreadPreview';


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

class PixelGrid extends Component {
  constructor(props) {
    super(props);
    var cellsArray = Array.apply(null, {length: props.frames})
      .map(i => generateGrid(props.layout));
    this.state = {
      cellsArray: cellsArray,
      previousCellsState: cellsArray[props.current],
      newDrawing: true,
      current: props.current,
      currentPreview: 1,
      delays: props.delays,
      sent: false,
      loading: false,
      lastUpload: "",
      serpentineMode: props.serpentineMode,
      previewMode: false,
      cellsBuffer: null,
      copySuccessfulMsgActive: false,
    };
  
    this.thread = null;

    this.updatePixel = this.updatePixel.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleClearCurrentFrame = this.handleClearCurrentFrame.bind(this);
    this.handleClosePreview = this.handleClosePreview.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  updatePixel(i) {
    const state = this.state;
    // copies last frame state in a buffer if the user wants to discard
    if(state.newDrawing) {
      this.setState({
        newDrawing: false,
        previousCellsState: state.cellsArray[state.current-1],
      })
    }
    // updating the pixel color
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

  // detects the first editing click of the user for drag & drop
  endDrawing() {
    this.setState({
      newDrawing: true,
    });
  }

  discardLastDrawing() {
    const { cellsArray, previousCellsState, current } = this.state;
    let newArray = cellsArray.slice();
    // retrieving pixel grid state before last user operation
    newArray[current-1] = previousCellsState;
    this.setState({
      cellsArray: newArray,
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
    this.setState({
      loading: true,
    });
    console.log(this.state.cellsArray);
    var data = this.state.cellsArray
      .map(cells =>
        cells.map(cell => cell.color.split(/,|\(/).slice(1,4).join()).join()
      );
    //serpentine mode
    var serp = this.state.cellsArray
    .map((cells, frame) =>
      cells.map((cell, i) => {
        var hor = this.props.layout.horizontal;
        var j = Math.floor(i/hor);
        if (j % 2 == 0){
          return cell;
        }
        else{
          return this.state.cellsArray[frame][(j+1)*hor-(i%hor)-1];
        }
      })
    );
    serp = serp
      .map(cells =>
        cells.map(cell => cell.color.split(/,|\(/).slice(1, 4).join()).join()
      );
    data = data.join().split(',');
    serp = serp.join().split(',');
    const dataObject = {
      data: (this.state.serpentineMode ? serp : data)
        .map(str => Math.floor(Math.pow(parseInt(str, 10),2)/255)),
      delay: 1000
    };
    axios.request({
      method: 'post',
      url: 'http://localhost:8000',
      data: dataObject,
      params: {
        headers: {'content-type': 'application/x-www-form-urlencoded'}
      }
    }).then(res => {
      console.log(res);
      console.log(res.data);
      var date = new Date();
      this.setState({
        loading: false,
        sent: true,
        lastUpload: date.toUTCString(),
      });
      setTimeout(() => {
        this.setState({
          sent: false,
        })
      }, 3000);
    });
  }

  handleDownload() {
    fileDownload(JSON.stringify(this.state.cellsArray), 'pattern.json');
  }

  handlePreview() {
    this.setState({
      previewMode: true,
      currentPreview: 1,
    });
    this.thread = new ThreadPreview(this, this.state.delays);
    this.thread.start();
  }

  handleClosePreview() {
    this.thread.stop();
    this.setState({
      previewMode: false,
      currentPreview: 1,
    });
  }

  handleUpload(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      this.setState({
        cellsArray: JSON.parse(event.target.result)
      });
    }
    reader.readAsText(file);
  }

  changeCurrentFrame(current) {
    this.setState({
      current: current,
    });
  }

  changeDelays(delays) {
    this.setState({
      delays: delays
    });
  }

  handleFrameCopy() {
    const { cellsArray, current } = this.state;
    this.setState({
      cellsBuffer: cellsArray[current-1],
      copySuccessfulMsgActive: true,
    })
    setTimeout(this.handleCloseCopyMsg, 1500);
  }

  handleCloseCopyMsg = () => {
    this.setState({
      copySuccessfulMsgActive: false,
    })
  }

  handleFramePaste() {
    const { cellsArray, current, cellsBuffer } = this.state;
    let newFrames = cellsArray.slice();
    newFrames[current-1] = cellsBuffer;
    this.setState({
      cellsArray: newFrames,
    })
  }

  discard() {

  }

  render() {
    const sent = this.state.sent;
    const loading = this.state.loading;
    const lastUpload = this.state.lastUpload;
    const previewMode = this.state.previewMode;
    const copySuccessfulMsgActive = this.state.copySuccessfulMsgActive;
    return (
      <div>
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
        <Button content="New" icon="file outline" color="green"
          onClick={this.handleClear}/>
        <Button content="Clear Current Frame" icon="close" color="red"
          onClick={this.handleClearCurrentFrame}/>
        <Button content="Send To Arduino" icon="send" color="blue"
          onClick={this.handleSend}/>
        <Divider />
        {!previewMode &&
          <Grid
            cells={this.state.cellsArray[this.state.current-1]}
            onCellEvent={this.updatePixel} />
        }
        {previewMode &&
          <Dimmer active={previewMode} onClick={this.handleClosePreview} page>
            <Grid
              className="preview-grid"
              cells={this.state.cellsArray[this.state.currentPreview-1]}
              onCellEvent={() => true}/>
          </Dimmer>
        }
        <Divider />
        { loading && 
          (<Message icon>
            <Icon name='circle notched' loading />
            <Message.Content>
              <Message.Header>Please wait</Message.Header>
              Sending frames to the serial...
            </Message.Content>
          </Message>)
        }
        {
          copySuccessfulMsgActive &&
          (<Message info icon>
            <Icon name='copy' />
            <Message.Content>
              <Message.Header>Current pattern copied to the clipboard.</Message.Header>
              <p>Use <b>CRTL+V</b> to paste it on another frame.</p>
            </Message.Content>
          </Message>)
        }
        {
          lastUpload !== "" &&
          (<Label pointing>Last upload on Arduino: {lastUpload}</Label>)
        }
      </div>
    )
  }
}

export default PixelGrid;