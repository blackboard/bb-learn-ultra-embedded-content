import moment from 'moment';
import React from 'react';
import { shallow } from 'enzyme'; // eslint-disable-line
import jestEach from 'jest-each';
import App from '../app';
import EditItem from '../components/edit-item';
import { MESSAGE_TYPES } from '../constants';
import YouTubeService from '../services/you-tube-service';

jest.mock('moment');
jest.mock('../services/you-tube-service');

describe('App', () => {
    let wrapper = null;
    let originalFocus = null;
    const sampleSearchResult = {
        key: 'key',
        id: {
            videoId: '6ZfuNTqbHE8',
        },
        snippet: {
            title: 'Example Video',
            channelId: 'hgsdhgjkj',
            channelTitle: 'title',
            publishedAt: '12/3/17',
        },
    };

    const verifySearchPageDisplayed = () => {
        expect(wrapper.state().workflow).toBe('searching');
        expect(wrapper.find('.youtube-search-container').length).toEqual(1);
        expect(wrapper.find('.youtube-search-container.hidden').length).toEqual(0);
        expect(wrapper.find('EditItem').length).toEqual(0);
    };

    const selectSampleSearchResult = () => {
        wrapper.instance().onContentSelect(sampleSearchResult);
        expect(wrapper.state().workflow).toBe('editing');
        wrapper.update();
    };

    const verifyEditPageDisplayed = () => {
        expect(wrapper.find('EditItem').length).toEqual(1);
        expect(wrapper.find('.youtube-search-container.hidden').length).toEqual(1);
    };

    const returnToSearch = () => {
        const editPage = wrapper.find('EditItem');
        const returnToResultsButton = editPage.shallow().find('ButtonSecondary').at(0);
        returnToResultsButton.simulate('click');
        wrapper.update();
    };

    App.prototype.getYouTubeConfig = jest.fn();
    beforeEach(() => {
        wrapper = shallow(
            <App />,
        );
        originalFocus = wrapper.instance().focus;
        wrapper.instance().focus = jest.fn();
        wrapper.setState({
            workflow: 'searching',
        });
        EditItem.prototype.title = {
            focus: jest.fn(),
        };
    });

    afterEach(() => {
        wrapper = null;
    });

    it('should post the page loaded message on mount', () => {
        const expectedMessage = {
            messageType: MESSAGE_TYPES.outgoing.pageLoaded,
        };
        wrapper.instance().postMessage = jest.fn();

        wrapper.instance().componentDidMount();
        expect(wrapper.instance().postMessage).toHaveBeenCalledWith(expectedMessage);
    });

    it('should display H1 text', () => {
        expect(wrapper.children().at(0).children().at(0)
            .children()
            .at(0)
            .text()).toEqual('Search YouTube');
    });

    jestEach([
        ['https://www.example.com', 1],
        ['https://www.test.com', 0],
    ])
    .it('receiveMessage should verify that origin is from parent', (messageOrigin, timesCalled) => {
        const mockEvent = {
            data: {
                locale: 'en',
                messageType: MESSAGE_TYPES.incoming.initContent,
            },
            origin: messageOrigin,
        };
        wrapper.instance().getYouTubeConfig = jest.fn();
        wrapper.instance().receiveMessage(mockEvent);
        expect(wrapper.instance().getYouTubeConfig).toHaveBeenCalledTimes(timesCalled);
    });

    it('receiveMessage should update the locale', () => {
        const mockEvent = {
            data: {
                config: {
                    locale: 'it-it',
                    messageType: MESSAGE_TYPES.incoming.initContent,
                },
            },
            origin: 'https://www.example.com',
        };

        wrapper.instance().receiveMessage(mockEvent);
        wrapper.update();

        expect(wrapper.state('locale')).toBe('it-it');
        expect(moment.locale).toBeCalledWith('it-it');
        expect(YouTubeService.prototype.setRelevanceLanguage).toBeCalledWith('it-it');
    });

    it('onContentSelect should display edit page and hide search results', () => {
        verifySearchPageDisplayed();
        selectSampleSearchResult();
        verifyEditPageDisplayed();
    });

    it('onContentSelect should set previously focused element', () => {
        const testButton = document.createElement('button');
        document.body.appendChild(testButton);
        testButton.focus();
        expect(document.activeElement).toEqual(testButton);
        expect(wrapper.state().previouslyFocusedElement).toBeNull();

        selectSampleSearchResult();
        expect(wrapper.state().previouslyFocusedElement).toEqual(testButton);
    });

    it('back button click on edit item page should hide edit page and display search results', () => {
        selectSampleSearchResult();
        returnToSearch();
        verifySearchPageDisplayed();
    });

    it('onDismiss should call postMessage', () => {
        const expectedMessage = {
            messageType: MESSAGE_TYPES.outgoing.canceled,
        };
        wrapper.instance().postMessage = jest.fn();

        wrapper.instance().onDismiss(expectedMessage);
        expect(wrapper.instance().postMessage).toHaveBeenCalledWith(expectedMessage);
    });

    it('onSubmit should call postMessage with correct values', () => {
        const mockSelection = {
            id: {
                videoId: '6ZfuNTqbHE8',
            },
            snippet: {
                title: 'Example Video',
            },
        };
        const expectedMessage = {
            dataContent: {
                alt: 'Sample alt text',
                src: `https://www.youtube.com/embed/${mockSelection.id.videoId}`,
                response: mockSelection,
            },
            dataType: 'link',
            messageType: MESSAGE_TYPES.outgoing.contentReady,
        };
        wrapper.instance().setState({
            selectedResponse: mockSelection,
        });
        wrapper.instance().postMessage = jest.fn();
        wrapper.instance().onSubmit({
            altText: 'Sample alt text',
            displayType: 'displayAsLink',
        });
        expect(wrapper.instance().postMessage).toHaveBeenCalledWith(expectedMessage);
    });

    it('calls focus on initSearch', () => {
        wrapper.instance().initSearch();
        expect(wrapper.instance().focus).toHaveBeenCalledTimes(1);
    });

    it('calls focus on return from the edit page', () => {
        selectSampleSearchResult();
        returnToSearch();
        expect(wrapper.instance().focus).toHaveBeenCalledTimes(1);
    });

    describe('focus', () => {
        let previouslyActiveElement = null;
        let title = null;
        beforeEach(() => {
            wrapper.instance().focus = originalFocus;
            previouslyActiveElement = {
                focus: jest.fn(),
            };
            title = {
                focus: jest.fn(),
            };
            wrapper.setState({
                previouslyFocusedElement: previouslyActiveElement,
            });
            wrapper.instance().title = title;
        });

        it('activates previously focused element if available', () => {
            wrapper.instance().focus();
            expect(previouslyActiveElement.focus).toHaveBeenCalled();
            expect(title.focus).not.toHaveBeenCalled();
        });

        it('sets focus on the title if a previously focused element does not exist', () => {
            wrapper.setState({
                previouslyFocusedElement: null,
            });

            wrapper.instance().focus();
            expect(previouslyActiveElement.focus).not.toHaveBeenCalled();
            expect(title.focus).toHaveBeenCalled();
        });
    });
});
