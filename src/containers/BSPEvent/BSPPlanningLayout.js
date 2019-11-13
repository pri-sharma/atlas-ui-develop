import React, {Component} from 'react';
import LayoutContent from "../../components/utility/layoutContent";
import PageHeader from "../../components/utility/pageHeader";
import ContentHolder from "../../components/utility/contentHolder";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import EventGrid from '../../components/EventGrid'

class BSPPlanningLayout extends Component {

    render() {
        return (
            <LayoutContentWrapper>
                <LayoutContent>
                    <PageHeader>Baseline Spend Planning Layout</PageHeader>
                    <ContentHolder>
                        AG Grid will go here
                        <EventGrid/> {/*EventGrid takes in rowData and calyear as props*/}
                    </ContentHolder>
                </LayoutContent>
            </LayoutContentWrapper>)
    }
}

export default BSPPlanningLayout