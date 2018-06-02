import axios from 'axios';
import Grid from 'pixel-grid-react';
import React, { Component } from 'react';
import { Button, Divider } from 'semantic-ui-react';
import fileDownload from 'js-file-download';

function generateGrid(layout) {
  const cells = []
  for (let i = 0; i < layout.horizontal * layout.vertical; i++) {
    cells.push({
      width: 100 / layout.horizontal,
      color: 'rgba(49,49,49,1)',
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
    var data = this.state.cellsArray
      .map(cells =>
        cells.map(cell => cell.color.split(/,|\(/).slice(1,4).join()).join()
      ).join();
    data = data.split(',');
    const dataObject = {
      data: data.map(str => parseInt(str, 10))
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
      this.setState({
        loading: false,
        sent: true,
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
    const visible = sent || loading;
    return (
      <div>
        <Button content="Save Pattern" icon="save" color="yellow"
          onClick={this.handleDownload}/>
        <label htmlFor="file" className="ui violet icon button">
            <i className="upload icon"></i>
            &nbsp; Load Pattern < /label>
        <input type="file" id="file" style={{display:"none"}}
          onChange={this.handleUpload}/>
        <Divider />
        <Button content="New" icon="file outline" color="green"
          onClick={this.handleClear}/>
        <Button content="Clear Current Frame" icon="close" color="red"
          onClick={this.handleClearCurrentFrame}/>
        <Button content="Send To Arduino" icon="send" color="blue"
          onClick={this.handleSend}/>
        {visible && 
          <Button loading={loading} content="Sent" color="pink"
            icon="checkmark" />}
        <Divider />
        <Grid
          cells={this.state.cellsArray[this.state.current-1]}
          onCellEvent={this.updatePixel}
        />
      </div>
    )
  }
}

export default PixelGrid;