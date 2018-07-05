import configureFetchUncachedPages from '../fetch-uncached-pages';

describe('fetch pages helper', () => {
    let target;
    let cache;
    let searchParams;
    let mockResponse;
    let mockMakePageRequest;

    function resetSuite() {
        cache = {
            latest: {
                request: { searchText: 't-rex' },
            },
            responses: {
                5: {
                    pagination: {
                        nextPageToken: '5next',
                        prevPageToken: '5prev',
                    },
                },
            },
        };
        searchParams = {
            searchText: 't-rex',
        };
        mockResponse = {
            results: Array(10).fill().map(() => ({})),
            pagination: {
                nextPageToken: 'fooNext',
                prevPageToken: 'fooPrev',
            },
        };
        mockMakePageRequest = jest.fn((_, pageNumber) => {
            cache.responses[pageNumber] = mockResponse;
            return Promise.resolve(mockResponse);
        });
    }
    beforeEach(() => {
        resetSuite();
        target = configureFetchUncachedPages(cache, searchParams, mockMakePageRequest);
    });

    afterEach(() => {
        resetSuite();
        target = null;
    });


    it('does not fetch any pages if not given any pageNumbers', () => {
        target([]);

        expect(mockMakePageRequest).not.toBeCalled();
    });

    it('does not fetch any pages if another search has been started since paging began', () => {
        cache.latest.request = { searchText: 'utahraptor' };
        target([6]);

        expect(mockMakePageRequest).not.toBeCalled();
    });

    it('does not fetch more pages if the fetched page is actually the last after correction', (done) => {
        mockResponse.results = Array(8).fill().map(() => ({}));
        mockResponse.pagination.nextPageToken = 'fooToken';

        target([6, 7]).then(() => {
            expect(mockMakePageRequest).toHaveBeenCalledTimes(1);
            expect(mockMakePageRequest).toHaveBeenCalledWith({
                searchText: 't-rex',
                pageToken: '5next',
            }, 6);
            done();
        });
    });

    it('fetches pages in order using the token from the previous page', (done) => {
        target([6, 7]).then(() => {
            expect(mockMakePageRequest).toHaveBeenCalledTimes(2);
            expect(mockMakePageRequest).toHaveBeenCalledWith({
                searchText: 't-rex',
                pageToken: '5next',
            }, 6);
            expect(mockMakePageRequest).toHaveBeenLastCalledWith({
                searchText: 't-rex',
                pageToken: 'fooNext',
            }, 7);
            done();
        });
    });

    it('fetches pages in order going backward', (done) => {
        target([4, 3]).then(() => {
            expect(mockMakePageRequest).toHaveBeenCalledTimes(2);
            expect(mockMakePageRequest).toHaveBeenCalledWith({
                searchText: 't-rex',
                pageToken: '5prev',
            }, 4);
            expect(mockMakePageRequest).toHaveBeenLastCalledWith({
                searchText: 't-rex',
                pageToken: 'fooPrev',
            }, 3);
            done();
        });
    });
});
