import React, { Component } from "react";
import MemoModel from "./model/memo.js";
import Note from "./note.js.jsx";
import {
  fetchInitialMemos,
  requestSaveMemos,
} from "./../actions.js";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memos: [],
      width: 0,
      height: 0,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    chrome.runtime.sendMessage(
      fetchInitialMemos(),
      ({ payload }) => {
        this.setState({
          memos: payload.memos.map((e) => new MemoModel(e)),
        });
      },
    );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize() {
    const {
      width,
      height,
    } = document.documentElement.getBoundingClientRect();

    this.setState((s) => ({
      ...s,
      width,
      height,
    }));
  }

  saveMemos() {
    const { memos } = this.state;
    chrome.runtime.sendMessage(
      requestSaveMemos({ memos }),
      (response) => console.log("updateBackground", response),
    );
  }

  updateMemo(index, { text }) {
    this.setState(
      (s) => ({
        ...s,
        memos: s.memos.map((e, i) => {
          if (i === index) {
            e.update({ text });
          }
          return e;
        }),
      }),
      () => this.saveMemos(),
    );
  }

  removeMemo(index) {
    this.setState(
      (s) => ({
        ...s,
        memos: s.memos.filter((e, i) => i !== index),
      }),
      () => this.saveMemos(),
    );
  }

  onClick(e) {
    const {
      /* clientX, clientY, screenX, screenY, */
      pageX, pageY,
    } = e;
    // console.log(
    //   // "clientX", clientX,
    //   // "clientY", clientY,
    //   // "screenX", screenX,
    //   // "screenY", screenY,
    //   "pageX", pageX,
    //   "pageY", pageY
    // );

    const memo = new MemoModel({ x: pageX, y: pageY });
    this.setState(
      (s) => ({
        ...s,
        memos: s.memos.concat([memo]),
      }),
      () => this.saveMemos(),
    );
  }

  renderMemo(e, i) {
    const style = {
      position: "absolute",
      top: e.y,
      left: e.x,
      backgroundColor: "transparent",
      width: 300,
    };

    const handleChange =
          (props) => this.updateMemo(i, props);
    const handleRemove =
          () => this.removeMemo(i);
    return (
      <div
        key={i}
        style={style}
        >
        <Note
          memo={e}
          onChangeMemo={handleChange}
          onRemoveMemo={handleRemove}
          />
      </div>
    );
  }

  render() {
    const { memos, width, height } = this.state;
    const style = {
      position: "absolute",
      top: 0,
      left: 0,
      width,
      height,
      backgroundColor: "rgba(1, 1, 1, 0.65)",
      zIndex: Number.MAX_SAFE_INTEGER,
    };

    const handleClick = (e) => this.onClick(e);

    return (
      <div
        style={style}
        onClick={handleClick}
        >
        {memos.map((e, i) => this.renderMemo(e, i))}
      </div>
    );
  }
}
