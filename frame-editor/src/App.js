import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import './App.css';
import ColorPicker from './components/ColorPicker';
import GridComponent from './components/GridComponent';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header as="h1">Frame Editor</Header>
        <GridComponent />
        <ColorPicker />
      </div>
    );
  }
}

export default App;
