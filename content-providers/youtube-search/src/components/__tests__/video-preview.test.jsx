import React from 'react';
import { shallow } from 'enzyme'; // eslint-disable-line
import jestEach from 'jest-each';
import VideoPreview from '../video-preview';
import { EMBED_URL_PREFIX } from '../../constants';

describe('VideoPreview', () => {
    const mockResult = {
        id: {
            videoId: 'youtube-video',
        },
        snippet: {
            channelId: 'example-channel-id',
            channelTitle: 'Example Channel Title',
            description: 'Example description',
            publishedAt: '2018-02-08T14:52:11-05:00',
            title: 'Test Video Title',
            thumbnails: {
                medium: 'www.example.com/image.png',
            },
        },
    };

    const renderWrapper = (alwaysShowPreview) => {
        const wrapper = shallow(
            <VideoPreview
                alwaysShowPreview={alwaysShowPreview}
                className="screen-wide"
                result={mockResult}
            />,
        );
        return wrapper;
    };

    jestEach([
        [renderWrapper(true), 1],
        [renderWrapper(false), 0],
    ])
    .it('should render the correct html element (iframe or clickable image)', (wrapper, iframeCount) => {
        const previewFrame = wrapper.find('iframe');
        expect(previewFrame.length).toBe(iframeCount);
        if (previewFrame.length > 0) {
            expect(previewFrame.at(0).prop('src')).toEqual(`${EMBED_URL_PREFIX}${mockResult.id.videoId}`);
        }
        wrapper.unmount();
    });

    it('should render an iframe after clicking the thumbnail', () => {
        const mockPreventDefault = jest.fn();
        const wrapper = renderWrapper(false);
        wrapper.find('a').at(0).simulate('click', {
            preventDefault: mockPreventDefault,
        });
        expect(mockPreventDefault).toHaveBeenCalled();
        expect(wrapper.state().videoIsRendered).toBe(true);
        expect(wrapper.find('iframe').length).toBe(1);
    });
});
