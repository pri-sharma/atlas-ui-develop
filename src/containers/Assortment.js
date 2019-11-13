import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import NewsForm from '../components/Forms/NewsForm';
import LayoutContentWrapper from '../components/utility/layoutWrapper'
import {connect} from 'react-redux';
import * as actions from '../redux/assortment/actions';
import MaterialTable from "material-table";
import Add from '@material-ui/icons/Add';
import AssortmentCard from "../components/AssortmentCard";
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import {IconButton} from "@material-ui/core";
import {Button} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Typography from "@material-ui/core/Typography";

const cardStyle = {
    width: '100%',
    height: '230px',
    marginBottom: '50px',
    marginTop: '32px',
    position: 'relative',
    backgroundColor: 'transparent'
};

const smallCardStyle = {
    marginBottom: '32px',
    marginTop: '0px',
    backgroundColor: 'transparent',

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

class Assortment extends Component {
    constructor(props){
        super(props);
        this.columns = [

            {
                title: 'Customer Hierarchy Name',
                field: 'title',
                filtering: false,
                render: rowData => <Link to={{pathname: '/direct_trade_assortment', state: {kind: 'POST'}}} style={{color: '#4286F4'}}>
                                        {rowData.cust_hier_node.description}
                                    </Link>
            },
            {
                title: 'Customer Hierarchy Level',
                field: 'id',
                filtering: false
            },
            {
                title: 'My Customers',
                field: 'cust_hier_node.id',
            },
        ]
    }
    componentDidMount() {
        this.props.getAssortments();
    }

    state = {
        current: '',
        btnClicked: false,
        kind: '',
        all_assortments: [],
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
        console.log(nextProps.assortments)
        this.setState({
            all_assortments: nextProps.assortments
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
            <LayoutContentWrapper >
                <Grid container style={cardStyle}>
                    <Grid container direction="row" spacing={4}>
                        <Grid item xs={6} style={smallCardStyle}>
                            <Typography variant="h5" gutterBottom style={{color:'white'}}>
                                Recently Updated
                            </Typography>
                            <AssortmentCard
                                style={{height:'220px'}}
                                columns={dummyKPIs}
                                rows={dummyData}
                            />
                        </Grid>
                        <Grid item xs={6} style={smallCardStyle}>
                            <Typography variant="h5" gutterBottom style={{color:'white'}}>
                                Expiring Validity Dates
                            </Typography>
                            <AssortmentCard
                                style={{height:'220px'}}
                                columns={dummyKPIs}
                                rows={dummyData}
                            />
                        </Grid>
                    </Grid>

                    </Grid>

                        {this.state.all_assortments.length > 0 ?
                            <MaterialTable
                                components={{
                                    Toolbar: props => (
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Grid container justify={'flex-start'}>
                                                    <Input id={'tp_search_input'} onKeyUp={this.onSearch} endAdornment={
                                                        <InputAdornment position={'end'}>
                                                            <IconButton onClick={this.onSearch}>
                                                                <SearchIcon fontSize={'small'} style={{paddingRight: 3}}/>
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }/>
                                                    <Button style={{color: 'rgba(61,69,81)'}}>
                                                        <Add fontSize={'small'} fontWeight={'500'}/>
                                                        <Link to={{pathname: '/promoevent/new', state: {kind: 'POST'}}} style={{color: 'rgba(61,69,81)'}}>
                                                            Create Listing
                                                        </Link>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )
                                }}
                                options={{selection: true, headerStyle: { backgroundColor: '#EEE', color: "#000", fontSize:15}, pageSize: 10,
                                    rowStyle:(rowData, index) => {if (index % 2) {return {backgroundColor: "#f2f2f2"}}
                                }}}
                                style={{width:'100%'}}
                                editable={{
                              onRowAdd: newData =>
                                new Promise((resolve, reject) => {
                                  setTimeout(() => {
                                    {
                                      const data = this.state.data;
                                      data.push(newData);
                                      this.setState({ data }, () => resolve());
                                    }
                                    resolve()
                                  }, 1000)
                                }),}} rowSelection={rowSelection} rowKey='id' pagination={{ pageSize:10, defaultValue:10, default:10}} onRow={(record, rowIndex) => {

                        }} data={this.state.all_assortments} columns={this.columns} rowKey={record => record.id}/> : 'No Assortments'}

                        {this.state.showAssignment ? <NewsForm type={"PATCH"} id={this.state.id} title={this.state.title}
                                                               body={this.state.body} sales_org={this.state.sales_org}
                                                               handleUpdate={this.handleUpdate} handleDelete={this.handleDelete}
                                                               handleClose={this.handleClick}/> : null}
                        {this.state.btnClicked && this.state.kind === 'Add News' ? <NewsForm kind={'POST'} handleClose={this.handleClose}/> : null}

            </LayoutContentWrapper>

        )
    }
}

const mapStateToProps = state => {
    return {
        assortments: state.Assortments.assortments,
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getAssortments: actions.getAssortmentsAction,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Assortment)