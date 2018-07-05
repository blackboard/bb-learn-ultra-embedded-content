import configurePaginationService from '../pagination-service';

jest.mock('../fetch-uncached-pages', () => () => jest.fn(() => Promise.resolve([])));

describe('pagination service', () => {
    let makeHelper;
    let paginationDetails;
    let searchParams;
    let cache;
    const mockFetchPage = jest.fn(() => Promise.resolve({ results: 'finished' }));

    function resetSuite() {
        paginationDetails = {
            totalItems: 9,
            itemsPerPage: 10,
            pageNumber: 5,
        };
        searchParams = {
        };
        cache = {
            responses: {
                5: {},
            },
        };
    }
    beforeEach(() => {
        resetSuite();
        makeHelper = configurePaginationService(mockFetchPage);
    });

    afterEach(() => {
        resetSuite();
        makeHelper = null;
    });


    it('does not say pages should be fetched if the results fit on one page', () => {
        const helper = makeHelper(paginationDetails, searchParams, cache);

        const result = helper.shouldFetchAnyPages();

        expect(result).toBe(false);
    });

    it('does say pages should be fetched if the results don\'t fit on one page', () => {
        paginationDetails.totalItems = 99;
        const helper = makeHelper(paginationDetails, searchParams, cache);

        const result = helper.shouldFetchAnyPages();

        expect(result).toBe(true);
    });

    it('fetches the correct page numbers when paging forward', (done) => {
        paginationDetails.totalItems = 99;
        const helper = makeHelper(paginationDetails, searchParams, cache);

        const result = helper.fetchAdjacentPages();

        expect(helper.fetchUncachedPages).toBeCalledWith([3, 4, 6, 7]);
        return result.then(() => {
            done();
        });
    });

    it('fetches the correct page numbers reversed when paging backward', (done) => {
        paginationDetails.totalItems = 99;
        paginationDetails.pageNumber = 5;
        cache.responses[7] = {};

        const helper = makeHelper(paginationDetails, searchParams, cache);

        const result = helper.fetchAdjacentPages();

        expect(helper.fetchUncachedPages).toBeCalledWith([6, 4, 3]);
        return result.then(() => {
            done();
        });
    });
});
