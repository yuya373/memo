import {
  FETCH_INITIAL_MEMOS,
  SEND_INITIAL_MEMOS,
  REQUEST_SAVE_MEMOS,
  SAVE_MEMOS_SUCCESS,
  SAVE_MEMOS_FAILED,
  FETCH_CONFIG,
  SEND_CONFIG,
  SAVE_CONFIG,
  SAVE_CONFIG_SUCCESS,
} from "./types.js";

export function fetchConfig() {
  return {
    type: FETCH_CONFIG,
  };
}

export function sendConfig({ config }) {
  return {
    type: SEND_CONFIG,
    payload: {
      config,
    },
  };
}

export function saveConfig({ config }) {
  return {
    type: SAVE_CONFIG,
    payload: {
      config,
    },
  };
}

export function saveConfigSuccess() {
  return {
    type: SAVE_CONFIG_SUCCESS,
  };
}

export function fetchInitialMemos() {
  return {
    type: FETCH_INITIAL_MEMOS,
  };
}

export function sendInitialMemos({ memos }) {
  return {
    type: SEND_INITIAL_MEMOS,
    payload: {
      memos,
    },
  };
}

export function requestSaveMemos({ memos }) {
  return {
    type: REQUEST_SAVE_MEMOS,
    payload: {
      memos,
    },
  };
}

export function saveMemosSuccess() {
  return {
    type: SAVE_MEMOS_SUCCESS,
  };
}

export function saveMemosFailed({ error }) {
  return {
    type: SAVE_MEMOS_FAILED,
    error,
  };
}
