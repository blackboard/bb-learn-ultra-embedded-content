import axios from 'axios';

export default class GiphyService {
    constructor() {
        this.apiKey = '';
        this.listeners = [];
        this.relevanceLanguage = 'en';

        this.search = this.search.bind(this);
        this.sendEvent = this.sendEvent.bind(this);
        this.setApiKey = this.setApiKey.bind(this);
        this.setRelevanceLanguage = this.setRelevanceLanguage.bind(this);
        this.registerListener = this.registerListener.bind(this);
        this.deregisterListener = this.deregisterListener.bind(this);
        this.onSearchCompleted = this.onSearchCompleted.bind(this);
    }

    registerListener(listener) {
        this.listeners.push(listener);
    }

    deregisterListener(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    search(searchParams) {
        return new Promise((resolve, reject) => {
            if (!this.apiKey) {
                reject('Error:giphy-service.js: An API key must be set before search method is called');
            }

            const params = {
                api_key: this.apiKey,
                q: searchParams.searchText,
                lang: this.relevanceLanguage,
                limit: searchParams.itemsPerPage,
                offset: (searchParams.pageNumber - 1) * searchParams.itemsPerPage,
                rating: 'g',
            };

            axios({
                method: 'get',
                url: 'https://api.giphy.com/v1/gifs/search',
                params,
            }).then((response) => {
                const configuredResponse = {
                    pagination: {
                        pageNumber: searchParams.pageNumber,
                        itemsPerPage: searchParams.itemsPerPage,
                        totalItems: response.data.pagination.total_count,
                    },
                    results: response.data.data.map(item => Object.assign(item, {
                        key: item.id,
                    })),
                };
                resolve(configuredResponse);
            }).catch((errorResponse) => {
                reject(errorResponse);
            });
        });
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

    onSearchCompleted({ pagination }) {
        this.sendEvent({
            pagination,
            paginationIsDisabled: false,
        });
    }

    setRelevanceLanguage(normalizedLocale) {
        let locale = normalizedLocale.includes('-') ? normalizedLocale.split('-')[0] : normalizedLocale;
        if (normalizedLocale === 'zh-tw') {
            locale = 'zh-TW';
        } else if (normalizedLocale === 'zh-cn') {
            locale = 'zh-CN';
        } else {
            locale = normalizedLocale.substring(0, 2);
        }

        this.relevanceLanguage = locale;
    }
}
