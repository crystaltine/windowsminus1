import React from 'react';
import './styles/App.css';
import Desktop from './components/Desktop';
import TaskBar from './components/TaskBar';

import { initFS } from './fs_starting'

const initProcesses = [
  {
    name: "Start Menu",
  },
  {
    name: "Explorer",
    width: "550px",
    height: "450px",
  },
  {
    name: "Terminal",
    width: "500px",
    height: "400px",
  },
  {
    name: "Notepad",
    width: "400px",
    height: "300px",
  },
]

export const OSCtx = React.createContext();

function OS() {

  // Processes
  const [currentFocus, setCurrentFocus] = React.useState(null);
  const [processes, setProcesses] = React.useState(
    initProcesses.map((process) => {
      return {
        info: process,
        props: null,
        refs: [],
      }
    })
  );
  class ProcessManager {

    static getProcessByID = (processTypeIdx) => { return processes[processTypeIdx] }

    static getProcesses = () => { return processes }

    static closeProcess = (processIndex, refIndex) => {
      setProcesses((prev) => {
        let newProcesses = prev.slice();
        newProcesses[processIndex].refs.splice(refIndex, 1);
        console.log(`Closed process, newProcesses[${processIndex}].refs is ${JSON.stringify(newProcesses[processIndex].refs)}`)
        return newProcesses;
      })
    }

    static openProcess = (i, processProps = null) => {
      console.log("Opening process " + i + " with props " + JSON.stringify(processProps))
      setProcesses(() => {
        let newProcesses = processes.slice();
        newProcesses[i].props = processProps;
        
        // For now, only one instance of each process, however props can be changed ^
        if (!newProcesses[i].refs[0])
          newProcesses[i].refs[0] = [React.createRef(), React.createRef()]

        return newProcesses;
      })

      // Set focus to new window
      setCurrentFocus([i, 0]);
    }
  }

  // FS
  const [sysFiles, setSysFiles] = React.useState(JSON.parse(localStorage.getItem('sysFiles')) || initFS);
  class FileManager {

    /**
     * Gets list of files/dirs at path, returns null if not found
     * @param {String} path specify path in format of / if top level, /dir1/dir2 if nested
     * @returns {Object} object of files/dirs at path, format {name, ext, path, timestamp}, null if not found
     * 
     */
    static listFilesAt = (path) => {
      if (path === '/') return FileManager.genFileList(sysFiles.contents);
      return FileManager.genFileList(FileManager.getContainerOf(path)?.contents);
    }

    /**
     * 
     * @param {String} path specify path in format of /dir1/dir2/, not allowed to be top level
     * @returns {Object} reference to the object (dir) that contains the specified path, null if not found
     */
    static getContainerOf(path) {
      if (path === '/') return null;

      let curr = sysFiles;
      const pathArr = path.split('/').slice(1, -1);
      
      for (let dir of pathArr) {
        if (!curr.contents[dir]) return null;
        curr = curr.contents[dir];
      }

      return curr
    }

    static genFileList(dirContents) {

      if (!dirContents || typeof dirContents === 'string') return null;

      return Object.keys(dirContents).map((file) => {
        return {
          name: file,
          type: dirContents[file].type,
          path: dirContents[file].path,
          timestamp: dirContents[file].timestamp,
          // Pass by ref not contents
        }
      })
    }

    /**
     * Gets file object/dir from path, returns null if not found
     * @param {String} path specify path in format of / if top level, /dir1/dir2 if nested
     * @returns {Object} file object such as { path: '/dir1/dir2/file.ext', type: 'txt', timestamp: 123456789, contents: 'file contents' }
     * 
    */
    static getAtPath = (path) => {
      if (!path || path.at(0) !== '/') return null;
      if (path === '/') return sysFiles;

      let curr = sysFiles;
      const pathSplit = path.split('/');
      const pathArr = pathSplit.slice(1, -1);
      const fname = pathSplit[pathSplit.length - 1];
      
      for (let dir of pathArr) {
        if (!curr.contents[dir]) return null;
        curr = curr.contents[dir];
      }

      console.log("Getting fname " + fname + " from " + JSON.stringify(curr.contents))
      console.log("Returning " + JSON.stringify(curr?.contents[fname]))
      return curr?.contents[fname] || null;
    }

    /**
     * Modifies value of existing file or creates new file if it doesn't exist
     * @param {Boolean} isDir true if making a dir, false if file
     * @param {String} path specify path in format of / if top level, /dir1/dir2 if nested - creates entry named after last part of path
     * @param {String | null} content string content, null if new/empty file, otherwise don't (it wont do anything)
     */
    static writeAtPath = (path, isDir, content = null) => {
      console.log("Writing file at path " + path + " with content " + content)
      setSysFiles((prev) => {
        // Go to path

        let curr = prev;

        const pathSplit = path.split('/')
        const dirPath = pathSplit.slice(1, -1)
        const fname = pathSplit[pathSplit.length - 1]

        for (let dir of dirPath) {
          if (!curr.contents[dir]) {
            curr.contents[dir] = {
              path: `${curr.path}/${dir}`, 
              type: 'dir',
              timestamp: Date.now(), 
              contents: {}
            }
            curr = curr.contents[dir]
            break;
          }
          
          curr = curr.contents[dir]
        }

        // Add or write file
        curr.contents[fname] = {
          path, 
          type: isDir? 'dir' : fname.split('.').slice(-1)[0],
          timestamp: Date.now(),
          contents: isDir? {} : content }

        // Save to local storage
        localStorage.setItem('sysFiles', JSON.stringify(prev));
        return prev;

      })
    }

    static deleteAtPath = (path) => {
      setSysFiles((prev) => {
        let curr = prev;

        const pathSplit = path.split('/')
        const dirPath = pathSplit.slice(1, -1)
        const fname = pathSplit[pathSplit.length - 1]

        for (let dir of dirPath) {
          if (!curr.contents[dir]) return prev;
          curr = curr.contents[dir]
        }

        // Delete file
        delete curr.contents[fname];

        // Save to local storage
        localStorage.setItem('sysFiles', JSON.stringify(prev));
        return prev;
      })
    }

    static renameAtPath = (path, newName) => {
      setSysFiles((prev) => {
        let curr = prev;

        const pathSplit = path.split('/')
        const dirPath = pathSplit.slice(1, -1)
        const fname = pathSplit[pathSplit.length - 1]

        for (let dir of dirPath) {
          if (!curr.contents[dir]) return prev;
          curr = curr.contents[dir]
        }

        // Rename file
        console.log("Renameatpath: curr.contents[fname] is " + JSON.stringify(curr.contents[fname]))
        curr.contents[newName] = curr.contents[fname];
        this.recursiveUpdatePaths(path, newName)
        delete curr.contents[fname];

        // Save to local storage
        localStorage.setItem('sysFiles', JSON.stringify(prev));
        return prev;
      })
    }

    /**
     * Given a path assumed to be a directory and a new name for that directory, 
     * recursively updates the 'path' property of all files/dirs in that directory
     * with the new name given to the directory
     * @param {String} path path of directory to update, i.e. /usr/oldname
     * @param {String} newName new name of directory, i.e. newname
     * Will update everything inside /usr/oldname (location.contents) to have a path that begins with /usr/newname
     */
    static recursiveUpdatePaths = (path, newName) => {
      setSysFiles((prev) => {
        let curr = prev;

        const pathSplit = path.split('/')
        const dirPath = pathSplit.slice(1, -1)
        const fname = pathSplit[pathSplit.length - 1]

        for (let dir of dirPath) {
          if (!curr.contents[dir]) return prev;
          curr = curr.contents[dir]
        }

        console.log("Recursive rename: curr is " + JSON.stringify(curr))
        // Curr is currently the directory to be renamed
      })
    }
  }

  return (
    <div className="App">
      <OSCtx.Provider value={{ sysFiles, FileManager, ProcessManager }}>
        <Desktop currentFocus={currentFocus} setCurrentFocus={setCurrentFocus} />
        <TaskBar setCurrentFocus={setCurrentFocus} />
      </OSCtx.Provider>
    </div>
  );
}

export default OS;
