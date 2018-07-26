import * as React from 'react';
import { shallow } from 'enzyme'; // tslint:disable-line:no-implicit-dependencies
import App from '../app';

describe('App', () => {
    let wrapper: any = null;

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
