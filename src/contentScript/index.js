import React, { Component } from "react";
import CloseIcon from "material-ui-icons/Close"
import IconButton from "material-ui/IconButton";
import MemoModel from "./model/memo.js";
import Note from "./note.js.jsx";
import {
  fetchInitialMemos,
  requestSaveMemos,
  fetchConfig,
  saveConfig,
} from "./../actions.js";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memos: [],
      width: 0,
      height: 0,
      config: {
        isCanvasDisplayed: false,
      },
    };
    this.handleResize = this.handleResize.bind(this);
  }

  fetchConfig(cb) {
    chrome.runtime.sendMessage(
      fetchConfig(),
      ({ payload }) => {
        this.setState({config: payload.config});

        if ((typeof cb) === "function") {
          cb();
        }
      }
    )
  }

  fetchMemos() {
    chrome.runtime.sendMessage(
      fetchInitialMemos(),
      ({ payload }) => this.setState({
        memos: payload.memos.map((e) => new MemoModel(e)),
      })
    );
  }

  subscribeConfigChange() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (changes.config) {
        this.setState((s) => ({
          ...s,
          config: changes.config.newValue,
        }))
      }
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.fetchConfig(() => this.fetchMemos());
    this.subscribeConfigChange();
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

  onClickClose(e) {
    e.stopPropagation();

    this.setState(
      (s) => ({
        ...s,
        config: {
          ...s.config,
          isCanvasDisplayed: false,
        },
      }),
      () => chrome.runtime.sendMessage(
        saveConfig({config: this.state.config}),
        (response) => console.log(response)
      )
    )
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
    const { memos, width, height, config } = this.state;
    if (!config.isCanvasDisplayed) return null;

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
    const handleCloseIconClick = (e) => this.onClickClose(e);

    return (
      <div
        style={style}
        onClick={handleClick}
        >
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
          }}
          >
          <IconButton
            color="secondary"
            onClick={handleCloseIconClick}
            >
            <CloseIcon/>
          </IconButton>
        </div>
        {memos.map((e, i) => this.renderMemo(e, i))}
      </div>
    );
  }
}
