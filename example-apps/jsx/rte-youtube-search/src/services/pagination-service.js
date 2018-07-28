import { calculatePages } from 'bb-public-library/utilities';
import configureFetchUncachedPages from './fetch-uncached-pages';

export const VISIBLE_PAGINATION_BUTTONS = 5;

export default (makePageRequest) => {
    class Pager {
        constructor(paginationDetails, searchParams, cache) {
            this.fetchAdjacentPages = this.fetchAdjacentPages.bind(this);
            this.shouldFetchAnyPages = this.shouldFetchAnyPages.bind(this);
            this.fetchUncachedPages = configureFetchUncachedPages(cache, searchParams, makePageRequest);
            this._getVisiblePageNumbers = this._getVisiblePageNumbers.bind(this); // eslint-disable-line no-underscore-dangle
            this._isPagingForward = this._isPagingForward.bind(this); // eslint-disable-line no-underscore-dangle

            this.currentPageNumber = paginationDetails.pageNumber;
            this.paginationDetails = paginationDetails;
            this.cache = cache;
        }

        fetchAdjacentPages() {
            const pageNumbersToFetch = this._getVisiblePageNumbers() // eslint-disable-line no-underscore-dangle
                .filter(pageNumber => this.cache.responses[pageNumber] == null);

            if (!this._isPagingForward()) { // eslint-disable-line no-underscore-dangle
                pageNumbersToFetch.reverse();
            }

            return this.fetchUncachedPages(pageNumbersToFetch);
        }

        shouldFetchAnyPages() {
            return this._getVisiblePageNumbers().length > 1; // eslint-disable-line no-underscore-dangle
        }

        _isPagingForward() {
            // If we have cache entries at the start of the list of visible pages but not the end,
            // we are paging forward, and vice versa.

            const visiblePages = this._getVisiblePageNumbers(); // eslint-disable-line no-underscore-dangle
            const first = visiblePages[0];
            const last = visiblePages[visiblePages.length - 1];
            if (this.cache.responses[last] && !this.cache.responses[first]) {
                return false;
            }

            return true;
        }

        _getVisiblePageNumbers() {
            return calculatePages(this.paginationDetails).pagesList.map(pageObj => pageObj.pageNumber);
        }
    }
    return (paginationDetails, searchParams, cache) => new Pager(paginationDetails, searchParams, cache);
};

