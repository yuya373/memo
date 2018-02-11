import {
  FETCH_INITIAL_MEMOS,
  SEND_INITIAL_MEMOS,
  REQUEST_SAVE_MEMOS,
  SAVE_MEMOS_SUCCESS,
  SAVE_MEMOS_FAILED,
} from './types.js';

export function fetchInitialMemos() {
  return {
    type: FETCH_INITIAL_MEMOS,
  }
}

export function sendInitialMemos({memos}) {
  return {
    type: SEND_INITIAL_MEMOS,
    payload: {
      memos,
    },
  };
}

export function requestSaveMemos({memos}) {
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

export function saveMemosFailed({error}) {
  return {
    type: SAVE_MEMOS_FAILED,
    error,
  };
}
