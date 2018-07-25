import React from 'react';
import { shallow } from 'enzyme';
import EditItem from '../edit-item';

describe('EditItem', () => {
    let wrapper = null;
    const mockTranslate = key => key;
    const mockReturnToResults = jest.fn();
    const mockCancel = jest.fn();
    const mockSubmit = jest.fn();
    const mockPreviewAttributes = {
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
        EditItem.prototype.title = {
            focus: jest.fn(),
        };
        wrapper = shallow(
            <EditItem
                goBack={mockReturnToResults}
                onCancel={mockCancel}
                onSubmit={mockSubmit}
                previewAttrs={mockPreviewAttributes}
                translate={mockTranslate}
            />,
        );
    });

    it('has the correct controls on the page', () => {
        expect(wrapper.find('SearchResult').length).toBe(1);
        expect(wrapper.find('Input').length).toBe(1);

        const radioButtons = wrapper.find('RadioGroup');
        expect(radioButtons.length).toBe(1);
        expect(radioButtons.at(0).prop('options').length).toBe(2);
    });

    it('sets focus on the title on mount', () => {
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().title.focus).toHaveBeenCalled();
    });

    it('calls the submit button with the correct alt text and display option', () => {
        const altTextInput = wrapper.find('Input').at(0);
        expect(altTextInput.prop('value')).toBe(mockPreviewAttributes.snippet.title);
        const radioButton = wrapper.find('RadioGroup').at(0);
        expect(radioButton.prop('value')).toBe('displayInline');

        const newAltText = 'New alt text';
        altTextInput.prop('onChange')(altTextInput.prop('name'), newAltText);
        radioButton.prop('onSelect')(radioButton.prop('name'), 'displayAsLink');
        wrapper.update();

        const buttons = wrapper.find('ButtonPrimary');
        expect(buttons.length).toBe(1);
        buttons.at(0).simulate('click');
        expect(mockSubmit).toHaveBeenCalledWith({
            altText: newAltText,
            displayType: 'displayAsLink',
        });
    });

    it('calls back and cancel functions on the appropriate button click', () => {
        const buttons = wrapper.find('ButtonSecondary');
        expect(buttons.length).toBe(2);

        expect(mockReturnToResults).not.toHaveBeenCalled();
        buttons.at(0).simulate('click');
        expect(mockReturnToResults).toHaveBeenCalled();

        expect(mockCancel).not.toHaveBeenCalled();
        buttons.at(1).simulate('click');
        expect(mockCancel).toHaveBeenCalled();
    });
});
