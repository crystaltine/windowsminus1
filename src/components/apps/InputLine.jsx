import React from 'react';
import { OSCtx } from '../../OS';

const InputLine = ({ setHistory, writeLine, setInputDisabled, currPrefix, setCurrPrefix, inputRef, visible }) => {

	const { FileManager, ProcessManager } = React.useContext(OSCtx);

	function handleCommand(cmd, options) {
		switch (cmd) {

			case "clear":
				setHistory([]);
				setInputHistory(prev => [...prev, "clear"]);
				return true;

			case "notepad":
				if (options.length === 0) {
					ProcessManager.openProcess(3)
					return true;
				} else {
					let pathToOpen = options[0];
					if (!pathToOpen.startsWith('/')) pathToOpen = '/' + pathToOpen;
					ProcessManager.openProcess(3, {initPath: pathToOpen})
					return false;
				}
				
			default:
				writeLine("", "<span class='gray'>Unknown command. Visit <a class='yellow' target='_blank' href='https://github.com/crystaltine/windowsminus1'>Windows -1 README</a> for terminal help.</span>");
				return false;
		}
	}

	const [typedInput, setTypedInput] = React.useState(""); // save the entered input in case user uses arrow keys
	const [currInput, setCurrInput] = React.useState("");
	const [inputHistory, setInputHistory] = React.useState([]);
	const [inputHistoryIndex, setInputHistoryIndex] = React.useState(0);

  return (
    <div className='terminal-line' style={{display: visible? 'flex' : 'none'}}>

			<span className='prefix-style'>{currPrefix}</span>

			<input
			spellCheck={false}
			ref={inputRef}
			value={currInput}
			onChange={(e) => {
				setTypedInput(e.target.value);
				setCurrInput(e.target.value);
				setInputHistoryIndex(0);
			}}
			className='terminal-input' 
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();

					// Add command to input history
					setInputHistory(prev => [...prev, currInput]);

					// Write command to history
					writeLine(currPrefix, currInput)

					handleCommand(currInput.split(' ')[0], currInput.split(' ').slice(1));
					setCurrInput('');
					setTypedInput('');
				}

				if (e.key === "ArrowUp") {
					e.preventDefault();
					if (inputHistory.length > 0 && -inputHistoryIndex < inputHistory.length) {
						setInputHistoryIndex(prev => prev - 1);
						setCurrInput(inputHistory.at(inputHistoryIndex - 1));
					}
				} else if (e.key === "ArrowDown") {
					e.preventDefault();
					if (inputHistory.length > 0 && inputHistoryIndex < -1) {
						setInputHistoryIndex(prev => prev + 1);
						setCurrInput(inputHistory.at(inputHistoryIndex + 1));

					} else if (inputHistoryIndex === -1) {
						setInputHistoryIndex(0);
						setCurrInput(typedInput);
					}
				}
			}} />

		</div>
  );
};

export default InputLine;