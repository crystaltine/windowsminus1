import React from 'react';
import '../styles/Desktop.css';
import Window from './Window';
import { OSCtx } from '../OS';

const processOpenLocs = [
  [580, 450],
  [200, 100],
  [300, 200],
  [400, 300],
]

const Desktop = ({ currentFocus, setCurrentFocus }) => {

  const { ProcessManager } = React.useContext(OSCtx);

  React.useEffect(() => {
    
    // Add event listeners to each window for dragging
    ProcessManager.getProcesses().forEach((process, i) => {
      process.refs.forEach((ref, j) => {
        ref[1].current.addEventListener('mousedown', (e) => {
          let pos = [e.clientX, e.clientY];
          let windowPos = [ref[0].current.offsetLeft, ref[0].current.offsetTop];
          let mouseMove = (e) => {
            let newPos = [windowPos[0] + e.clientX - pos[0], windowPos[1] + e.clientY - pos[1]];

            // Restrict window movement to desktop
            if (newPos[0] < 0) newPos[0] = 0;
            if (newPos[1] < 0) newPos[1] = 0;

            // Taskbar is 50px
            if (newPos[0] + ref[0].current.offsetWidth > window.innerWidth) newPos[0] = window.innerWidth - ref[0].current.offsetWidth;
            if (newPos[1] + ref[0].current.offsetHeight > window.innerHeight - 50) newPos[1] = window.innerHeight - 50 - ref[0].current.offsetHeight;

            ref[0].current.style.left = newPos[0] + 'px';
            ref[0].current.style.top = newPos[1] + 'px';
          }
          let mouseUp = (e) => {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
          }
          window.addEventListener('mousemove', mouseMove);
          window.addEventListener('mouseup', mouseUp);
        });
      })
    })
  }, [ProcessManager]);

  return (
    <div className='desktop'>
      {ProcessManager.getProcesses().map((process, i) => {
        return (
          process.refs.map((ref, j) => {
            console.log("Mapping process " + i + j + " with props " + JSON.stringify(process.props))
            return (
            <Window 
            process={process.info}
            processProps={process.props}
            closeProcess={() => ProcessManager.closeProcess(i, j)}
            windowRef={ref[0]}
            menuRef={ref[1]}
            isFocused={currentFocus && currentFocus[0] === i && currentFocus[1] === j}
            focus={() => setCurrentFocus([i, j])}
            pos={processOpenLocs[i]}
            size={[process.info.width, process.info.height]} />
            )
          })
        )
      })}
    </div>
	);
};

export default Desktop;