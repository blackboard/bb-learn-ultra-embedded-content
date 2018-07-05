import React from 'react';
import {shallow} from 'enzyme'; // eslint-disable-line
import App from '../app';

describe('App', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<App title={'Hello, Test Component!'} />);
    });

    afterEach(() => {
        wrapper = null;
    });

    it('should display H1 text', () => {
        jest.useFakeTimers();
        jest.runAllTimers();
        expect(wrapper.instance().props.title).toEqual('Hello, Test Component!');
    });
});
