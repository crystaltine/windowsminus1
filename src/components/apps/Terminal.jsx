import React from 'react';
import '../../styles/Terminal.css';
import InputLine from './InputLine';

const starting = require('../../terminal_starting.json')

const Terminal = (props) => {

  const inputRef = React.useRef(null);
  const [inputDisabled, setInputDisabled] = React.useState(false);

  const [history, setHistory] = React.useState([]);
  const [currPrefix, setCurrPrefix] = React.useState("PS /> ");

  return (
    <div 
    onClick={() => { inputRef.current.focus() }}
    className='terminal'>

      <div 
      className="terminal-history margin-bottom-20px"
      dangerouslySetInnerHTML={
        {__html:
          starting.map((lineData, i) => {
            return (
              `
              <div class='terminal-line'>
                ${lineData.prefix && `<span class='prefix-style'>${lineData.prefix}</span>`}
                ${lineData.input}
              </div>
              `
            );
          }).join('')
        }} />

      <div 
      className='terminal-history'
      dangerouslySetInnerHTML={
        {__html:
          history.map((lineData, i) => {
            return (
              `
              <div class='terminal-line'>
                ${lineData.prefix && `<span class='prefix-style'>${lineData.prefix}</span>`}
                ${lineData.input}
              </div>
              `
            );
          }).join('')
        }
      } />

      <InputLine
      files={props.files}
      visible={!inputDisabled}
      setInputDisabled={setInputDisabled}
      inputRef={inputRef}
      currPrefix={currPrefix}
      setHistory={setHistory}
      writeLine={(pre, line) => { setHistory(prev => [...prev, {prefix: pre, input: line}]) }}
      setCurrPrefix={setCurrPrefix} />
      
    </div>
  );
};

export default Terminal;