import React from 'react';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import '../ColorPicker.css';

class ColorPicker extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displayColorPicker: false,
      color: props.color
    };
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
    this.props.changeCurrentColor(this.state.color);
  };
  
  handleChange = (color) => {
    this.setState({ color: color.rgb });
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '18vw',
          height: '5vh',
          borderRadius: '2px',
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
        swatch: {
          padding: '5px',
          background: '#ECE8EF',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'relative',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        }
      },
    });

    return (
      <div>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color }
            onChange={ this.handleChange } />
        </div> : null }

      </div>
    )
  }
}

export default ColorPicker