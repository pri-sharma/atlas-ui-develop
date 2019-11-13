import React, {Component} from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';


const ExpandCollapseHeader = (props => {
    const {column, displayName, columnApi} = props;
    const columnGroup = (column.parent.children.length === 1 && column.parent.parent !== null) ? column.parent.parent.originalColumnGroup : column.parent.originalColumnGroup;
    const initExpanded =  (columnGroup.level !== 0) ? columnGroup.isExpanded() : false; // columns are expanded for setting width briefly, causing quarter columns to have the wrong expanded state
    const [isExpanded, setExpanded] = React.useState(initExpanded);

    const toggleExpanded = () => {
        const newExpandedState = !columnGroup.isExpanded();
        columnApi.setColumnGroupOpened(columnGroup, newExpandedState);
        setExpanded(newExpandedState);
    };
    const styles = {color: '#606D80', height: '40%', width: '40%', position: 'absolute', right: '0', top: '29%', left: '65%'};

    return (
        <div className='ag-header-group-cell-label'>
            <div className='customHeaderLabel'>{displayName}</div>
            <div className={'customExpandButton'}
                 onClick={toggleExpanded}>
                {isExpanded ?
                    <RemoveIcon style={styles}/> : <AddIcon style={styles}/>
                }
            </div>
        </div>
    );
});

export default ExpandCollapseHeader;