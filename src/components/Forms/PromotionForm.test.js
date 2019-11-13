import React from 'react';
import {mount, shallow, render} from 'enzyme';
// import PromotionForm from './PromotionForm';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const url = process.env.REACT_APP_API_URL;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let wrapper;
const plannableCustomers = [];
const plannableProducts = [];

describe('Promotion Form for Creating and Editing', () => {
    let store;
    let customerOptions;
    const initialState = {};
    let productOptions;

    describe('Customer Selection', () => {
        beforeEach(() => {
            store = mockStore(initialState);
            // wrapper = mount(<PromotionForm store={store}/>);
            customerOptions = wrapper.find('Modal').find('Form').find('FormItem').first().find('Select').getElements()[0].props.children
        });

        it('Has at least one option for selectable customers', () => {
            expect(wrapper.props.plannableCustomers.length).toBeGreaterThanOrEqual(1)
        });

        it('Has options for each customer that the user owns', () => {
            expect(wrapper.props.plannableCustomers.length).toEqual(customerOptions.length)
        });

        it('Sorts customers by customer description', () => {
            expect(wrapper.props.plannableCustomers).toStrictEqual(plannableCustomers.sort(compareCustomers))
        });
    });

    describe('Date Selection', () => {
        let today, plan_start, plan_end, price_start, price_end, customerSelect;

        beforeEach(() => {
            today = new Date().toISOString().split()[0];
            store = mockStore(initialState);
            // wrapper = mount(<PromotionForm store={store}/>);
            customerSelect = wrapper.find('Modal').find('Form').find('FormItem')[0].find('Select');
            plan_start = wrapper.find('Modal').find('Form').find('FormItem')[2].find('Input')[0]; //TODO: does it really look like this?
            plan_end = wrapper.find('Modal').find('Form').find('FormItem')[2].find('Input')[1];
            price_start = wrapper.find('Modal').find('Form').find('FormItem')[2].find('Input')[2];
            price_end = wrapper.find('Modal').find('Form').find('FormItem')[2].find('Input')[3]; //TODO: fix all of these
        });

        it("Default date values are today's date", () => {
            expect(plan_start.props.defaultValue).toEqual(today);
            expect(plan_end.props.defaultValue).toEqual(today);
            expect(price_start.props.defaultValue).toEqual(today);
            expect(price_end.props.defaultValue).toEqual(today);
        });

        it('Autofills on click-in to 20YY-MM-DD', () => {
            customerSelect.simulate('change', {target: {value: 'FILL IN'}});
            plan_start.simulate('click');
            expect(plan_start.props.value).toEqual('20YY-MM-DD');
            plan_end.simulate('click');
            expect(plan_end.props.value).toEqual('20YY-MM-DD');
            price_start.simulate('click');
            expect(price_start.props.value).toEqual('20YY-MM-DD');
            price_end.simulate('click');
            expect(price_end.props.value).toEqual('20YY-MM-DD');
        });

        it('Displays the date in YYYY-MM-DD format, e.g. 2019 Apr 26', () => {
            customerSelect.simulate('change', {target: {value: 'FILL IN'}});
            plan_start.simulate('change', {target: {value: '2019-06-24'}});
            expect(plan_start.props.value).toEqual('2019 June 24');
        });


        it('Locks date fields without a customer selected', () => {
            plan_start.simulate('change', {target: {value: '2022-05-21'}});
            expect(plan_start.props.value).toEqual(today)
        });
    });

    describe('Product Selection', () => {
        let customerSelect;

        beforeEach(() => {
            store = mockStore(initialState);
            // wrapper = mount(<BSPEventForm store={store}/>);
            productOptions = wrapper.find('Modal').find('Form').find('FormItem').second().find('Select').getElements()[0].props.children;
            customerSelect = wrapper.find('Modal').find('Form').find('FormItem').first().find('Select')
        });

        it("Doesn't have products pre-loaded", () => {
            expect(productOptions.length).toEqual(0);
        });

        it('Displays product options only after a customer has been selected', () => {
            //TODO: change the state of customer first
            customerSelect.simulate('select', {target: {value: customerSelect.getElements()[0].props.children[1]}});
            expect(wrapper.props.plannableProducts.length).toEqual(productOptions.length)
        });

        it('Allows a user to select multiple products', () => {
            //TODO: simulate selecting multiple products
            expect(wrapper.state('products').length).toBeGreaterThanOrEqual(0)
        });

        it('Allows a user to type a product ID or paste a product ID into the product field', () => {

        });

        it('Produces a product selector with checkboxes and an OK button', () => {

        });

        it('Defaults to none selected', () => {
            let value = wrapper.find('Modal').find('Form').find('FormItem').second().find('Select').getElements()[0].props.defaultValue;
            expect(value).toEqual('');
        });

        it('Displays products sorted by product description', () => {
            expect(wrapper.props.plannableProducts).toStrictEqual(plannableProducts.sort(compareProducts))
        });
    });

    describe('Tactics Entry', () => {
        beforeEach(() => {
            store = mockStore(initialState);
            // wrapper = mount(<BSPEventForm store={store}/>);

        });

        it('Allows a user to select multiple tactics', () => {
            //TODO: simulate selecting multiple tactics
            expect(wrapper.state('tactics').length).toBeGreaterThanOrEqual(0)
        });

        it('Tactics are listed alphabetically', () => {
            //TODO: create a compare method for tactic
        });
    });

    describe('Status Selection', () => {
        let statusOptions;
        let statusSelect;

        beforeEach(() => {
            store = mockStore(initialState);
            // wrapper = mount(<BSPEventForm store={store}/>);
            statusSelect = wrapper.find('Modal').find('Form').find('FormItem')[3].find('Select'); //TODO: fix this
            statusOptions = wrapper.find('Modal').find('Form').find('FormItem')[3].find('Select').getElements()[0].props.children //TODO: fix this
        });

        it('Shows Draft as the current status -- ONLY ON EDIT', () => {
            expect(statusOptions.props.defaultValue).toEqual('Draft')
        });

        it('Can change status from Draft to Planned -- ONLY ON EDIT', () => {
            statusSelect.simulate('select', 'Planned');
            expect(wrapper.state('status')).toEqual('Planned')
        });

        it('Can change status from Draft to Customer Approved -- ONLY ON EDIT', () => {
            statusSelect.simulate('select', 'Customer Approved');
            expect(wrapper.state('status')).toEqual('Customer Approved')
        });
    });
});

