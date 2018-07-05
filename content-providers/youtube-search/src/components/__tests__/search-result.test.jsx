import React from 'react';
import { shallow } from 'enzyme'; // eslint-disable-line
import SearchResult from '../search-result';
import { ButtonSecondary } from '../../../../../library/react';

describe('SearchResult', () => {
    let wrapper = null;
    const mockSelectContent = jest.fn();
    const mockTranslate = key => key;
    const mockResult = {
        key: 'key',
        id: {
            videoId: 'youtube-video',
        },
        snippet: {
            channelId: 'example-channel-id',
            channelTitle: 'Example Channel Title',
            description: 'Example description',
            publishedAt: '2018-02-08T14:52:11-05:00',
            title: 'Test Video Title',
        },
    };

    beforeEach(() => {
        wrapper = shallow(
            <SearchResult
                onContentSelect={mockSelectContent}
                result={mockResult}
                translate={mockTranslate}
            />,
        );
    });

    afterEach(() => {
        wrapper = null;
    });

    it('should call onContentSelect prop when clicked', () => {
        const selectButtonEl = wrapper.find(ButtonSecondary);
        selectButtonEl.simulate('click');
        expect(mockSelectContent).toHaveBeenCalled();
    });

    it('should not display the select button when onContentSelect is falsy', () => {
        wrapper = shallow(
            <SearchResult
                result={mockResult}
                translate={mockTranslate}
            />,
        );
        expect(wrapper.find(ButtonSecondary).length).toBe(0);
    });
});
