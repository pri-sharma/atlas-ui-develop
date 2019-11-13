import React, {Component} from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import BVPGrid from '../components/BVPGrid.js';
import Paper from '@material-ui/core/Paper';
import FiltersContainer from './Filters/FiltersContainer';


class BaselineVolumePlanningContainer extends Component {
    render() {
        return (
            <LayoutContentWrapper className='filteredContent'>
                <FiltersContainer/>
                <Paper className='filteredGrid'>
                    <BVPGrid/>
                </Paper>
            </LayoutContentWrapper>
        )
    }
}

export default BaselineVolumePlanningContainer;