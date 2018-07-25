import haveSearchParamsChanged from './have-search-params-changed';

const isFinalPageWhenCorrected = response => response && response.results.length < 10 && response.pagination.nextPageToken;

export default (cache, searchParams, makePageRequest) => (allPageNumbersToFetch) => {
    const determinePageTokenForPageRequest = (pageNumber) => {
        const nextPageNumber = pageNumber + 1;
        const prevPageNumber = pageNumber - 1 === 0 ? 1 : pageNumber - 1;
        let pageToken;
        if (cache.responses[prevPageNumber]) {
            pageToken = cache.responses[prevPageNumber].pagination.nextPageToken;
        } else if (cache.responses[nextPageNumber]) {
            pageToken = cache.responses[nextPageNumber].pagination.prevPageToken;
        }

        return pageToken;
    };

    const fetchPage = (pageNumber) => {
        const pageToken = determinePageTokenForPageRequest(pageNumber);

        return makePageRequest({ ...searchParams, pageToken }, pageNumber);
    };

    const fetchUncachedPages = (pageNumbersToFetch, previousResponse) => {
        if (pageNumbersToFetch.length < 1) {
            return Promise.resolve(cache.responses);
        }
        if (haveSearchParamsChanged(cache.latest.request, searchParams)) {
            return Promise.resolve(cache.responses);
        }
        if (isFinalPageWhenCorrected(previousResponse)) {
            return Promise.resolve(cache.responses);
        }

        return fetchPage(pageNumbersToFetch[0])
            .then(response => fetchUncachedPages(pageNumbersToFetch.slice(1, pageNumbersToFetch.length), response));
    };

    return fetchUncachedPages(allPageNumbersToFetch);
};
