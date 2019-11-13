import React from 'react';
import {withStyles} from '@material-ui/core/styles/index';
import Button from '@material-ui/core/Button/index';
import Dialog from '@material-ui/core/Dialog/index';
import MuiDialogTitle from '@material-ui/core/DialogTitle/index';
import {Styled} from './CustomizedDialog.style';
import MuiDialogActions from '@material-ui/core/DialogActions/index';
import IconButton from '@material-ui/core/IconButton/index';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography/index';


const CustomizedDialog = props => {
    const {title, img, submitText, closeText, onSubmit, onClose, open, hideSubmit, hideOverflow, children} = props;

    const closeTxt = (closeText) ? closeText : 'CANCEL';
    const submitTxt = (submitText) ? submitText : 'SUBMIT';
    const overflow = (hideOverflow) ? 'hidden' : 'scroll';

    return (
        <Dialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open} maxWidth={false}
                style={{maxHeight: '100vh', overflow: overflow}}>
            <Styled.DialogTitle id="customized-dialog-title" onClose={onClose}>
                <Styled.TitleRow>
                    <img src={img} height={'38px'} width={'38px'}/>
                    <Typography className='title-text'>{title}</Typography>
                </Styled.TitleRow>
            </Styled.DialogTitle>
            <div style={{overflow: overflow}}>
                {children}
            </div>
            <Styled.DialogActions>
                {onClose ?
                    <Styled.CloseButton onClick={onClose}>
                        {closeTxt}
                    </Styled.CloseButton>
                    : null}
                {onSubmit && hideSubmit !== true ?
                    <Styled.SubmitButton variant='contained' onClick={onSubmit} color="primary">
                        {submitTxt}
                    </Styled.SubmitButton>
                    : null}
            </Styled.DialogActions>
        </Dialog>
    );
};

export default CustomizedDialog;