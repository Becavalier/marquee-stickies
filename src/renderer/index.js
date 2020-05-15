const { ipcRenderer } = require('electron')
const fs = require('fs');

const UPDATE_INTERVAL = 5000;
const DEFAULT_INDEX = 0;

let globalContent, counter = 1;

// stylesheets;
const styles = document.createElement('style');
styles.innerText = `html, body {font-family: sans-serif; background-color: transparent;}#app {color: #24292e;font-weight: bold;font-size: 19px;}`;
document.head.appendChild(styles);
document.title = 'Marquee Stickies';

ipcRenderer.on('asynchronous-message', (event, configFilePath) => {
  if (!globalContent) {
    // loading source file.
    globalContent = fs.readFileSync(configFilePath.filePaths[DEFAULT_INDEX], {
      encoding: 'utf8', 
      flag: 'r',
    }).split('\n').map(s => {
      return s.trim().replace('  ', '\n')
    });
    if (Array.isArray(globalContent) && globalContent.length > 0) {
      const el = document.querySelector('#app');
      el.innerText = globalContent[DEFAULT_INDEX];
      setInterval(() => {
        el.innerText = globalContent[counter++];
        if (counter === globalContent.length) {
          counter = 0;
        }
      }, UPDATE_INTERVAL);
    }
  }
});

