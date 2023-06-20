const remote = require('@electron/remote')
const { Menu, MenuItem } = remote
const ipcRenderer = require('electron').ipcRenderer
const fs = require('fs')
const { Module } = require('module')
const path = require('path')
const file = {
    get: function(f) {
        return fs.readFileSync(f)
    },
    put: function(f, c, o) {
        return fs.writeFileSync(f, c, o)
    }
}
const PATH = {
    settings: path.join(__dirname, 'settings.json')
}
const win = {
    window: remote.getCurrentWindow(),
    updateMaxBtn: (el) => {
        var btn = el?el:document.getElementById('btn-max');
        if (win.window.isMaximized()) {
            btn.classList = 'maximise unmaximised';
        } else if (btn) {
            btn.classList = 'maximise maximised';
        }
    },
    minimise: () => {
        ipcRenderer.send('minimise')
    },
    maximise: (btn) => {
        ipcRenderer.send('maximise')
    },
    close: () => {
        ipcRenderer.send('close')
    }
}
const e = {
    id: 'engine',
    activate: function(from, type, w) {
        if (type == 'worker') {
            var worker = new Worker(w)
            worker.onerror = function (e) {
                alert('Error initialising engine. Please ensure that the location specified to the engine is valid. You can configure it under the settings tab.')
            };
        } else if (type == 'shell') {
            if (!ipcRenderer) {
                console.error('ipcRenderer is not defined. Could not open terminal process.')
            } else {
                ipcRenderer.send('activate-engine', from, w)
            }
        }
    },
    deactivate: function() {
        ipcRenderer.send('deactivate-engine')
    },
    onoutput: (from, output) => console.log(from, output)
}
ipcRenderer.on('engine-output', (event, from, output) => {
    e.onoutput(from, output)
})
window.addEventListener('load', () => {
    win.updateMaxBtn()
})
win.window.on('maximize', () => win.updateMaxBtn())
win.window.on('unmaximize', () => win.updateMaxBtn())