import React from 'react';
import '../../styles/Explorer.css';
import { OSCtx } from '../../OS';
import FileListItem from '../FileListItem';
import Popup from '../Popup';

const Explorer = () => {

  const { FileManager, ProcessManager, sysFiles } = React.useContext(OSCtx);
  const [currPath, setCurrPath] = React.useState('/C:/');

  const inputRef = React.useRef(null);

  const fileList = FileManager.listFilesAt(currPath);
  const [deletedFlag, setDeletedFlag] = React.useState(false); // used to force re-render of FileListItems after deletion

  const [currPopup, setCurrPopup] = React.useState(null); // null | 'rename' | 'new'
  const [renaming, setRenaming] = React.useState(null); // holds path of file being renamed

  return (
    <div className='explorer-container'>

      <Popup
      visible={currPopup === 'rename' || currPopup === 'new'}
      title={currPopup === 'rename'? 'Rename File' : 'New Folder'}
      input={true}

      content={currPopup === 'rename'? 
        `Rename ${renaming?.split('/').at(-1)} to:` :
        `Create new folder at ${currPath} called:`}

      button1={(value) => {
        if (currPopup === 'rename') FileManager.renameAtPath(renaming, value)
        else if (currPopup === 'new') FileManager.writeAtPath(currPath + value, true)
        setCurrPopup(null)}}

      button1Text={currPopup === 'rename'? 'Rename' : 'Create'}
      button2={() => setCurrPopup(null)}
      button2Text='Cancel' />

			<div className='explorer-header'>

        <button 
        className='explorer-button'
        onClick={() => {
          setCurrPath('/');
          inputRef.current.value = '/'}}>
          <img src='https://www.svgrepo.com/show/533507/house-floor.svg' alt='home' className='explorer-button-icon' />
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
              onClickRename={(path) => { setCurrPopup('rename'); setRenaming(path) }}
              onClickDelete={(path) => { FileManager.deleteAtPath(path); setDeletedFlag(!deletedFlag) }}
              setCurrPath={setCurrPath} />
            )
          }) || <span style={{marginLeft: "10px"}}>{currPath} is not an existing directory.</span>
        }
      </div>

    </div>
	);
};

export default Explorer;