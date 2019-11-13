import React, {PureComponent, Fragment} from "react";
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import CustomizedDialog from "../customizedDialog/CustomizedDialog";
import Customize from "../../images/Customize.png";
import Typography from "@material-ui/core/Typography";
import Slider from '@material-ui/core/Slider';
import CopySVG from '../../images/Copy.svg';
import {ThemeProvider} from "styled-components";
import themes from "../../settings/themes";
import {themeConfig} from "../../settings";
import {Styled} from './ReferenceLineCellRenderer.style';

const marks = [
    {
        value: 1,
        label: 'Jan',
    },
    {
        value: 2,
        label: 'Feb',
    },
    {
        value: 3,
        label: 'Mar',
    },
    {
        value: 4,
        label: 'Apr',
    },
    {
        value: 5,
        label: 'May',
    },
    {
        value: 6,
        label: 'Jun',
    },
    {
        value: 7,
        label: 'Jul',
    },
    {
        value: 8,
        label: 'Aug',
    },
    {
        value: 9,
        label: 'Sep',
    },
    {
        value: 10,
        label: 'Oct',
    },
    {
        value: 11,
        label: 'Nov',
    },
    {
        value: 12,
        label: 'Dec',
    },
];

class ReferenceLineCellRenderer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isHover: false,
            start: 1,
            end: 12,
        };
        this.theme = themes[themeConfig.normal];
    }

    setHover = hover => event => {
        this.setState({
            isHover: hover
        });
    };

    onCopyClick = () => {
        this.setState({isOpen: true});
    };

    onCancel = () => {
        this.setState({isOpen: false, isHover: false});
    };

    onApply = () => {
        //this.props.node


        this.setState({isOpen: false, isHover: false});
    };

    handleRangeChange = (event, sliders) => {
        this.setState({
            start: sliders[0],
            end: sliders[1]
        });
    };


    render() {
        return (
            <ThemeProvider theme={this.theme}>
                <span style={{position: 'absolute', marginLeft: '23px', left: 0, right: 0, top: 0, bottom: 0}}
                      onMouseEnter={this.setHover(true)}
                      onMouseLeave={this.setHover(false)}>
                    {this.props.value}
                    {this.props.value !== 'Baseline Volume' ?
                        <Fragment>
                            <IconButton style={{position: 'absolute', right: 0}} size={'small'} hidden={!this.state.isHover}
                                        onClick={this.onCopyClick}>
                                <CopyIcon fontSize={'small'}/>
                            </IconButton>
                            <CustomizedDialog onClose={this.onCancel}
                                              open={this.state.isOpen}
                                              img={CopySVG}
                                              hideOverflow={true}
                                              title={'Copy Reference Lines'}
                                              submitText={'APPLY'}
                                              onSubmit={this.onApply}>
                                <div style={{padding: '15px'}}>
                                    <p>
                                        Copy <span style={{color: this.theme.palette.secondary}}>{this.props.value} </span>
                                        to <span style={{color: this.theme.palette.secondary}}>Baseline Volume</span> for
                                    </p>
                                    <Styled.CustomSlider
                                        onChange={this.handleRangeChange}
                                        defaultValue={[1, 12]}
                                        min={1}
                                        max={12}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="range-slider"
                                        marks={marks}
                                    />
                                </div>
                            </CustomizedDialog>
                        </Fragment>
                        : null}
                </span>
            </ThemeProvider>
        );
    }
}

export default ReferenceLineCellRenderer;