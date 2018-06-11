import React, { Component } from 'react';
import MainComponent from './MainComponent';
import { Form, Header, Grid, Divider } from 'semantic-ui-react';

class SetupComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frames: 5,
      horizontal: 10,
      vertical: 6,
      setupDone: false,
      serpentineMode: true,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const { setupDone, horizontal, vertical, frames } = this.state;
    this.setState({
      setupDone: true,
      layout: {
        horizontal: horizontal,
        vertical: vertical,
      },
      frames: frames,
    })
  }

  render() {
    const { setupDone, horizontal, vertical, frames, serpentineMode } = this.state;
    const layout = {
      horizontal: horizontal,
      vertical: vertical,
    };
    return (
      <div className="setup-container">
        {setupDone &&
          <MainComponent
            layout={layout}
            frames={frames}
            serpentineMode={serpentineMode}/>
        }
        {!setupDone &&
        <div>
          <Header as='h1'>Layout of the LED panel</Header>
          <Divider />
            <Grid>
              <Grid.Row columns="3">
                <Grid.Column width="4">
                </Grid.Column>
                <Grid.Column width="8">
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
                    <Form.Button content="Start !" />
                  </Form>
                </Grid.Column>
                <Grid.Column width="4">
                </Grid.Column>
              </Grid.Row>
            </Grid>
        </div>
        }
      </div>
    )
  }
}

export default SetupComponent;