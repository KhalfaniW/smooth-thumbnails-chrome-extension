import React, {useState, useEffect} from 'react';
import logo from '../../assets/img/logo.svg';

import Switch from 'react-switch';
import Toggle from 'react-toggle';
import useLocalStorageState from 'use-local-storage-state';

import './Popup.css';

const Popup = () => {
  const [enabled, setEnabled] = useState(true);
  const [shouldBlurThumbnails, setShouldBlurThubnail] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(
      ['SHOULD_BLUR_THUMBNAILS'],
      function ({SHOULD_BLUR_THUMBNAILS}) {
        setShouldBlurThubnail(SHOULD_BLUR_THUMBNAILS);
      },
    );
  }, []);
  function toggleAppAndUpdateState(blurEnabledState) {
    chrome.storage.sync.set({
      SHOULD_BLUR_THUMBNAILS: blurEnabledState,
    });

    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        files: [blurEnabledState ? 'app/reenableApp.js' : 'app/removeApp.js'],
      });
    });

    if (blurEnabledState)
      chrome.runtime.sendMessage({thumbnailBlurEnabled: blurEnabledState});
    setShouldBlurThubnail(blurEnabledState);
  }

  return (
    <div className="App">
      <label>
        <span>Toggle Thumbnail Blur</span>
        <br />
        <Switch checked={shouldBlurThumbnails} onChange={toggleAppAndUpdateState} />
      </label>
    </div>
  );
};

export default Popup;
