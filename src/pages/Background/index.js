function runScripts(scripts) {
    console.log('script ran',scripts);
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    if (tabs[0])
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        files: scripts,
      });
  });
}

function runScriptIfEnabled() {
  chrome.storage.sync.get(
    ['SHOULD_BLUR_THUMBNAILS'],
    function ({SHOULD_BLUR_THUMBNAILS}) {
      const notInitialized = typeof SHOULD_BLUR_THUMBNAILS === 'undefined';
      if (notInitialized) {
        chrome.storage.sync.set({
          SHOULD_BLUR_THUMBNAILS: true,
        });
      }
    },
  );

  chrome.storage.sync.get(
    ['SHOULD_BLUR_THUMBNAILS'],
    function ({SHOULD_BLUR_THUMBNAILS}) {
      console.log({SHOULD_BLUR_THUMBNAILS});
      if (SHOULD_BLUR_THUMBNAILS) {
        runScripts(['app/index.js']);
      }
    },
  );
}
chrome.runtime.onInstalled.addListener(function () {
  console.log('INITAL');
  chrome.storage.sync.set({
    SHOULD_BLUR_THUMBNAILS: true,
  });
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  runScriptIfEnabled();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log('loaded', tab.active);
  if (tab.active) {
    runScriptIfEnabled();
  }
});
chrome.runtime.onMessage.addListener(function (
  {thumbnailBlurEnabled},
  sender,
  sendResponse,
) {
  if (thumbnailBlurEnabled) {
    runScripts(['app/index.js']);
  }
});
