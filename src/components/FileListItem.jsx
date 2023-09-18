import React from 'react';
import '../styles/Explorer.css';
import { OSCtx } from '../OS';

const fileIcons = {
  'txt': require('../assets/file.png'),
  'dir': require('../assets/folder.png'),
}

const timestampToReadable = (timestamp) => {
	const date = new Date(timestamp);
	return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

const FileListItem = ({ inputRef, file, currPath, setCurrPath, onClickRename, onClickDelete}) => {

  const { ProcessManager, FileManager } = React.useContext(OSCtx);

  return (
    <div 
		className='explorer-entry'
		onClick={() => {
			if (file.type === 'dir') {
				setCurrPath(currPath + file.name + '/')
				inputRef.current.value = currPath + file.name + '/'
			}
			else if (file.type === 'txt') {
				// Open in text editor
				ProcessManager.openProcess(3, { initPath: file.path })
			}}}>

			<img src={fileIcons[file.type]} alt={file.type} className='explorer-file-icon' />
			<div className='explorer-file-name'>{file.name}</div>			

			<div className='file-list-right'>
				<span className='explorer-file-timestamp'>{timestampToReadable(file.timestamp)}</span>
				{/*<button
				onClick={(e) => {
					e.stopPropagation();
					onClickRename(file.path)
				}}
				className='file-list-button'>
					<img src='https://www.svgrepo.com/show/333314/rename.svg' alt='rename' className='file-list-button-icon' />
				</button>*/}

				<button
				onClick={(e) => {
					e.stopPropagation();
					onClickDelete(file.path)
				}}
				className='file-list-button'>
					<img src='https://www.svgrepo.com/show/533007/trash.svg' alt='rename' className='file-list-button-icon' />
				</button>
			</div>

		</div>
	)
};

export default FileListItem;