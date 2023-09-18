import React from 'react';
import '../styles/Explorer.css';
import { OSCtx } from '../OS';
import Popup from './Popup';
import FileListItem from './FileListItem';
const homeIcon = require('../assets/home.png');

/**
 * @param {String} filename name of file to check
 * @returns {Boolean} true if:
 * FIlename has at least 1 alphanumeric character
 * Filename does not contain "/"
 */
function validateFilename(str) {
  return str.match(/[a-z0-9]/i) && !str.includes('/');
}

const ExplorerDialog = ({ operation, onDone, onCancel, presetExt = '.txt' }) => {

  const { FileManager } = React.useContext(OSCtx);
  const [currPath, setCurrPath] = React.useState('/C:/');
  const fileList = FileManager.listFilesAt(currPath);
  const [deletedFlag, setDeletedFlag] = React.useState(false); // used to force re-render of FileListItems after deletion

  const inputRef = React.useRef(null);

	const [saveFilename, setSaveFilename] = React.useState(''); // only used for 'save' operation

  const [currPopup, setCurrPopup] = React.useState(null); // null | 'rename' | 'new'

  return (
    <div className='explorer-container'>

    <Popup
    visible={currPopup === 'rename' || currPopup === 'new'}
    title={currPopup === 'rename'? 'Rename File' : 'New Folder'}
    input={true}

    content={`Create new folder at ${currPath} called:`}

    button1={(value) => {
      FileManager.writeAtPath(currPath + value, true)
      setCurrPopup(null)
    }}

    button1Text='Create'
    button2={() => setCurrPopup(null)}
    button2Text='Cancel' />

			<div className='explorer-header'>

        <button 
        className='explorer-button'
        onClick={() => {
          setCurrPath('/');
          inputRef.current.value = '/'}}>
          <img src={homeIcon} alt='home' className='explorer-button-icon' />
        </button>

        <button 
        className={`explorer-button${fileList === null? " --btn-disabled" : ""}`}
        disabled={fileList === null}
        onClick={() => {
          // Create dir at currPath
          setCurrPopup('new')
        }}>
          <img 
          className='explorer-button-icon'
          src='https://www.svgrepo.com/show/447010/folder-add.svg' 
          alt='new' />
        </button>

				<input 
        type='text' 
        className='explorer-path'
        ref={inputRef}
        defaultValue={currPath}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (inputRef.current.value.at(0) !== '/') inputRef.current.value = '/' + inputRef.current.value
            if (inputRef.current.value.at(-1) !== '/') inputRef.current.value = inputRef.current.value + '/'
            setCurrPath(inputRef.current.value)
          }
        }} />
      </div>

      <div className='explorer-content'>
        {
          fileList?.map((file) => {
            return (
              <FileListItem
              key={file.name}
              inputRef={inputRef}
              file={file}
              currPath={currPath}
              onClickDelete={(path) => { FileManager.deleteAtPath(path); setDeletedFlag(!deletedFlag) }}
              setCurrPath={setCurrPath} />
            )
          }) || <span style={{marginLeft: "10px"}}>{currPath} is not an existing directory.</span>
        }
      </div>

			{
				operation === 'save'?
				<div className='explorer-savebar'>

					<div className='savebar-info'>
						Saving to file: {
							validateFilename(saveFilename)?
							<span className='savebar-valid-filename'>{currPath}{saveFilename}.txt</span> :
							<span style={{color: 'red'}}>Invalid filename</span>
						}
					</div>

					<div className='explorer-savebar-bottom'>
						<div className='savebar-input-container'>
							<input 
							spellCheck={false}
							className='explorer-savebar-input' 
							type='text' 
							value={saveFilename}
							onChange={(e) => setSaveFilename(e.target.value)}
							placeholder='File name' />{presetExt}
						</div>

						<button
						className='explorer-dialog-button'
						onClick={() => {
							// call onDone with current path
							onDone(currPath + saveFilename + presetExt);
						}}>Save</button>

						<button
						className='explorer-dialog-button'
						onClick={onCancel}>Cancel</button>
					</div>

				</div> :

        <div className='explorer-savebar'>
          <div className='explorer-savebar-bottom'>
            <button
            className='explorer-dialog-button'
            onClick={onCancel}>Cancel</button>
          </div>
        </div>
			}

    </div>
	);
};

export default ExplorerDialog;