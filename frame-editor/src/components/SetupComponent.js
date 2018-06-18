import React, { Component } from 'react';
import { Divider, Form, Grid, Header, Segment } from 'semantic-ui-react';
import MainComponent from './MainComponent';

class SetupComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frames: 5,
      horizontal: 10,
      vertical: 6,
      serpentineMode: true,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleChange(e, { name, value }) {
    this.setState({
      [name]: parseInt(value, 10)
    });
  }

  handleChangeRadio(e, { name, value }) {
    this.setState({
      [name]: value === 'true'
    });
  }

  handleSubmit() {
    const { horizontal, vertical, frames } = this.state;
    var layout = {
      horizontal: horizontal,
      vertical: vertical,
    };
    this.setState({
      layout: layout,
      frames: frames,
    });
    this.mainComponent.reRender(frames, layout);
  }

  handleUpload(obj) {
    this.setState({
      frames: obj.delays.length,
      horizontal: obj.layout.horizontal,
      vertical: obj.layout.vertical,
    });
  }

  render() {
    const { horizontal, vertical, frames, serpentineMode } = this.state;
    const layout = {
      horizontal: horizontal,
      vertical: vertical,
    };
    return (
      <div className="setup-container">
        <Header as='h1'>Frame Editor</Header>
        <Divider />
          <Grid divided padded>
            <Grid.Row columns="2">
              <Grid.Column width="4" className='left-panel'>
                <Segment>
                  <Header as='h2'>Layout of the LED panel</Header>
                  <Divider />
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Group unstackable widths="equal">
                      <Form.Input
                        type="number"
                        label="Number of Rows"
                        name="vertical"
                        value={vertical}
                        onChange={this.handleChange}
                        width="4" />
                      <Form.Input
                        type="number"
                        name="horizontal"
                        label="Number of Columns"
                        value={horizontal}
                        onChange={this.handleChange}
                        width="4" />
                    </Form.Group>
                    <Divider />
                    <Form.Group unstackable widths="3">
                      <Form.Radio
                        label='Parallel Layout'
                        name='serpentineMode'
                        value='false'
                        checked={!serpentineMode}
                        onChange={this.handleChangeRadio} />
                      <Form.Radio
                        label='Serpentine Layout'
                        name='serpentineMode'
                        value='true'
                        checked={serpentineMode}
                        onChange={this.handleChangeRadio} />
                      <Form.Input
                        type="number"
                        name="frames"
                        label="Number of Frames"
                        value={frames}
                        onChange={this.handleChange}
                        width="4" />
                    </Form.Group>
                    <Form.Button color='purple' content="Apply Changes" />
                  </Form>
                </Segment>
              </Grid.Column>
              <Grid.Column width="12">
                <MainComponent
                  ref={ref => {this.mainComponent = ref;}}
                  layout={layout}
                  frames={frames}
                  handleUpload={this.handleUpload}
                  serpentineMode={serpentineMode}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
      </div>
    )
  }
}

export default SetupComponent;