### Minimal simulation/ripoff of Microsoft Windows, including:

+ Windows (as in the things you can open and close not the OS)
+ A terminal with a few commands
+ Simple text editor, used to write and read files
+ File system and file explorer

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

### Things I wanted to add but didn't have time for:
+ Renaming files - recursively updating paths took too long and I just decided to not include it
+ cd, ls, cat, etc. commands to the terminal
+ Opening multiple windows at a time
+ Maybe a lock screen and a login system?
+ Right click menus, options, etc.
+ Other apps like clock, calculator, settings, etc.

### Technology & Dependencies:
+ ReactJS 18.2 for appearance and JS for handling all the logic 
    - (No Typescript (oops), Tailwind, etc.)
+ npm gh-pages for deployment

I don’t feel like there is a need for a backend server here since 1. I don’t really want to keep one running and 2. Using Javascript on the client side is enough for the functionality I need.

No other non-base packages used.
