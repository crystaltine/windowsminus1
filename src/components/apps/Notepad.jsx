import React from 'react';
import '../../styles/Notepad.css';
import { OSCtx } from '../../OS';
import Popup from '../Popup';
import ExplorerDialog from '../ExplorerDialog';

const Notepad = (props) => {

	console.log("Notepad rendering with props", props)
	console.log("props initpath:", props.initPath)

	const { FileManager } = React.useContext(OSCtx);

	const [fp, setFP] = React.useState(props.initPath); // Absolute File path [string: /dir1/dir2/file.ext]
	const [content, setContent] = React.useState(FileManager.getAtPath(fp)?.contents || '');

	React.useEffect(() => {
		// Runs when explorer opens a file
		setFP(props.initPath);
		setContent(FileManager.getAtPath(props.initPath)?.contents || '');
		setExplorerDialogType('');
	}, [props.initPath]);

	console.log("FP:", fp, "Content:", content)

	const [explorerDialogType, setExplorerDialogType] = React.useState(''); // '' | 'open' | 'save'

	const [openMenuWindow , setOpenMenuWindow] = React.useState('');
	const [textareaRef, setTextareaRef] = React.useState(null);
	const [changesMade, setChangesMade] = React.useState(false); // True if changes made since last save [boolean]
	
	const [fontSize, setFontSize] = React.useState(16);

	const NotepadFunctions = React.useMemo(() => {
		return class {

			static newFile = () => {
				// Assume user confirmed
				setContent('');
				setFP(null);
			}

			static openFile = (path) => {
				const file = FileManager.getAtPath(path);
				if (file) {
					setContent(file.contents);
					setFP(path);
				}
			}	

			static saveFile = (path) => {

				if (path) {
					FileManager.writeAtPath(path, false, content);
					setFP(path);
					setChangesMade(false);
				}
				else {
					// Open explorer dialog with operation 'save as'
					setExplorerDialogType('save');
				}
			}
		}
	}, [FileManager, content]);

	React.useEffect(() => {
		
		const handleKeyDown = (e) => {
			if (e.ctrlKey) {
				switch (e.key) {
					case 's':
						e.preventDefault();
						NotepadFunctions.saveFile(fp);
						break;
					case 'o':
						e.preventDefault();
						NotepadFunctions.openFile(); // needs to select filepath
						break;
					case '-':
						e.preventDefault();
						setFontSize((prev) => { return prev - 1 });
						break;
					case '=':
						e.preventDefault();
						setFontSize((prev) => { return prev + 1 });
						break;
					case '0':
						e.preventDefault();
						setFontSize(16);
						break;
					default:
						break;
				}					
			}
		}

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		}
	}, [NotepadFunctions, fp]);

  return (
    <div className='notepad-container'>

      {explorerDialogType?

				<ExplorerDialog 
				operation={explorerDialogType}
				onDone={(path) => {
					setExplorerDialogType('')
					if (explorerDialogType === 'open') NotepadFunctions.openFile(path);
					else if (explorerDialogType === 'save') NotepadFunctions.saveFile(path);
				}}
				onCancel={() => setExplorerDialogType('')} /> :
				
				<>
					<header className='notepad-header'>

					<div
					className='notepad-header-button'
					onClick={() => setOpenMenuWindow(openMenuWindow === 'file'? '' : 'file')}>

						File
						<div className='notepad-header-dropdown' style={{display: openMenuWindow === 'file'? 'flex' : 'none'}}>

							<button 
							onClick={() => NotepadFunctions.newFile()}
							className='notepad-header-dropdown-button'>
								New
							</button>

							<button 
							onClick={() => setExplorerDialogType('open')}
							className='notepad-header-dropdown-button'>
								Open
							</button>

							<button
							onClick={() => NotepadFunctions.saveFile(fp)}
							className='notepad-header-dropdown-button'>
								Save
							</button>

							<button 
							onClick={() => NotepadFunctions.saveFile()}
							className='notepad-header-dropdown-button'>
								Save As
							</button>

						</div>

					</div>

					<div
					className='notepad-header-button'
					onClick={() => setOpenMenuWindow(openMenuWindow === 'view'? '' : 'view')}>

						View
						<div className='notepad-header-dropdown' style={{display: openMenuWindow === 'view'? 'flex' : 'none'}}>

							<button 
							onClick={() => setFontSize(fontSize + 1)}
							className='notepad-header-dropdown-button'>
								Zoom In
							</button>
							<button 
							onClick={() => setFontSize(fontSize - 1)}
							className='notepad-header-dropdown-button'>
								Zoom Out
							</button>
							<button 
							onClick={() => setFontSize(16)}
							className='notepad-header-dropdown-button'>
								Reset Zoom
							</button>
						</div>

					</div>

					</header>

					<textarea 
					spellCheck={false}
					onKeyDown={(e) => {
						setChangesMade(true);
						// Handle tab (insert 4 spaces)
						if (e.key === 'Tab') {
							e.preventDefault();
							const start = e.target.selectionStart;
							const end = e.target.selectionEnd;

							setContent(content.substring(0, start) + '\t' + content.substring(end));
							textareaRef.selectionStart = textareaRef.selectionEnd = start + 4;
						}
					}}
					ref={setTextareaRef}
					value={content}
					style={{fontSize: `${fontSize}px`}}
					onChange={(e) => { setContent(e.target.value) }}
					className='notepad-textarea' />

					<footer className={`notepad-footer${changesMade? ' --unsaved' : ''}`}>
						<span className='file-desc'>File: {fp || 'Untitled'}</span>
						<span>{changesMade? 'Unsaved Changes!' : 'Up to date.'}</span>
					</footer>
				</>
			}

    </div>
	);
};

export default Notepad;