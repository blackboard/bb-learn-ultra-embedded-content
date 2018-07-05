import React from 'react';
import { mount } from 'enzyme';
import configureSearchContainer from '../configure-search-container';
import TEST_SORT_FILTER_CONFIG from '../test-constants/testSortFilterConfig';

describe('SearchContainer', () => {
    let wrapper;
    const mockGetAdditionalPages = jest.fn();
    let listener = null;
    const MockService = {
        search: jest.fn(() => Promise.resolve({
            pagination: {
                pageNumber: 1,
                itemsPerPage: 2,
                totalItems: 9,
            },
        })),
        getAdditionalPages: () => mockGetAdditionalPages,
        registerListener: jest.fn((registeredListener) => { listener = registeredListener; }),
        deregisterListener: jest.fn(() => { listener = null; }),
        onSearchCompleted: jest.fn(),
    };
    const mockSelect = jest.fn();
    const mockTranslate = key => key;

    beforeEach(() => {
        const SearchResult = () => (
            <div>Mock search result component</div>
            );
        const SearchContainer = configureSearchContainer(MockService, SearchResult);
        wrapper = mount(
            <SearchContainer
                onContentSelect={mockSelect}
                sortFilterConfig={TEST_SORT_FILTER_CONFIG}
                translate={mockTranslate}
            />, '',
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('updates its own state in reaction to the search service events', () => {
        const expectedState = {
            pagination: { pageNumber: 1, itemsPerPage: 2, totalItems: 5 },
            results: [{
                key: 'key',
                id: {
                    videoId: 'fooId',
                },
                snippet: {
                    channelId: 'foo',
                    channelTitle: 'title',
                    publishedAt: 'unixEpoch',
                    title: 'foo',
                },
            }],
            paginationIsDisabled: true,
        };
        listener(expectedState);
        expect(wrapper.state()).toMatchObject(expectedState);
    });

    it('merges new search params with current search params', () => {
        const nextSearchParams = {
            pageNumber: 2,
            searchText: 'Example search text',
        };
        expect(wrapper.instance().searchParams).toEqual({
            itemsPerPage: 10,
            lastUpdated: 'anyTime',
            orderBy: 'relevance',
            pageNumber: 1,
            searchText: '',
        });
        wrapper.instance().updateSearchParams(nextSearchParams);
        expect(wrapper.instance().searchParams).toEqual({
            itemsPerPage: 10,
            lastUpdated: 'anyTime',
            orderBy: 'relevance',
            pageNumber: 2,
            searchText: 'Example search text',
        });
    });

    it('stores the search term when the user explicitly searches as the current display search term', (done) => {
        const nextSearchParams = {
            pageNumber: 2,
            searchText: 'Super Mario',
        };
        wrapper.instance().updateSearchParams(nextSearchParams);
        return wrapper.instance().updateResults().then(() => {
            wrapper.update();
            expect(wrapper.find('SearchFieldsContainer').prop('displayedSearchText')).toBe('Super Mario');
            done();
        });
    });
});
