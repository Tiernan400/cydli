# Cydli
A fast, good-looking chess GUI
- - - -
## To Build Manually
### Prerequisites:
  - PyOxidizer - Available at https://gregoryszorc.com/docs/pyoxidizer/main/pyoxidizer_getting_started.html
  - NodeJS - Available at https://nodejs.org/en/download
  - Electron Packager - Available through the command line once NodeJS is installed - `npm install -g electron-packager`
### Steps
 - Open the `engine/run-engine` folder in the `cydli` directory, and run the following command: `pyoxidizer build`
 - In the main `cydli` directory, run `npm install` in the terminal
 - Finally, run the `build.bat` file in the `cydli` directory.

The built binaries will be written to a new subfolder in `cydli`. Inside this folder will be the `cydli.exe` executable.
This will be a build for the Windows platform. The `build.bat` file can be modified for other builds. Find the documentation on `electron-packager` here: https://github.com/electron/electron-packager#usage
