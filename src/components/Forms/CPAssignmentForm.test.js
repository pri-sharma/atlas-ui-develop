import React from 'react';
import {mount, shallow, render} from 'enzyme';
import CPAssignmentForm from './CPAssignmentForm';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import reducer from '../../redux/app/reducers/cpassignmentReducer.js';

const url = process.env.REACT_APP_API_URL;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// const mockServiceCreator = (body, succeeds=true) => () => {
//     new Promise((resolve, reject) => {
//         setTimeout(() => (succeeds ? resolve(body) : reject(body)), 10);
//     })
// };
let wrapper;
let sales_org = 67;

const customers = () => {
    fetch(`${url}/api/v1/customer/customers/?level=1&limit=50`)
        .then(r => r.json())
        .then(customers => customers)
};

const products = () => {
    fetch(`${url}/api/v1/product/products/?sales_org=${sales_org}&level=5&limit=50`)
        .then(r => r.json())
        .then(products => products)
};

describe('Customer Product Assignment Form', () => {
    let store;

    const initialState = {CPAssignment: {}};

    beforeEach(() => {
        store = mockStore(initialState);
        wrapper = shallow(<CPAssignmentForm kind={'POST'} store={store}/>);
    });

    it('Renders without any preloaded customers in the form', () => {
        expect(wrapper.props.customersByLevel).toBeUndefined();
    });

    it('checks connection to reducers for getting customers by level', () => {
        expect(reducer(initialState, {type: 'GET_CUSTOMERS_BY_LEVEL', payload: customers})).toEqual({
            ...initialState,
            customersByLevel: customers
        })
    });

    describe('Renders Selects with appropriate options', () => {
        beforeEach(() => {
            store = mockStore(initialState);
            wrapper = mount(<CPAssignmentForm kind={'POST'} store={store}/>);
        });

        it('Has a default value of Select a Level', () => {
            let value = wrapper.find('Modal').find('Form').find('FormItem').first().find('Select').getElements()[0].props.defaultValue;
            expect(value).toEqual('Select a Level')
        });

        it('Only has options for level 3 and 4 customers', () => {
            let optionsLength = wrapper.find('Modal').find('Form').find('FormItem').first().find('Select').first().getElements()[0].props.children.length;
            expect(optionsLength).toEqual(2)
        });

        it('Connects reducers to get all products of specified sales org at level 5', () => {
            expect(reducer(initialState, {
                type: 'GET_PRODUCTS_BY_SALES_ORG',
                payload: products
            })).toEqual({...initialState, productsBySalesOrg: products});
        });
    });
});