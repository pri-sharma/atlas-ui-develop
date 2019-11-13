import React from 'react';
import { shallow } from 'enzyme';
import CustUserAssignementForm from './CustUserAssignmentForm';

describe('Customer User Assignement Form', () => {
    const wrapper = shallow(<CustUserAssignementForm />);
    it('component rendered', () => {
        wrapper.render();
   });
});