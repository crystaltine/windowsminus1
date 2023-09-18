# Microsoft Windows Ripoff, including:

+ Bad Windows ripoffs (as in the things you can open and close not the OS but its also a ripoff of the OS)
+ Bad Powershell ripoff with a few commands
+ Bad Notepad ripoff, used to write and read files
+ Bad File Explorer ripoff

System Files are stored in localstorage.

### Terminal:
Terminal has very little functionality, since I decided i had spent way to long on this project and didn't want to spend any more time. The terminal has a 'clear' command and a 'notepad' command (which opens the notepad process) - you can also use 'notepad &lt;path&gt;' to open a specific text file, but the **absolute path** must be given. 

### Features and functionality:
+ Open a window and move it around
+ Open multiple windows and move them around
+ The taskbar clock works!
+ Open multiple windows and minimize them/close them, focus different windows, etc.
+ Use notepad write some text, then save it somewhere in the file system
+ Click on a text file in the file explorer to open it in notepad
    - Careful, it will overwrite the currently open file!
    - There are currently no warnings in notepad for overwriting/closing unsaved files.
+ Create a new folder with the icon in the top left of the file explorer (or even in the notepad save as/open dialog)
+ Delete files and folders from either explorer or the notepad dialogs
+ You can set absolute paths for the file explorer using the top bar.
    - Paths are formatted like /folder1/folder2/file.txt or /folder1/
    - The input bar will autocorrect you if a string is improperly formatted.
 
if you open console yes the library of babel is being generated in there every two seconds but whatever

### Things I wanted to add but didn't have time for:
+ Better styling bruh
+ Renaming files - recursively updating paths took too long and I just decided to not include it
+ cd, ls, cat, mkdir, etc. commands to the terminal
+ Opening multiple windows of the same process at a time
+ Maybe a lock screen and a login system?
+ Right click menus, options, etc.
+ Other apps like clock, calculator, settings, etc.

### Technology & Dependencies:
+ ReactJS 18.2 for appearance and JS for handling all the logic
    - webpack, etc. (Everything that comes with cra)
    - (No Typescript (oops), Tailwind, etc.)
+ npm gh-pages (dev dependency) for deployment

No other non-base packages used.
