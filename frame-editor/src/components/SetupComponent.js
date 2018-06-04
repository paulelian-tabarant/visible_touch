import React, { Component } from 'react';
import MainComponent from './MainComponent';
import { Form, Header, Grid, Divider } from 'semantic-ui-react';

class SetupComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frames: 2,
      horizontal: 10,
      vertical: 6,
      setupDone: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e, { name, value }) {
    this.setState({
      [name]: parseInt(value, 10)
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
    const { setupDone, horizontal, vertical, frames } = this.state;
    const layout = {
      horizontal: horizontal,
      vertical: vertical,
    };
    return (
      <div className="setup-container">
        {setupDone &&
          <MainComponent
            layout={layout}
            frames={frames}/>
        }
        {!setupDone &&
          <Form onSubmit={this.handleSubmit}>
            <Header>Layout of the LED panel</Header>
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
            <Form.Input
              type="number"
              name="frames"
              label="Number of Frames"
              value={frames}
              onChange={this.handleChange}
              width="4" />
            <Form.Button content="Start !" />
          </Form>
        }
      </div>
    )
  }
}

export default SetupComponent;