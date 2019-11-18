import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { AgGridReact } from 'ag-grid-react';
import { connect } from 'react-redux';
import * as actions from '../../redux/reporting/actions';
import '../ag_grid_style.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import loader from '../../images/loader.gif';
import LayoutContentWrapper from '../../components/utility/layoutWrapper'
import ContentHolder from "../../components/utility/contentHolder";
import LayoutContent from '../../components/utility/layoutContent';
import { Col, Row } from "antd";
import appActions from '../../redux/app/actions';
import $ from 'jquery';

class ReportView extends Component {
  constructor(props) {
    super(props);
    this.applyFilter = this.applyFilter.bind(this);
    this.backClick = this.backClick.bind(this); 
    this.rowGroupToggle = this.rowGroupToggle.bind(this);
    this.valueToggle = this.valueToggle.bind(this);
    this.colGroupToggle = this.colGroupToggle.bind(this);
    this.createViewList = this.createViewList.bind(this);
    this.filterViewList = this.filterViewList.bind(this);
  }

  state = {
    reportList: [],
    click: false,
    columnDefs: [],
    rowData: [],
    myPrivateViewList: [],
    systemViewList: [],
    myPrivateViewType: true,
    systemViewType: true,
    viewList: [],
    filteredViewList: [],
    // reportList: [
    //   { 'id': 0, "viewName": "CBR Reort", "isPublic": true },
    //   { 'id': 1, "viewName": "CBR Reort1", "isPublic": false }
    // ],
    gridviewState:
      // "[{"colId":"data_type","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"country","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"category","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"subcategory","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"sku_grouping","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"sku","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"total_cases","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"gross_sales","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"gtn","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"netsales","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"margin","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"margin_percentage","hide":true,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":null,"rowGroupIndex":null}]
      // [{ "colState": "[{\"colId\":\"ag-Grid-AutoColumn-sku\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"data_type\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"country\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"category\",\"hide\":true,\"aggFunc\":\"count\",\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"subcategory\",\"hide\":true,\"aggFunc\":\"count\",\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"sku_grouping\",\"hide\":true,\"aggFunc\":\"count\",\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"sku\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":0},{\"colId\":\"total_cases\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"gross_sales\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,pIndex\":null},{\"colId\":\"gtn\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"netsales\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"margin\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"margin_percentage\",\"hide\":true,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null}]" },
      [{ "colState": "[{\"colId\":\"ag-Grid-AutoColumn-sku\",\"hide\":false,\"aggFunc\":null,\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"data_type\",\"hide\":false,\"aggFunc\":\"count\",\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"country\",\"hide\":false,\"aggFunc\":\"count\",\"width\":200,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null}]" },
      { "groupState": "[{\"groupId\":\"0\",\"open\":false}]" },
      { "sortState": "[{\"colId\":\"data_type\",\"sort\":\"asc\"}]" },
      { "filterState": "{}" },
      { "isPivotMode": true }],

    gridOptions:
    {
      defaultColDef: {
        sortable: true,
        resizable: true,
        enableValue: true,
        //autoHeight: true,
        // lockPinned: true,
        hide: true,
        floatCell: true,
        editable: false,
        enablePivot: true,
        //enableRowGroup: true
      },
      autoGroupColumnDef: {
        enableValue: false,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        cellRenderer: 'agGroupCellRenderer',
        cellClass: 'grouprow',
        cellStyle: { color: "#3c8dbc" },
        rowStyle: { color: "#3c8dbc" },
        cellRendererParams: {
          suppressCount: true,
          checkbox: false,
          footerValueGetter: '"Total"',
          // innerRenderer:this.customCellRendererFunc

        },
        filterValueGetter: function (params) {
          var colGettingGrouped = params.colDef.showRowGroup;
          var valueForOtherCol = params.api.getValue(colGettingGrouped.toString(), params.node);
          return valueForOtherCol;
        },
      },
      sideBar: true,
      pivotMode: true,
      suppressContextMenu: true,
      enableBrowserTooltips: false,
      groupIncludeTotalFooter: true,
      groupSuppressBlankHeader: true,
      rowDragManaged: true,
      accentedSort: true,
      suppressSetColumnStateEvents: true,
      floatingFilter: false,
      rowGroupPanelShow: 'always',
      pivotPanelShow: 'always',
      pivotColumnGroupTotals: 'before',
      pivotRowTotals: 'before',
      singleClickEdit: true,
      enterMovesDownAfterEdit: true,
      enterMovesDown: true,
      groupDefaultExpanded: '999',
      multiSortKey: 'ctrl',
      animateRows: true,
      enableRangeSelection: true,
      rowSelection: "multiple",
      rowDeselection: true,
      quickFilterText: null,
      groupSelectsChildren: false,
      pagination: true,
      suppressRowClickSelection: true,
      groupMultiAutoColumn: true,
      groupHideOpenParents: false,
      suppressMakeColumnVisibleAfterUnGroup: true
    },

    error: null,
    recordCount: 0,
    //displayChoosedView: "My List Views",
    displayChoosedView: "",
    viewName: "",
    search: "",
    isPublic: true,
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    // console.log(nextProps.gridviewstructure)
    this.setState({
      reportList: nextProps.gridviewstate,
    })
    this.defColumns(nextProps.gridviewstructure).then(result => this.setState({
      columnDefs: result,
      reportList: nextProps.gridviewstate
    }))
    this.setState({rowData: nextProps.gridviewdata.length > 0 ? JSON.parse(nextProps.gridviewdata) : []})

  }
  async componentDidMount() {
    try {
      this.setState({ click: false });
      await this.props.getGridViewState(0);
      this.setState({
        reportList:  this.props.gridviewstate,
      })
    } catch (error) {
      console.log(error);
    }
  }

  generateDefColumns = (objData) => {
    const colData = objData;//await apiCall('gridViewStructure').then(res => { return res });// Get Column Structure data from API
    const uniqueAttCat = [];// Unique Attribute Category
    var childOfHeader = [];// Header child
    var categoryChild = [];// Category Child
    let coldef = []; // Column Definition
    let attributeCategory = []; // Final Column with header
    var gridId, headername, headerDataType, attributeCategoryName, fileldName,
      attributeCategoryId, Isfilter, lowercaseFieldName;
    //const uniqueAtt = colData.filter((x, i, a) => a.indexOf(x) == i)
    const map = new Map();
    for (const item of colData) {
      if (!map.has(item.attribute_category_id)) {
        map.set(item.attribute_category_id, true);    // set any value to Map
        uniqueAttCat.push({
          AttributeCategoryID: item.attribute_category_id,
          AttributeCategory: item.attribute_category
        });
      }
    }
    var agfilter = "agSetColumnFilter"
    for (var j = 0; j < uniqueAttCat.length; j++) {
      childOfHeader = [];
      attributeCategory = [];
      var filterColDatavalues = colData.filter(item => item.attribute_category_id == uniqueAttCat[j].AttributeCategoryID)
      childOfHeader = filterColDatavalues
      for (var l = 0; l < childOfHeader.length; l++) {
        categoryChild = childOfHeader[l];
        attributeCategoryName = categoryChild["attribute_category"];
        attributeCategoryId = categoryChild["attribute_category_id"];
        headername = categoryChild["attribute_display_name"];
        fileldName = categoryChild["attribute_name"];
        headerDataType = categoryChild["data_type"];
        gridId = categoryChild["id"];
        Isfilter = categoryChild["is_filter"] == 'true' ? true : false;
        if (headerDataType == "Date") {
          agfilter = "agDateColumnFilter";
        } else if (headerDataType == "Amount" || headerDataType == "Numeric") {
          agfilter = "agNumberColumnFilter";
        }

        //lowercaseFieldName = headername;
        if (headerDataType == "Date") {

          attributeCategory.push({
            headerDataType: headerDataType,
            headerName: headername,
            field: fileldName,
            suppressFilter: Isfilter,
            enableRowGroup: true,
            //cellClass: 'ag-grid-cellClass',
            cellStyle: function (params) {
              if (params.column.aggFunc == 'Count' && typeof params.value == 'object') {
                return { textAlign: "right" };
              } else {
                return { textAlign: "center" };
              }
            },
            allowedAggFuncs: ['min', 'max', 'count'],
            //, comparator: this.dateComparator
            filter: agfilter,
            filterParams: {
              filterOptions: [
                "equals",
                "greaterThan",
                "lessThan",
                "notEqual",
                "inRange",
                {
                  displayKey: "BlankDate",
                  displayName: "Blank Date",
                  suppressAndOrCondition: true,
                  hideFilterInput: true,
                  test: function (filterValue, cellValue) {
                    if (cellValue == null || cellValue == "")
                      return true;
                  }
                },

              ],

              comparator: function (filterLocalDateAtMidnight, cellValue) {

                if (cellValue == null) return -1;
                var dateParts = cellValue.split("/");

                var cellDate = new Date(Number(dateParts[2]), Number(dateParts[0] - 1), Number(dateParts[1]));

                if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
                  return 0
                }

                if (cellDate < filterLocalDateAtMidnight) {
                  return -1;
                }

                if (cellDate > filterLocalDateAtMidnight) {
                  return 1;
                }
              },
              browserDatePicker: true
            }

          })
        }
        else if (headerDataType == "Amount") {

          attributeCategory.push({
            headerDataType: headerDataType,
            headerName: headername,
            field: fileldName,
            suppressFilter: Isfilter,
            filter: agfilter,
            enableRowGroup: false,
            // cellClass: 'ag-grid-cellNumber',
            cellStyle: { textAlign: "right" },
            allowedAggFuncs: ['sum', 'min', 'max', 'count', 'avg'],
            //, valueFormatter: this.amountValueFormatter
            comparator: function (number1, number2) {
              if (number1 != null) {
                if (typeof number1 == "object") {
                  number1 = number1.val;
                }

              }
              if (number2 != null) {
                if (typeof number2 == "object") {
                  number2 = number2.val;
                }
              }

              if (number1 === null && number2 === null) {
                return 0;
              }
              if (number1 === null) {
                return -1;
              }
              if (number2 === null) {
                return 1;
              }
              return number1 - number2;
            },
            filterParams: {

              filterOptions: [
                {
                  displayKey: "equals",
                  displayName: "Equals",
                  test: function (filterValue, cellValue) {
                    if (filterValue == cellValue)
                      return true;
                  }
                },
                "notEqual",
                'lessThan',
                "lessThanOrEqual",
                "greaterThan",
                "greaterThanOrEqual",
                "inRange"
              ]
              ,
            }

          })

        }
        else if (headerDataType == "decimal") {

          attributeCategory.push({
            headerDataType: headerDataType,
            headerName: headername,
            field: fileldName,
            suppressFilter: Isfilter,
            filter: agfilter,
            enableRowGroup: false,
            cellClass: 'ag-grid-cellNumber',
            cellStyle: { textAlign: "right" },
            allowedAggFuncs: ['sum', 'min', 'max', 'count', 'avg']
            //, valueFormatter: this.percentValueFormatter
            , comparator: function (number1, number2) {
              if (number1 != null) {
                if (typeof number1 == "object") {
                  number1 = number1.val;
                }
              }
              if (number2 != null) {
                if (typeof number2 == "object") {
                  number2 = number2.val;
                }
              }

              if (number1 === null && number2 === null) {
                return 0;
              }
              if (number1 === null) {
                return -1;
              }
              if (number2 === null) {
                return 1;
              }
              return number1 - number2;
            },
            filterParams: {

              filterOptions: [
                {
                  displayKey: "equals",
                  displayName: "Equals",
                  test: function (filterValue, cellValue) {
                    if (filterValue == cellValue)
                      return true;
                  }
                },
                "notEqual",
                'lessThan',
                "lessThanOrEqual",
                "greaterThan",
                "greaterThanOrEqual",
                "inRange"
              ]
              ,
            }
          })

        }
        else if (headerDataType == "Id" || headerDataType == "Key" || headerDataType == "int") {

          attributeCategory.push({
            headerDataType: headerDataType,
            headerName: headername,
            field: fileldName,
            suppressFilter: Isfilter,
            filter: agfilter,
            enableRowGroup: true,
            // cellClass: 'ag-grid-cellClass',
            allowedAggFuncs: ['count'],
            //cellStyle: { textAlign: "right" },
            // , valueFormatter: this.valueFormatter
            comparator: function (number1, number2) {
              if (number1 != null) {
                if (typeof number1 == "object") {
                  number1 = number1.val;
                }
              }
              if (number2 != null) {
                if (typeof number2 == "object") {
                  number2 = number2.val;
                }
              }
              if (number1 === null && number2 === null) {
                return 0;
              }
              if (number1 === null) {
                return -1;
              }
              if (number2 === null) {
                return 1;
              }
              return number1 - number2;
            }
          })
        } else
          attributeCategory.push({
            headerDataType: headerDataType,
            headerName: headername,
            field: fileldName,
            suppressFilter: Isfilter,
            filter: agfilter,
            enableRowGroup: true,
            //cellClass: 'ag-grid-cellClass',
            allowedAggFuncs: ['count'],
            // cellStyle: function (params) {
            //   if (params.column.aggFunc == 'Count' && typeof params.value == 'object') {
            //     return { textAlign: "right" };
            //   } else {
            //     return { textAlign: "left" };
            //   }
            // }
          })
      }
      coldef.push({ headerName: attributeCategoryName, id: attributeCategoryId, children: attributeCategory })
    }
    //  this.setState({
    //   columnDefs: coldef
    // })
    return coldef;
  }
  async defColumns(colData) { // Get and generate the Ag-grid column structure
    //debugger;
    //const colData = await apiCall('GetGridViewStructure').then(res => { return res });// Get Column Structure data from API
    return this.generateDefColumns(colData);
  }
  async getGridData(gridData) { // Get Ag-grid data from API
    // debugger;
    //  const gridData = await apiCall('GetGridViewData?data=' + param).then(res => { return res });// Get Ag-Grid data from API
    return JSON.parse(gridData);
  }
  async applyFilter() {
    if (this.state.recordCount == 1) {
      var data = this.state.gridviewState

      this.state.gridOptions.columnApi.setColumnState((JSON.parse(data[0].colState)));
      this.state.gridOptions.columnApi.setColumnGroupState(JSON.parse(data[1].groupState));
      this.state.gridOptions.api.setSortModel(JSON.parse(data[2].sortState));
      this.state.gridOptions.api.setFilterModel(JSON.parse(data[3].filterState));
      this.state.gridOptions.columnApi.setPivotMode(data[4].isPivotMode)
    }

    this.showLoader();
    console.log(this.state.recordCount)
    const respGridData = await this.getGridData(this.state.recordCount);
    this.state.gridOptions.api.setRowData(respGridData)
    this.hideLoader();
  }
  async backClick(){
    this.setState({ click: false });
  }
  showLoader() {
    let eGridDiv = document.querySelector('#updateProgress');
    eGridDiv.style.display = "";
  }

  hideLoader() {
    let eGridDiv = document.querySelector('#updateProgress');
    eGridDiv.style.display = "none";
  }

  aggridcss() {

    $('.ag-pivot-mode-panel').each(function () {
      $(this).insertAfter($('.ag-column-drop-values'));
    })
    $('.ag-column-drop-pivot').each(function () {// ag-column-drop-values
      $(this).insertAfter($(this).parent().find('.ag-column-select-panel'));
    })

    $('#colGroupToggle').each(function () {
      $(this).insertAfter($('.ag-column-select-panel'));
    })
    $('#rowGroupToggle').each(function () {
      $(this).insertAfter($('.ag-column-drop-pivot')[1]);
    })
    $('#valueToggle').each(function () {
      $(this).insertAfter($('.ag-column-drop-row-group')[1]);
    })
  }

  valueToggle() {
    let x = $('#spnvalueToggle')
    $('.ag-column-panel > .ag-column-drop-values').toggle();
    if (x[0].className.indexOf('ag-icon-tree-closed') > 0) {
      $('#spnvalueToggle').addClass('ag-icon-tree-open')
      $('#spnvalueToggle').removeClass('ag-icon-tree-closed')
      $('#valueToggle').removeClass('border-bottom')
    } else {
      $('#spnvalueToggle').removeClass('ag-icon-tree-open')
      $('#spnvalueToggle').addClass('ag-icon-tree-closed')
      $('#valueToggle').addClass('border-bottom')

    }

  }

  rowGroupToggle() {
    let x = $('#spnrowGroupToggle')
    $('.ag-column-panel > .ag-column-drop-row-group').toggle();
    if (x[0].className.indexOf('ag-icon-tree-closed') > 0) {
      $('#spnrowGroupToggle').addClass('ag-icon-tree-open')
      $('#spnrowGroupToggle').removeClass('ag-icon-tree-closed')
      $('#rowGroupToggle').removeClass('border-bottom')
    } else {
      $('#spnrowGroupToggle').removeClass('ag-icon-tree-open')
      $('#spnrowGroupToggle').addClass('ag-icon-tree-closed')
      $('#rowGroupToggle').addClass('border-bottom')

    }
  }

  colGroupToggle() {
    let x = $('#spncolGroupToggle')
    $('.ag-column-panel > .ag-column-drop-pivot').toggle();
    if (x[0].className.indexOf('ag-icon-tree-closed') > 0) {
      $('#spncolGroupToggle').addClass('ag-icon-tree-open')
      $('#spncolGroupToggle').removeClass('ag-icon-tree-closed')
      $('#colGroupToggle').removeClass('border-bottom')
    } else {
      $('#spncolGroupToggle').removeClass('ag-icon-tree-open')
      $('#spncolGroupToggle').addClass('ag-icon-tree-closed')
      $('#colGroupToggle').addClass('border-bottom')

    }
  }

  createViewList() {
    this.state.myPrivateViewList = [];
    this.state.systemViewList = [];
    for (var i = 0; i < this.state.reportList.length; i++) {
      if (this.state.reportList[i].isPublic == true) {
        this.state.systemViewList.push({ id: this.state.reportList[i].view_id, viewName: this.state.reportList[i].view_name, isPublic: this.state.reportList[i].is_public })
      } else {
        this.state.myPrivateViewList.push({ id: this.state.reportList[i].view_id, viewName: this.state.reportList[i].view_name, isPublic: this.state.reportList[i].is_public })
      }
    }

  }

  filterViewList() {
    this.state.filteredViewList = [];
    if (this.state.myPrivateViewType == true) {
      if (this.state.myPrivateViewList.length > 0) {
        this.state.filteredViewList.push({ viewType: 'Private', viewList: this.state.myPrivateViewList })
      }
    }
    if (this.state.systemViewType == true) {
      if (this.state.systemViewList.length > 0) {
        this.state.filteredViewList.push({ viewType: 'System', viewList: this.state.systemViewList })
      }
    }

    this.state.viewList = this.state.filteredViewList;
  }

  restoreState = (e) => {
    this.setState({ recordCount: e.id, displayChoosedView: e.viewName });
  }

  getDefaultState = (e) => {
    this.setState({ recordCount: 0, displayChoosedView: "My List Views" });
  }

  applySearch = (e) => {
    this.setState({ search: e.target.value });
    if (this.state.search == "") {
      this.setState({ filteredViewList: this.state.viewList })
      return;
    }
    //this.filteredViewList = this.viewList.filter(element => element.reportList.filter(element => element.viewName.indexOf(this.search)>=0))
    this.state.viewList.forEach(element => element.viewList.forEach(element1 => element1.viewName.indexOf(this.state.search) >= 0))
    this.state.filteredViewList = this.state.viewList.map((i) => {
      return {
        viewType: i.viewType,
        viewList: i.viewList.filter((x) => x.viewName.indexOf(this.state.search) >= 0)
      }
    })
    this.setState({ filteredViewList: this.state.filteredViewList })

  }

  onPublicSelectionChange = (e) => {
    e.isPublic = !e.isPublic
    //alert(e.isPublic)
  }

  onViewChange = (e) => {
    this.setState({ isPublic: !this.state.isPublic });
  }

  onPrivateViewChange = (e) => {
    this.setState({ myPrivateViewType: !this.state.myPrivateViewType });
    this.filterViewList();
  }

  onSystemViewChange = (e) => {
    this.setState({ systemViewType: !this.state.systemViewType });
    this.filterViewList();
  }

  renderList(child) {
    return child.map((view, index) => {
      return (<tr key={index} className="saved-list-view-row"><td className="saved-list-view-option"><a onClick={() => this.restoreState(view)} style={{ cursor: "pointer" }}>{view.viewName}</a></td><td> </td><td className="saved-list-view-actions"><span id="save" className="fa fa-save tag-icon-xs m-r-sm disabled" style={{ marginRight: "7px" }}></span><a tooltip="Update View" id="update" className="fa fa-save tag-icon-xs" style={{ display: "none", cursor: "pointer", marginRight: "7px" }}></a><a tooltip="Delete View" className="fa fa-trash tag-icon-xs" style={{ cursor: "pointer" }} ></a></td></tr>)
    })
  }
  renderType() {
    return this.state.filteredViewList.map((view, index) => {
      return (<tr key={index}><td><table><tbody><tr><td className="dv-padding view-type-group-label">{view.viewType}</td></tr><tr><td style={{ paddingLeft: "25px" }}><table><tbody>{this.renderList(view.viewList)}</tbody></table></td></tr></tbody></table></td></tr>)
    })
  }
  renderReportList() {
    return this.state.reportList.map((rp, index) => {
      return (<table><tbody><tr key={index}><td> <a onClick={() => this.reportClick(rp.view_id)}>{rp.view_name}</a> </td></tr></tbody></table>)

    })

  }
  reportClick = (id) => {
    this.setState({ click: true });

    this.setState({ recordCount: id, displayChoosedView: this.state.reportList.filter(x => x.view_id == id)[0].view_name });
    this.showLoader();
    //this.aggridcss();
    this.props.getGridViewStructure(id);
    this.props.getGridViewState(id);
    this.props.getGridViewData(this.state.recordCount);
    this.hideLoader();

  }


  render() {
    this.createViewList();
    this.filterViewList();
    this.aggridcss();
    return (
      <div>
        <div id="updateProgress" style={{ display: "none" }} role="status" aria-hidden="true">
          <div className="updateProgress">
            <img id="imgUpdateProgress" title="Loading ..." src={loader} alt="Loading ..."
              style={{ padding: "10px", position: "fixed", top: "30%", left: "45%" }}></img>
          </div>
        </div>
        {this.state.click == false ?

          <LayoutContentWrapper>
            <LayoutContent>
              <h1>Report List</h1>
              <Row>
                <Col>
                  <ContentHolder>
                    {this.renderReportList()}
                  </ContentHolder>
                </Col> </Row>
            </LayoutContent>
          </LayoutContentWrapper> :

          <div>

            <div id="disableBackground" style={{ display: "none" }} role="status" aria-hidden="true">
              <div className="disableBackground">
              </div>
            </div>
            <div
              className="box ag-theme-balham"
              style={{
                height: '100vh'
              }}
            >
              <div className="gridcontainer row header" layout-xs="column" layout="row" style={{ backgroundColor: '#e3f0f5', height: "auto" }}>
                <div id="filtercontainer" style={{ marginTop: "67px" }} className="filtercontainer ui-inputtext">
                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <div className="grid-filter">
                        {/* <ul id="ember264" style={{ marginBottom: "0px" }} className="list-inline remove-style ember-view"
                      style={{ marginBottom: "0px" }}>
                      <div>
                        <li className="payment-date"> */}
                        <div style={{ display: "flex" }}>
                          <div style={{ float: "right" }}>
                            <div id="ChoosedView" style={{ paddingLeft: "3px" }}>
                              <div id="dvChoosedView" type="text"
                                className="dvChoosedView ember-power-select-trigger saved-list-view-trigger"
                                data-toggle="dropdown">
                                <span id="spChoosedView"
                                  className="ember-power-select-selected-item">{this.state.displayChoosedView}</span>
                                <span style={{ lineHeight: "24px", marginLeft: "1.3em" }}
                                  className="fa fa-caret-down fa-lg pull-right"></span>
                              </div>

                              <div style={{ left: "0" }} id="savedview"
                                className="savedview dropdown-menu saved-list-view-dropdown ember-power-select-dropdown">
                                <div style={{ float: "left" }}>
                                  <div className="dv-padding">
                                    <input
                                      type="text" placeholder="Save current view as..." maxLength="60"
                                      id="ember8811"
                                      className="txtview form-control ember-power-select-search-input ember-text-field ember-view" />
                                   
                                    <button style={{ height: "34px", marginLeft: "10px" }} className="btn btn-primary" >
                                      <i className="fa fa-save"></i> Add</button>
                                  </div>
                                  <table>
                                    <tbody>
                                      <tr className="saved-list-view-row">
                                        <td className="dv-padding saved-list-view-option" colSpan="2">
                                          <a style={{ cursor: "pointer" }}
                                            onClick={this.getDefaultState}>Clear Columns and
                                                  Filters </a>
                                        </td>
                                      </tr>
                                      <tr className="view-type">
                                        <td colSpan="2" style={{ paddingRight: "15px" }}>
                                          <span
                                            tooltip="Views you have created. Only you may select and edit the View."
                                          >Private</span>
                                          <input checked={this.state.myPrivateViewType} onChange={this.onPrivateViewChange} type="checkbox"
                                          />
                                          <span
                                            tooltip="Views you have created and made Public. Only you may select and edit the View."
                                          >System</span>
                                          <input checked={this.state.systemViewType} onChange={this.onSystemViewChange} type="checkbox"
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="dv-padding" style={{ paddingTop: "5px", paddingBottom: "7px" }}>
                                          <input style={{ float: "left" }}
                                            onChange={this.applySearch}
                                            value={this.state.search}
                                            type="text" placeholder="Search..."
                                            maxLength="60" id="ember8811"
                                            className="txtview form-control ember-power-select-search-input ember-text-field ember-view" />
                                          <span style={{ float: "left" }}
                                            tooltip="Search for a View by its full or partial name."

                                            className="help-tipHeader my-viewtip"></span>
                                        </td>
                                      </tr>

                                      {this.renderType()}
                                    </tbody></table>
                                </div>

                              </div></div>
                          </div>

                          <div style={{ marginLeft: "10px" }}>
                            <button
                              onClick={this.applyFilter}
                              //tooltip="Click apply to update the available data based on Type, Date, and Period selections."
                              id="btnapply"
                              type="button"
                              className="btn btn-primary px-4 button-round-corners button-width"
                            >Apply  </button>
                            <button
                              onClick={this.backClick}
                             // tooltip="Click back to update the available data based on Type, Date, and Period selections."
                              id="btnback"
                              type="button"
                              className="btn btn-primary px-4 button-round-corners button-width back-button"
                            >Back  </button>
                            <div style={{ display: "none" }}>

                              <div id="valueToggle">
                                <span id="spnvalueToggle" className="ag-icon ag-icon-tree-open toggle" onClick={this.valueToggle} ></span>
                                <span className="ag-icon ag-icon-aggregation ag-column-drop-icon spnag-column-drop-icon"></span>
                                <span className="ag-column-drop-title" >Values</span>
                              </div>

                              <div id="rowGroupToggle">
                                <span id="spnrowGroupToggle" className="ag-icon ag-icon-tree-open toggle" onClick={this.rowGroupToggle} ></span>
                                <span className="ag-icon ag-icon-group ag-column-drop-icon spnag-column-drop-icon"></span>
                                <span className="ag-column-drop-title" >Row Groups</span>
                              </div>

                              <div id="colGroupToggle">
                                <span id="spncolGroupToggle" className="ag-icon ag-icon-tree-open toggle" onClick={this.colGroupToggle} ></span>
                                <span className="ag-icon ag-icon-pivot ag-column-drop-icon spnag-column-drop-icon"></span>
                                <span className="ag-column-drop-title" >Column Labels</span>
                              </div>

                            </div>
                          </div>

                        </div>
                        {/* 
                        </li>
                      </div>
                    </ul> */}
                      </div></div>
                  </div>

                </div >
              </div >
              <AgGridReact
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData}
                gridOptions={this.state.gridOptions}
              >
              </AgGridReact>
            </div >
          </div >
        }
      </div>
    )

  }
}

const mapStateToProps = state => {
  //state["App"].LINK_CLICK =true

  // this.setState({click: state["App"].linkClick});
  return {
    gridviewstructure: state.GridView.gridviewstructure,
    gridviewstate: state.GridView.gridviewstate,
    gridviewdata: state.GridView.gridviewdata
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    getGridViewStructure: actions.GetGridViewStructureAction,
    getGridViewState: actions.GetGridViewStateAction,
    getGridViewData: actions.GetGridViewDataAction
  }, dispatch);
};
export const backClick = () => { this.setState({ click: false }); }
export default connect(mapStateToProps, mapDispatchToProps)(ReportView)