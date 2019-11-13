import React from 'react';
import { shallow } from '../../src/setupTests';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {shallowToJson} from 'enzyme-to-json';
import BVPGrid from './BVPGrid';

describe('Grid Initialization', () => {
    it('BVP ', () => {
        const initialState = {
            planningConfig: {
                BVP: {}
            },
            Bvp: {
                baselineVolumePlans: []
            },
            App: {collapsed: false},
            PlannableCustomers: {customerStartDay: "Monday"}
        };

        const middlewares = [thunk];
        const mockStore = configureMockStore(middlewares);
        const store = mockStore(initialState);
        const component = shallow(<BVPGrid store={store}/>);
        expect(shallowToJson(component)).toMatchSnapshot();
    });
});