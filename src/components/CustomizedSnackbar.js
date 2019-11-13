import React, {Component} from 'react';
import {Snackbar} from '@material-ui/core';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {amber, green} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

const variantIcon = {
    success: CheckCircleIcon,
    info: InfoIcon,
    warning: WarningIcon,
    error: ErrorIcon,
};

const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: green[600],
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

function MySnackbarContentWrapper(props) {
  const classes = useStyles1();
  const { className, message, onClose, messageType, ...other } = props;
  const Icon = variantIcon[messageType];

  return (
    <SnackbarContent
      className={clsx(classes[messageType], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  messageType: PropTypes.oneOf(['success', 'info', 'error','warning']).isRequired,
};


class CustomizedSnackbar extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            open:false,
            message: '',
            messageType:'',
        }
    };


    success = (message) => {
        this.handleOpen(message, 'success');
    };

    info = (message) => {
        this.handleOpen(message, 'info');
    };

    error = (message) => {
        this.handleOpen(message, 'error');
    };

    warning = (message)  => {
        this.handleOpen(message, 'warning');
    };

    handleOpen = (message, messageType) => {
        this.setState({open: true, message: message, messageType: messageType} );
    };

    handleClose = () => this.setState({open: false});


    render(){
        if(this.state.messageType !== ''){
            return (
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={this.state.open}
                    onClose={this.handleClose}
                    autoHideDuration={5000}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleClose}
                        messageType={this.state.messageType}
                        message={this.state.message}
                    />
                </Snackbar>
            )
        }
        return null;
    };

}

export default CustomizedSnackbar;
