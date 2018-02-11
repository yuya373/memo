import {
  REQUEST_SAVE_MEMOS,
  FETCH_INITIAL_MEMOS,
} from './types.js';

import {
  saveMemosSuccess,
  sendInitialMemos as sim,
} from './actions.js';

const storage = chrome.storage.sync;
const getPages = (cb) =>
      storage.get({pages: []}, ({pages}) => cb(pages));
const savePages = (pages, cb) =>
      storage.set({pages}, cb);

const initPage = (memos, url) => {
  return ({
    url,
    memos,
  })
};

const isSamePage = (a, b) => {
  return a.url === b.url;
};

function saveMemos({memos}, sender, sendResponse) {
  const url = sender.url;
  const page = initPage(memos, url);

  getPages((pages) => {
    const oldPageIndex = pages.findIndex((e) => isSamePage(e, page));

    if (oldPageIndex >= 0) {
      pages[oldPageIndex] = page;
    } else {
      pages = pages.concat([page])
    }

    savePages(pages, () => {
      sendResponse(saveMemosSuccess());
    });
  })
}

function sendInitialMemos(sender, sendResponse) {
  const url = sender.url;

  getPages((pages) => {
    const page = pages.find((e) => e.url === url);

    if (page) {
      sendResponse(sim({memos: page.memos}));
    } else {
      sendResponse(sim({memos: []}));
    }
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(
    "request", request,
    "sender", sender
  );
  switch(request.type) {
  case FETCH_INITIAL_MEMOS:
    sendInitialMemos(sender, sendResponse);
    break;
  case REQUEST_SAVE_MEMOS:
    saveMemos(request.payload, sender, sendResponse);
    break;
  }

  // prevent `sendResponse` is garbage collected.
  return true;
});
