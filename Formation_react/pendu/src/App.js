import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './App.css';

const words = ["HOUSE", "ENTERTAINMENT", "LIGHTBULB"]
const charsAllowed = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const Word = ({ display, found }) => (
  <div className={`word ${found}`}>{display}</div>
)

Word.propTypes = {
  display: PropTypes.string.isRequired,
  found: PropTypes.bool.isRequired,
}

const Key = ({ value, used, onClick }) => (
  <div className={`key ${used}`} onClick={() => onClick(value)}>
    <span className="character">{value}</span>
  </div> 
)

Key.propTypes = {
  value: PropTypes.string.isRequired,
  used: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

const Keyboard = ({ charSet, disabledKeys, onClick }) => (
  <div className='keyboard'>
    {charSet.map((symbol) => (
      <Key key={symbol}
           value={symbol}
           used={disabledKeys.includes(symbol)}
           onClick={() => onClick(symbol)}
           />
    ))}
  </div>
)

Keyboard.propTypes = {
  charSet: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabledKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
}

class App extends Component {
  state = {
    curWord: this.pickWord(),
    usedLetters: [],
  }

  initGame = () => {
    this.setState({
      curWord: this.pickWord(),
      usedLetters: [],
    })
  }

  computeDisplay(phrase, usedLetters) {
    return phrase.replace(/\w/g,
      (letter) => usedLetters.includes(letter) ? letter : '_')
  }

  pickWord() {
    let randIndex = Math.floor(Math.random() * words.length)
    return words[randIndex]
  }

  handleKeyPressed = key => {
    const { usedLetters } = this.state
    if(usedLetters.includes(key)) {
      return
    }
    this.setState({
      usedLetters: [...usedLetters, key]
    })
  }

  render() {
    const { curWord, usedLetters } = this.state
    const lettersLeft = this.computeDisplay(curWord, usedLetters).includes('_')
    return (
      <div className="pendu">
        <Word 
          className="word" 
          display={this.computeDisplay(curWord, usedLetters)}
          found={lettersLeft ? false : true} />
        {lettersLeft ?
          (<Keyboard 
          charSet={charsAllowed} 
          disabledKeys={usedLetters} 
          onClick={this.handleKeyPressed} />) : 
          (<button type="button" onClick={this.initGame}>
            REJOUER
          </button>)}
      </div>
    );
  }
}

export default App;
