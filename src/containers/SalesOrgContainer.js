import React, {Component} from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import SalesOrgTable from "../components/SalesOrgTable";
import PageHeader from '../components/utility/pageHeader';


class SalesOrgContainer extends Component {
    render() {
        return (
            <LayoutContentWrapper style={{height: '100%'}}>
                <LayoutContent>
                    <h3>Sales Org Maintenance</h3><br/>
                    <SalesOrgTable/>
                </LayoutContent>
            </LayoutContentWrapper>
        )
    }
}

export default SalesOrgContainer