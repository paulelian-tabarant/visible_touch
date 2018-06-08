import React from 'react';
import { Divider, Label, Icon, Dimmer, Segment } from 'semantic-ui-react'
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import '../ColorPicker.css';

class ColorPicker extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displayColorPicker: false,
      color: props.color,
    };
  }

  handleClick = () => {
    const { handleColorPickerClick, index } = this.props;
    console.log("Clicked!");
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
    handleColorPickerClick(index);
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
    this.props.changeCurrentColor(this.state.color);
  };
  
  handleChange = (color) => {
    this.setState({ color: color.rgb });
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '50px',
          height: '5vh',
          borderRadius: '2px',
          background: `rgba(${ this.state.color.r },`+
            `${ this.state.color.g },`+
            `${ this.state.color.b },`+
            `${ this.state.color.a })`,
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
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
        cover: {
          zIndex: '2',
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        }
      },
    });

    const { displayColorPicker } = this.state

    return (
      <div>
        <div>
          <div style={ styles.swatch } onClick={ this.handleClick }>
            <div style={ styles.color } />
            { this.props.selected && 
              <Icon name='angle up'/> }
          </div>
        </div>
        { displayColorPicker &&
          <Dimmer active={displayColorPicker} onClickOutside={this.handleClose} page>
            <div style={ styles.popover }>
              <SketchPicker color={ this.state.color }
                onChange={ this.handleChange } />
            </div>
        </Dimmer> }
      </div>
    )
  }
}

export default ColorPicker