import jestEach from 'jest-each';
import YouTubeService from '../you-tube-service';
import { MOCK_SEARCH_PARAMS, MOCK_SEARCH_RESPONSE } from '../constants/test-constants';
import hasNewSearchParams from '../have-search-params-changed';

jest.mock('../build-api-request', () => () => Promise.resolve(JSON.stringify({})));

describe('YouTubeService', () => {
    const mockApiKey = 'mock-api-key';

    let MockService = null;
    const createMockService = (Service) => {
        const MockYouTubeService = new Service(true);
        MockYouTubeService.setApiKey(mockApiKey);
        MockYouTubeService.getResults = jest.fn((requestBody, pageNumber) => new Promise((resolve) => {
            if (MockYouTubeService.cache.responses[pageNumber]) {
                resolve(MockYouTubeService.cache.responses[pageNumber]);
                return;
            }
            const configuredResponse = {
                pagination: {
                    itemsPerPage: 10,
                    nextPageToken: 'mockToken1',
                    prevPageToken: 'mockToken2',
                    pageNumber,
                    totalItems: 1000,
                },
                results: [],
            };
            MockYouTubeService.cache.responses[pageNumber] = configuredResponse;
            MockYouTubeService.cache.latest.response = configuredResponse;
            resolve(configuredResponse);
        }));

        return MockYouTubeService;
    };

    beforeEach(() => {
        MockService = createMockService(YouTubeService);
    });

    afterEach(() => {
        MockService = null;
    });

    it('search/searchYouTube resolves with cached response if searchParams match latest request', () => {
        MockService.getResults = jest.fn(() => Promise.resolve({}));

        MockService.search(MOCK_SEARCH_PARAMS.random);
        expect(MockService.getResults).toHaveBeenCalledWith({
            key: mockApiKey,
            maxResults: 10,
            order: 'relevance',
            part: 'snippet',
            publishedAfter: expect.anything(),
            q: 'Text search query alt',
            type: 'video',
            relevanceLanguage: 'en',
        }, 1);
        expect(MockService.getResults).toHaveBeenCalledTimes(1);

        MockService.setCache({
            latest: {
                request: MOCK_SEARCH_PARAMS.page1,
                response: null,
            },
            responses: {
                1: MOCK_SEARCH_RESPONSE.page1,
            },
        });

        MockService.search(MOCK_SEARCH_PARAMS.page1);
        // getResults is NOT called a 2nd time
        expect(MockService.getResults).toHaveBeenCalledTimes(1);
    });

    it('clears out the cached responses when the primary search changes ', () => {
        MockService.getResults = jest.fn(() => Promise.resolve({}));
        MockService.setCache({
            latest: {
                request: MOCK_SEARCH_PARAMS.page1,
                response: null,
            },
            responses: {
                1: MOCK_SEARCH_RESPONSE.page1,
            },
        });

        MockService.search({});

        expect(MockService.cache.responses).toEqual({});
    });

    it('does not clear out the cached responses when the primary search does not change ', () => {
        MockService.setCache({
            latest: {
                request: MOCK_SEARCH_PARAMS.page1,
                response: null,
            },
            responses: {
                1: MOCK_SEARCH_RESPONSE.page1,
            },
        });

        MockService.search(MOCK_SEARCH_PARAMS.page1);

        expect(MockService.cache.responses).not.toEqual({});
    });

    it('includes the relevanceLanguage in the search request', () => {
        MockService.getResults = jest.fn(() => Promise.resolve({}));
        MockService.setRelevanceLanguage('it-it');
        MockService.search(MOCK_SEARCH_PARAMS.random);

        expect(MockService.getResults).toHaveBeenCalledWith({
            key: mockApiKey,
            maxResults: 10,
            order: 'relevance',
            part: 'snippet',
            publishedAfter: expect.anything(),
            q: 'Text search query alt',
            type: 'video',
            relevanceLanguage: 'it',
        }, 1);
    });

    it('registers, updates, and deregisters event listeners', () => {
        const mockListener = jest.fn();
        MockService.registerListener(mockListener);

        MockService.sendEvent({});

        expect(mockListener).toHaveBeenCalledTimes(1);

        MockService.deregisterListener(mockListener);
        MockService.sendEvent({});

        expect(mockListener).toHaveBeenCalledTimes(1);
    });

    describe('setRelevanceLanguage', () => {
        it('truncates the locale to the two-letter locale code', () => {
            MockService.getResults = jest.fn();
            MockService.setRelevanceLanguage('it-it');

            expect(MockService.relevanceLanguage).toBe('it');
        });

        it('does nothing if passed a two-letter locale code', () => {
            MockService.getResults = jest.fn();
            MockService.setRelevanceLanguage('it');

            expect(MockService.relevanceLanguage).toBe('it');
        });

        it('uses a special code for simplified Chinese', () => {
            // See https://developers.google.com/youtube/v3/docs/search/list
            MockService.getResults = jest.fn();
            MockService.setRelevanceLanguage('zh-cn');

            expect(MockService.relevanceLanguage).toBe('zh-Hans');
        });

        it('uses a special code for traditional Chinese', () => {
            // See https://developers.google.com/youtube/v3/docs/search/list
            MockService.getResults = jest.fn();
            MockService.setRelevanceLanguage('zh-tw');

            expect(MockService.relevanceLanguage).toBe('zh-Hant');
        });
    });

    it('deletes excess pages from the cache on paging past page 9', () => {
        MockService.setCache({
            latest: {
                request: MOCK_SEARCH_PARAMS.page14,
                response: null,
            },
            responses: {
                1: MOCK_SEARCH_RESPONSE.page1,
                2: MOCK_SEARCH_RESPONSE.page2,
                3: MOCK_SEARCH_RESPONSE.page3,
                4: MOCK_SEARCH_RESPONSE.page4,
                5: MOCK_SEARCH_RESPONSE.page5,
                6: MOCK_SEARCH_RESPONSE.page6,
                7: MOCK_SEARCH_RESPONSE.page7,
                8: MOCK_SEARCH_RESPONSE.page8,
                9: MOCK_SEARCH_RESPONSE.page9,
                10: MOCK_SEARCH_RESPONSE.page10,
                11: MOCK_SEARCH_RESPONSE.page11,
                12: MOCK_SEARCH_RESPONSE.page12,
                13: MOCK_SEARCH_RESPONSE.page13,
                14: MOCK_SEARCH_RESPONSE.page14,
                15: MOCK_SEARCH_RESPONSE.page15,
                16: MOCK_SEARCH_RESPONSE.page16,
            },
        });

        MockService.onSearchCompleted({ pagination: { totalItems: 1, itemsPerPage: 2 }, searchParams: { pageNumber: 250 } });
        expect(MockService.cache.responses[1]).toBeUndefined();
        expect(MockService.cache.responses[6]).toBeUndefined();
    });


    it('deletes excess pages on both sides of the current pages', () => {
        MockService.setCache({
            latest: {
                request: MOCK_SEARCH_PARAMS.page14,
                response: null,
            },
            responses: {
                1: MOCK_SEARCH_RESPONSE.page1,
                2: MOCK_SEARCH_RESPONSE.page2,
                3: MOCK_SEARCH_RESPONSE.page3,
                4: MOCK_SEARCH_RESPONSE.page4,
                5: MOCK_SEARCH_RESPONSE.page5,
                6: MOCK_SEARCH_RESPONSE.page6,
                7: MOCK_SEARCH_RESPONSE.page7,
                8: MOCK_SEARCH_RESPONSE.page8,
                9: MOCK_SEARCH_RESPONSE.page9,
                10: MOCK_SEARCH_RESPONSE.page10,
                11: MOCK_SEARCH_RESPONSE.page11,
                12: MOCK_SEARCH_RESPONSE.page12,
                13: MOCK_SEARCH_RESPONSE.page13,
                14: MOCK_SEARCH_RESPONSE.page14,
                15: MOCK_SEARCH_RESPONSE.page15,
                16: MOCK_SEARCH_RESPONSE.page16,
            },
        });

        MockService.trimCache(8);

        const trimmedPages = [1, 2, 14, 15, 16];
        for (let i = 1; i <= 16; i += 1) {
            const shouldBeTrimmed = trimmedPages.includes(i);
            expect(MockService.cache.responses[i] === undefined).toBe(shouldBeTrimmed);
        }
    });

    it('sets paginationIsDisabled back to false after callback to onPagesReady', () => {
        let mockState = {};
        MockService.registerListener((state) => { mockState = state; });
        MockService.getAdditionalPages = jest.fn();

        MockService.onSearchCompleted({ pagination: { totalItems: 6, itemsPerPage: 2 }, searchParams: {} });

        expect(mockState.paginationIsDisabled).toEqual(true);

        MockService.onPagesReady({ 1: { pagination: {} } }, 1);

        expect(mockState.paginationIsDisabled).toEqual(false);
    });

    it('onSearchCompleted does nothing if no pagination is needed', () => {
        MockService.getAdditionalPages = jest.fn();
        MockService.sendEvent = jest.fn();

        MockService.onSearchCompleted({ pagination: { totalItems: 1, itemsPerPage: 2 }, searchParams: {} });

        expect(MockService.getAdditionalPages).not.toHaveBeenCalled();
        expect(MockService.sendEvent).not.toHaveBeenCalled();
    });

    describe('hasNewSearchParams', () => {
        it('reports new params if there is no latest request in the cache', () => {
            const result = hasNewSearchParams(null, { foo: true });

            expect(result).toBe(true);
        });

        it('reports unchanged params if there only the page number changed', () => {
            const latestRequest = { pageNumber: 1, searchText: 't-rex' };
            const result = hasNewSearchParams(latestRequest, { pageNumber: 2, searchText: 't-rex' });

            expect(result).toBe(false);
        });

        it('reports unchanged params if there only the page token changed', () => {
            const latestRequest = { pageToken: 'fooToken', searchText: 't-rex' };
            const result = hasNewSearchParams(latestRequest, { pageToken: 'blahToken', searchText: 't-rex' });

            expect(result).toBe(false);
        });

        it('reports unchanged params if any other field changed', () => {
            const latestRequest = { pageToken: 'fooToken', searchText: 't-rex' };
            const result = hasNewSearchParams(latestRequest, { pageToken: 'blahToken', searchText: 'utahraptor' });

            expect(result).toBe(true);
        });
    });

    jestEach([
        ['maps and caches the youtube search response to the expected format', 2],
        ['adjusts the totalItems if the API over-counted', 10],
    ]).describe('handleSearchResponse', (testName, totalResults) => {
        test(testName, () => {
            const mappedResponse = MockService.handleSearchResponse({
                pageInfo: {
                    totalResults,
                    resultsPerPage: 10,
                },
                nextPageToken: 'next',
                prevPageToken: 'prev',
                items: [{ first: true, id: { videoId: 'id1' } }, { second: true, id: { videoId: 'id2' } }],

            }, 1);

            const expectedResponse = {
                pagination: {
                    pageNumber: 1,
                    totalItems: 2,
                    itemsPerPage: 10,
                    nextPageToken: 'next',
                    prevPageToken: 'prev',
                },
                results: [{ first: true, id: { videoId: 'id1' }, key: 'id1' },
                    { second: true, id: { videoId: 'id2' }, key: 'id2' }],
            };
            expect(mappedResponse).toEqual(expectedResponse);
            expect(MockService.cache.latest.response).toEqual(expectedResponse);
            expect(MockService.cache.responses[1]).toEqual(expectedResponse);
        });
    });
});
