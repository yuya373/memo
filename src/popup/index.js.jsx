import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from "material-ui/List";
import Switch from "material-ui/Switch";
import ModeEdit from "material-ui-icons/ModeEdit";
import {
  fetchConfig,
  saveConfig,
} from "./../actions.js";

const styles = (theme) => ({
  root: {
    minWidth: 260,
    backgroundColor: theme.palette.background.paper,
  },
});

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {},
    };
  }

  componentDidMount() {
    chrome.runtime.sendMessage(
      fetchConfig(),
      ({ payload }) => this.setState({
        config: payload.config,
      })
    );
  }

  onChangeCanvas() {
    this.setState(
      (s) => ({
        ...s,
        config: {
          ...s.config,
          isCanvasDisplayed: !s.config.isCanvasDisplayed,
        },
      }),
      () => chrome.runtime.sendMessage(
        saveConfig({config: this.state.config}),
        (response) => console.log(response)
      )
    );
  }

  render() {
    const { classes } = this.props;
    const { isCanvasDisplayed } = this.state.config;
    const handleChangeCanvas = () => this.onChangeCanvas();

    return (
      <div className={classes.root} >
        <List subheader={<ListSubheader>Memo</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <ModeEdit />
            </ListItemIcon>
            <ListItemText primary="Display canvas" />
            <ListItemSecondaryAction>
              <Switch
                onChange={handleChangeCanvas}
                checked={isCanvasDisplayed || false}
                />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(Index);
