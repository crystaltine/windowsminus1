import React from 'react';
import '../styles/TaskBar.css';
import { OSCtx } from '../OS';

const icons = {
	"Terminal": require('../assets/terminal.png'),
	"Start Menu": require('../assets/icons8-windows-11-144.png'),
	"Explorer": require('../assets/folder.png'),
	"Notepad": require('../assets/notepad.png'),
}

const TaskBar = ({ setCurrentFocus }) => {

	const [time, setTime] = React.useState(new Date())

	// rerender every second
	React.useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);
		return () => clearInterval(interval); // cleanup
	}, []);

	const { ProcessManager } = React.useContext(OSCtx);

  return (
    <div className='taskbar'>
      {ProcessManager.getProcesses().map((item, i) => {
				return (
					<div 
					className={`taskbar-item ${item.refs.length > 0? '--open' : ''}`} 
					key={i} 
					onClick={() => {
						// If program is already open, focus on it
						if (item.refs.length > 0) {

							// Just one open window allowed per app for now
							const iRefCurrent = item.refs[0][0].current;

							if (
								iRefCurrent?.style.display === 'none' ||
								iRefCurrent?.classList.contains('minimize')) {
								// Set window to visible if it's minimized
								iRefCurrent.classList.remove('minimize');
								setCurrentFocus([i, 0]);
								iRefCurrent.focus();
							} else {
								// Minimize window by adding minimize animation class
								item.refs[0][0].current.classList.add('minimize');
							}
							return
						}
						// Otherwise, open it
						ProcessManager.openProcess(i, 'taskbar');
						
						// Set focus to new window
						setCurrentFocus([i, 0]);
					}}>
						<img src={icons[item.info.name]} alt={item.info.name} className='taskbar-item-icon' />
					</div>
				)
			})}

			<div className='taskbar-datetime'>
				<span className='taskbar-time'>{time.toLocaleTimeString()}</span>
				<span className='taskbar-date'>{time.toLocaleDateString()}</span>
			</div>
		</div>
  );
};

export default TaskBar;