import {
  REQUEST_SAVE_MEMOS,
  FETCH_INITIAL_MEMOS,
  FETCH_CONFIG,
  SAVE_CONFIG,
} from "./types.js";

import {
  saveMemosSuccess,
  sendInitialMemos as sim,
  sendConfig as sendConfigAction,
  saveConfigSuccess,
} from "./actions.js";

const storage = chrome.storage.sync;
const getPages = (cb) =>
      storage.get({ pages: [] }, ({ pages }) => cb(pages));
const savePages = (pages, cb) =>
      storage.set({ pages }, cb);
const getConfig = (cb) => storage.get(
  { config: { isCanvasDisplayed: false } },
  ({ config }) => cb(config)
);
const saveConfig = (config, cb) => storage.set({ config }, cb);

const initPage = (memos, url) => ({
  url,
  memos,
});

const isSamePage = (a, b) => a.url === b.url;

function saveMemos({ memos }, sender, sendResponse) {
  const url = sender.url;
  const page = initPage(memos, url);

  getPages((pages) => {
    const oldPageIndex = pages.findIndex((e) => isSamePage(e, page));

    if (oldPageIndex >= 0) {
      pages[oldPageIndex] = page;
    } else {
      pages = pages.concat([page]);
    }

    savePages(pages, () => {
      sendResponse(saveMemosSuccess());
    });
  });
}

function sendInitialMemos(sender, sendResponse) {
  const url = sender.url;

  getPages((pages) => {
    const page = pages.find((e) => e.url === url);

    if (page) {
      sendResponse(sim({ memos: page.memos }));
    } else {
      sendResponse(sim({ memos: [] }));
    }
  });
}

function sendConfig(sendResponse) {
  getConfig((config) => {
    sendResponse(sendConfigAction({ config }));
  });
}

function updateConfig({config}, sendResponse) {
  saveConfig(config, () => {
    sendResponse(saveConfigSuccess());
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(
    "request", request,
    "sender", sender,
  );
  switch (request.type) {
  case SAVE_CONFIG:
    updateConfig(request.payload, sendResponse);
    break;
  case FETCH_CONFIG:
    sendConfig(sendResponse);
    break;
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
