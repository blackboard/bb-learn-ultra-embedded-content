import moment from 'moment';
import configurePaginationService, { VISIBLE_PAGINATION_BUTTONS } from './pagination-service';
import buildApiRequest from './build-api-request';
import hasNewSearchParams from './have-search-params-changed';

export default class YouTubeService {
    constructor(isTesting = false) {
        this.apiKey = '';
        this.relevanceLanguage = 'en';
        this.isTesting = isTesting;

        this.search = this.search.bind(this);
        this.setApiKey = this.setApiKey.bind(this);
        this.configureRequestBody = this.configureRequestBody.bind(this);
        this.setRelevanceLanguage = this.setRelevanceLanguage.bind(this);
        this.handleSearchResponse = this.handleSearchResponse.bind(this);
        this.registerListener = this.registerListener.bind(this);
        this.deregisterListener = this.deregisterListener.bind(this);
        this.sendEvent = this.sendEvent.bind(this);
        this.resetCache = this.resetCache.bind(this);
        this.setCache = this.setCache.bind(this);
        this.makePageRequest = this.makePageRequest.bind(this);
        this.onPagesReady = this.onPagesReady.bind(this);
        this.onSearchCompleted = this.onSearchCompleted.bind(this);
        this.trimCache = this.trimCache.bind(this);

        this.resetCache();
        this.listeners = [];
        this.getResults = this.getResults.bind(this);
        this.makePageHelper = configurePaginationService(this.makePageRequest);
    }

    resetCache() {
        this.cache = {
            latest: {
                request: null,
                response: null,
            },
            responses: {},
        };
    }

    registerListener(listener) {
        this.listeners.push(listener);
    }

    deregisterListener(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }

    sendEvent({
        paginationIsDisabled,
        pagination,
        results,
    }) {
        this.listeners.forEach(listener => typeof listener === 'function' && listener({
            paginationIsDisabled,
            pagination,
            results,
        }));
    }

    onSearchCompleted({ pagination, searchParams }) {
        const params = Object.assign({}, searchParams);
        this.trimCache(params.pageNumber);

        const pager = this.makePageHelper(pagination, params, this.cache);

        if (pager.shouldFetchAnyPages()) {
            this.sendEvent({
                paginationIsDisabled: true,
            });
            pager.fetchAdjacentPages().then(() => {
                this.sendEvent({
                    paginationIsDisabled: false,
                    pagination: this.cache.responses[params.pageNumber].pagination,
                });
            });
        }
    }

    makePageRequest(searchParams, pageNumber) {
        const requestBody = this.configureRequestBody(searchParams);

        return this.getResults(requestBody, pageNumber);
    }

    onPagesReady(responses, pageNumber) {
        const pagination = responses[pageNumber].pagination;
        this.sendEvent({
            paginationIsDisabled: false,
            pagination,
        });
    }

    trimCache(currentPageNumber) {
        // Delete any excess cached responses
        Object.keys(this.cache.responses).forEach((key) => {
            if (key < (currentPageNumber - VISIBLE_PAGINATION_BUTTONS) || key > (currentPageNumber + VISIBLE_PAGINATION_BUTTONS)) {
                delete this.cache.responses[key];
            }
        });
    }

    handleSearchResponse(parsedResponse, pageNumber) {
        let totalItems = parsedResponse.pageInfo.totalResults;
        if (parsedResponse.items.length < 10 && parsedResponse.nextPageToken) {
            totalItems = ((pageNumber - 1) * parsedResponse.pageInfo.resultsPerPage) + parsedResponse.items.length;
            Object.keys(this.cache.responses).forEach((pageNum) => {
                this.cache.responses[pageNum].pagination.totalItems = totalItems;
            });
        }

        const configuredResponse = {
            pagination: {
                itemsPerPage: parsedResponse.pageInfo.resultsPerPage,
                nextPageToken: parsedResponse.nextPageToken,
                prevPageToken: parsedResponse.prevPageToken,
                pageNumber,
                totalItems,
            },
            results: parsedResponse.items.map((item) => {
                const mappedItem = { ...item };
                mappedItem.key = item.id.videoId;
                return mappedItem;
            }),
        };

        this.cache.responses[pageNumber] = configuredResponse;
        this.cache.latest.response = configuredResponse;
        return configuredResponse;
    }

    getResults(requestBody, pageNumber) {
        if (this.cache.responses[pageNumber]) {
            return Promise.resolve(this.cache.responses[pageNumber]);
        }

        return buildApiRequest('GET', '/youtube/v3/search', requestBody)
            .then(response => this.handleSearchResponse(JSON.parse(response.body), pageNumber));
    }

    search(searchParams) {
        return new Promise((resolve, reject) => {
            if (!this.apiKey) {
                reject('Error:you-tube-service.js: An API key must be set before search method is called');
            }

            const isSearchStale = hasNewSearchParams(this.cache.latest.request, searchParams);

            this.cache.latest.request = { ...searchParams };

            if (!isSearchStale && this.cache.responses[searchParams.pageNumber]) {
                resolve(this.cache.responses[searchParams.pageNumber]);
                return;
            }

            this.cache.responses = {};
            const requestBody = this.configureRequestBody(searchParams);

            this.getResults(requestBody, searchParams.pageNumber).then((response) => {
                resolve(response);
            }).catch((errorResponse) => {
                this.resetCache();
                reject(errorResponse);
            });
        });
    }

    configureRequestBody(searchParams) {
        const requestBody = {
            key: this.apiKey,
            maxResults: searchParams.itemsPerPage,
            order: searchParams.orderBy,
            part: 'snippet',
            q: searchParams.searchText,
            type: 'video',
            relevanceLanguage: this.relevanceLanguage,
            pageToken: searchParams.pageToken,
        };

        switch (searchParams.lastUpdated) {
            case 'pastYear':
                requestBody.publishedAfter = moment().subtract(1, 'year').format().toString();
                break;
            case 'past3Months':
                requestBody.publishedAfter = moment().subtract(3, 'months').format().toString();
                break;
            default:
                break;
        }

        return requestBody;
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    setRelevanceLanguage(normalizedLocale) {
        let locale = normalizedLocale.includes('-') ? normalizedLocale.split('-')[0] : normalizedLocale;
        if (normalizedLocale === 'zh-tw') {
            locale = 'zh-Hant';
        }
        if (normalizedLocale === 'zh-cn') {
            locale = 'zh-Hans';
        }

        this.relevanceLanguage = locale;
    }

    setCache(cache) {
        if (this.isTesting) {
            this.cache = cache;
        } else {
            throw new Error('you-tube-service.js: This method is only allowed for testing');
        }
    }
}
