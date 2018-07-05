import axios from 'axios';

export default class GiphyService {
    constructor() {
        this.apiKey = '';
        this.listeners = [];
        this.relevanceLanguage = 'en';

        this.search = this.search.bind(this);
        this.setApiKey = this.setApiKey.bind(this);
        this.setRelevanceLanguage = this.setRelevanceLanguage.bind(this);
        this.registerListener = this.registerListener.bind(this);
        this.deregisterListener = this.deregisterListener.bind(this);
    }

    registerListener(listener) {
        this.listeners.push(listener);
    }

    deregisterListener(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }

    setApiKey(key) {
        console.log('API Key set...Whoop whoop!!!'); // eslint-disable-line no-console
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
                limit: searchParams.itemsPerPage,
                offset: searchParams.pageNumber - 1,
                lang: this.relevanceLanguage,
            };

            if (searchParams.ratingFilter) {
                params.rating = searchParams.ratingFilter;
            }

            axios({
                method: 'get',
                url: 'https://api.giphy.com/v1/gifs/search',
                params,
            }).then((response) => {
                resolve(response);
            }).catch((errorResponse) => {
                reject(errorResponse);
            });
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
