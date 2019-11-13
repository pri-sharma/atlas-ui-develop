import React, {Component} from 'react';
import PageHeader from '../../components/utility/pageHeader';
import ContentHolder from '../../components/utility/contentHolder';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import EventGrid from '../../components/EventGrid';

class PromoPlanningLayout extends Component{

    render(){
        return(
            <LayoutContentWrapper>
                <LayoutContent>
                    <PageHeader>Trade Promotion Planning Layout</PageHeader>
                    <ContentHolder>
                        AG Grid will go here
                        <EventGrid/> {/*EventGrid takes in rowData and calyear as props*/}
                    </ContentHolder>
                </LayoutContent>
            </LayoutContentWrapper>
        )
    }
}

export default PromoPlanningLayout