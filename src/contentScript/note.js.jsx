import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import KeyboardArrowDownIcon from 'material-ui-icons/KeyboardArrowDown';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import SaveIcon from 'material-ui-icons/save';
import RemoveIcon from 'material-ui-icons/remove';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import classnames from 'classnames';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  card: {
    maxWidth: 400,
  },
  actions: {
    display: 'flex',
  },
  content: {
    textAlign: 'center',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

class Note extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    const isOpen = props.memo.updatedAt ? false : true;
    this.state = {
      isOpen,
      collapseIsOpen: isOpen,
      textField: {
        value: props.memo.text,
      },
    }
  }

  renderTextField() {
    const {isOpen, textField} = this.state;
    const {classes} = this.props;

    const handleTextFieldChange = (e) => {
      const value = e.target.value;
      this.setState((s) => ({
        ...s,
        textField: {
          ...s.textField,
          value,
        }
      }));
    }

    return (
      <CardContent className={classes.content}>
        <TextField
          multiline={true}
          rowsMax="4"
          value={textField.value}
          onChange={handleTextFieldChange}
          className={classes.textField}
          margin="normal"
          placeholder="Write some notes..."
          />
      </CardContent>
    );
  }

  renderCollapseButton() {
    const {isOpen, textField} = this.state;
    const isTextFieldChanged =
          this.props.memo.text !== textField.value;

    const handleClickButton = (e) => {
      if (isTextFieldChanged) {
        this.props.onChangeMemo({text: textField.value});
      }

      if (isOpen) {
        this.setState((s) => ({...s, isOpen: false}));
      } else {
        this.setState((s) => ({...s, isOpen: true}));
      }
    };
    const icon = isTextFieldChanged ?
          <SaveIcon color="primary" /> :
          <ExpandMoreIcon />;

    return (
      <IconButton
        className={
          classnames(this.props.classes.expand, {
            [this.props.classes.expandOpen]: isOpen,
          })
        }
        onClick={handleClickButton}
        >
        {icon}
      </IconButton>
    );
  }

  renderMemoText() {
    const {classes, memo} = this.props;
    if (this.state.collapseIsOpen) return null;

    return (
      <CardContent
        className={classes.content}
        >
        <Typography component="p">
          {memo.text}
        </Typography>
      </CardContent>
    );
  }

  render() {
    const {classes, memo} = this.props;
    const handleCollapseClosed =
          () => this.setState((s) => ({...s, collapseIsOpen: false}));
    const handleCollapseOpened =
          () => this.setState((s) => ({...s, collapseIsOpen: true}));
    const handleClickRemoveButton =
          (e) => this.props.onRemoveMemo();

    const date = memo.updatedAt || memo.createdAt;

    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Card className={classes.card} >
          <CardActions
            className={classes.actions}
            disableActionSpacing
            >
            <IconButton onClick={handleClickRemoveButton} >
              <RemoveIcon color="error" />
            </IconButton>
            <Typography
              variant="caption"
              align="right"
              >
              {(new Date(date)).toLocaleString()}
            </Typography>
            {this.renderCollapseButton()}
          </CardActions>
          <Collapse
            in={this.state.isOpen}
            timeout="auto"
            unmountOnExit={true}
            onEntered={handleCollapseOpened}
            onExited={handleCollapseClosed}
            >
            {this.renderTextField()}
          </Collapse>
          {this.renderMemoText()}
        </Card>
      </div>
    )
  }
}

export default withStyles(styles)(Note);
