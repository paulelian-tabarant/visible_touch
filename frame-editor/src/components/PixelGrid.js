import axios from 'axios';
import Grid from 'pixel-grid-react';
import React, { Component } from 'react';
import fileDownload from 'js-file-download';
import { Button, Divider, Message, Icon, Label } from 'semantic-ui-react';


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
      current: props.current,
      sent: false,
      loading: false,
      lastUpload: "",
      serpentineMode: true,
    };
    this.updatePixel = this.updatePixel.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleClearCurrentFrame = this.handleClearCurrentFrame.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.layout !== nextProps.layout){
      this.setState({
        cells: generateGrid(nextProps.layout)
      });
    }
  }

  updatePixel(i) {
    // console.log('Update pixel', i);
    const state = this.state;
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

  render() {
    const sent = this.state.sent;
    const loading = this.state.loading;
    const lastUpload = this.state.lastUpload;
    return (
      <div>
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
        <Grid
          cells={this.state.cellsArray[this.state.current-1]}
          onCellEvent={this.updatePixel}
        />
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
          lastUpload !== "" &&
          (<Label pointing>Last upload on Arduino: {lastUpload}</Label>)
        }
      </div>
    )
  }
}

export default PixelGrid;