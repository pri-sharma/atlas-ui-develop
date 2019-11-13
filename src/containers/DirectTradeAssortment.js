import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import LayoutContentWrapper from '../components/utility/layoutWrapper'
import {connect} from 'react-redux';
import * as actions from '../redux/news/actions';
import FiltersContainer from "./Filters/FiltersContainer";
import Paper from "@material-ui/core/Paper";
import AssortmentGrid from "../components/AssortmentGrid";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
}));

const collapseButtonStyle = {
    borderRadius: '42%',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translate(-50%, 50%)',
    backgroundColor: 'rgba(237,248,253, 0.8)',
    borderColor: 'rgba(237,248,253, 0.8)',
    minWidth: 'unset',
    width: '2.5rem',
    padding: 0,
};

const cardStyle = {
    width: '100%',
    overflow: 'unset',
    height: '220px',
    marginBottom: '32px',
    marginTop: '32px',
    backgroundColor: 'rgba(252,252,252, 0.8)',
    position: 'relative',
    boxShadow: '0px 4px 9px rgba(0, 0, 0, 0.16)',
};

const smallCardStyle = {
    width: '50%',
    height: '100%',
    marginBottom: '32px',
    marginTop: '0px',
    backgroundColor: 'rgba(252,252,252, 0.8)',
    position: 'relative',
    display: 'inline-block'
};

const titlefontStyle = {
    fontFamily: 'Roboto',
    fontSize: '18px',
    fontWeight: '500',
    marginTop: '0.795%',
    marginLeft: '1.59%'
};

const inputLabelStyle = {
    fontFamily: 'Roboto',
    fontSize: '12px',
    color: 'rgba(0,0,0,1)',
    fontWeight: 'normal',
    lineHeight: '122.69%',

};

const buttonStyle = {
    fontWeight: '500',
    fontSize: '12px',
    lineHeight: '14px',
    marginLeft: '73.7%',
    marginTop: '5.7%',
    color: 'rgba(29,161,218, 0.8)',
    position: 'static'

};

const style = {
    'smallCardStyle': smallCardStyle, 'titlefontStyle': titlefontStyle,
    'inputLabelStyle': inputLabelStyle, 'buttonStyle': buttonStyle
};

const dummyKPIs = ['Volume(Cs)', 'Net Sales', 'GTN[%]', 'Margin[%]'];

const dummyData = [
    {title: '2018 [FY]', 'Volume(Cs)': '4 000k', 'Net Sales': '46 000k', 'GTN[%]': '31.0', 'Margin[%]': '64.0'},
    {title: '2019 [FY]', 'Volume(Cs)': '4 400k', 'Net Sales': '50 000k', 'GTN[%]': '33.1', 'Margin[%]': '62.3'},
    {title: 'SLE vs Budget', 'Volume(Cs)': '-10%', 'Net Sales': '-12%', 'GTN[%]': '+2.1', 'Margin[%]': '-2.2'},
    {title: '2019 vs 2018 [FY]', 'Volume(Cs)': '+10%', 'Net Sales': '+8.7%', 'GTN[%]': '+2.1', 'Margin[%]': '-1.7'}
];

class DirectTradeAssortment extends Component {
    constructor(props){
        super(props);
        this.columns = [

            {
                title: 'Customer Hierarchy Name',
                field: 'title',
                filtering: false,
                render: rowData => <a>{rowData.title}</a>
            },
            {
                title: 'Customer Hierarchy Level',
                field: 'id',
                filtering: false
            },
            {
                title: 'My Customers',
                field: 'sales_org.description',
            },
        ]
    }
    componentDidMount() {
        this.props.getNews();
    }

    state = {
        current: '',
        btnClicked: false,
        kind: '',
        all_news: [],
        title: '',
        body: '',
        sales_org: '',
        selectedRowKeys: []
    }

    handleBtnClick = (e) => {
        this.setState({
            btnClicked: !this.state.btnClicked,
            kind: e.target.innerText
        })
    };

    handleClick = (news='') => {
      this.setState({
          showAssignment: !this.state.showAssignment,
          title: news.title,
          body: news.body,
          id: news.id,
          sales_org: news.sales_org
      })
    };

    handleDelete = (assignment) => {

        this.props.deleteAssignment(assignment);

        this.setState({
            showAssignment: false,
            current: '',
            btnClicked: false
        })
    };

    handleUpdate = (assignment) => {
        this.props.updateAssignment(assignment);
    };

    handleClose = () => {
        this.setState({
            btnClicked: false,
            showAssignment: this.state.showAssignment
        })
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps.news)
        this.setState({
            all_news: nextProps.news
        })
    }

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    render(){
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            selections: [
                {
                    key: 'all-data',
                    text: 'Select All Data',
                    onSelect: () => {
                        this.setState({
                            selectedRowKeys: [...Array(46).keys()], // 0...45
                        });
                    },
                },]
        };
        return(
            <LayoutContentWrapper style={{height: '100%'}}>
                {/*<BSPEventIDSelection/>*/}
                <FiltersContainer/>
                <Paper style={{width: '100%', height: '80vh'}}>
                    <AssortmentGrid/>
                </Paper>
            </LayoutContentWrapper>

        )
    }
}

const mapStateToProps = state => {
    return {
        news: state.News.news,
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getNews: actions.getNewsAction,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DirectTradeAssortment)