import React from 'react';
import '../styles/Window.css';
import Terminal from './apps/Terminal';
import Notepad from './apps/Notepad';
import Explorer from './apps/Explorer';
import StartMenu from './apps/StartMenu';

const processNameMap = {
	"Terminal": Terminal,
	"Start Menu": StartMenu,
	"Explorer": Explorer,
	"Notepad": Notepad,
}

const Window = ({ isFocused, focus, process, processProps, windowRef, menuRef, size, pos, closeProcess }) => {

	console.log("Window returning with props", processProps)

  return (
    <div 
		ref={windowRef}
		className='window' 
		onMouseDown={focus}
		style={{
			left: pos[0], 
			top: pos[1],
			zIndex: isFocused? 100 : 0}}>

      <div className='window-menubar' ref={menuRef}>

				<div id='window-draggable' >{process.name}</div>

				<div className='window-control'>

					<button 
          onClick={() => windowRef.current.classList.add('minimize')}
          className='window-control-button'>
						<img src="https://www.svgrepo.com/show/361465/divider-horizontal.svg" alt="min" className='window-control-button-img' />
					</button>

					<button 
          onClick={() => closeProcess()}
          className='window-control-button --close-button'>
						<img src="https://www.svgrepo.com/show/499592/close-x.svg" alt="cls" className='window-control-button-img' />
					</button>

				</div>

			</div>

			<div className='window-content' style={{ width: size[0] || 400, height: size[1] || 300}}>
				{React.createElement(processNameMap[process.name], processProps )}
			</div>

    </div>
  );
};

export default Window;