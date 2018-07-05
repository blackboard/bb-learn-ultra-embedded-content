import React from 'react';
import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import { MESSAGE_TYPES, EMBED_URL_PREFIX, WORKFLOW_STATES } from '../constants';
import {
    ButtonSecondary,
    Spinner,
} from '../../../../library/react';
import translator from '../services/translator';
import GiphyService from '../services/giphy-service';

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            locale: 'en',
            searchResults: {
                data: [],
                pagination: {},
            },
            workflow: WORKFLOW_STATES.loading,
        };

        // Helper methods
        this.GiphyService = new GiphyService();
        this.origin = document.referrer ? new URL(document.referrer).origin : document.origin;
        this.translate = (key, params) => translator('en', key, params);

        // Method binding
        this.getGiphyMashupConfig = this.getGiphyMashupConfig.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.setCurrentLocale = this.setCurrentLocale.bind(this);
    }

    componentWillMount() {
        window.addEventListener('message', this.receiveMessage, false);
    }

    componentDidMount() {
        // Post a message to Bb Learn after the mashup UI renders
        this.postMessage({
            messageType: MESSAGE_TYPES.outgoing.pageLoaded,
        });
        // Let's mock the receiveMessage event by posting a message locally
        window.postMessage({
            config: {
                locale: 'en',
            },
            messageType: MESSAGE_TYPES.incoming.initContent,
        }, document.origin);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.receiveMessage);
    }

    getGiphyMashupConfig(config) {
        axios({
            method: 'get',
            url: `${config.apiBasePath}/v1/mashups/giphy`,
            headers: {
                'X-Blackboard-XSRF': config.xsrfToken,
            },
        }).then((response) => {
            this.GiphyService.setApiKey(response.data.options.apiKey);
            this.setState({
                locale: response.data.options.defaultLanguage,
                workflow: WORKFLOW_STATES.searching,
            });
        }).catch(() => {
            // Let's mock a response from the Learn backend
            this.GiphyService.setApiKey('keSYPWldgPh4xaQULuKATCjkEFIV0qRT');
            this.setState({
                locale: 'en',
                workflow: WORKFLOW_STATES.searching,
            });
            this.GiphyService.search({
                searchText: 'school',
                itemsPerPage: 10,
                pageNumber: 1,
            }).then((response) => {
                console.log('Giphy: ', response); // eslint-disable-line no-console
                this.setState({
                    searchResults: response.data,
                });
            }).catch((responseError) => {
                console.log(responseError); // eslint-disable-line no-console
            });
        });
    }

    postMessage(message) {
        console.log('Message posted: ', message); // eslint-disable-line no-console
        window.parent.postMessage(message, this.origin);
    }

    receiveMessage(event) {
        // This is a security measure to ensure that we only respond to messages
        // that originated from a parent/referrer that is the window embedding this iFrame
        if (this.origin !== event.origin) {
            return;
        }

        if (event.data.config && event.data.config.locale && (this.state.locale !== event.data.config.locale)) {
            this.setCurrentLocale(event.data.config.locale);
            this.translate = (key, params) => translator(event.data.config.locale, key, params);
        }

        if (event.data.messageType === MESSAGE_TYPES.incoming.initContent) {
            this.getGiphyMashupConfig(event.data.config);
        }
    }

    setCurrentLocale(locale) {
        this.setState({ locale });
        moment.locale(locale);
        this.GiphyService.setRelevanceLanguage(locale);
    }

    render() {
        const { title } = this.props;
        const { searchResults } = this.state;
        const isLoading = this.state.workflow === WORKFLOW_STATES.loading;
        const postMessageText = this.translate('buttons.postMessage');
        // Let's mock a message that we will send to Bb Learn when our content is created/selected
        const message = {
            dataContent: {
                src: EMBED_URL_PREFIX,
            },
            dataType: 'image',
            messageType: MESSAGE_TYPES.outgoing.contentReady,
        };
        const postMessageToLearn = contentMessage => () => this.postMessage(contentMessage);

        if (isLoading) {
            return (
                <div className="loading-container">
                    <Spinner isLoading={isLoading} size="xxlarge" />
                </div>
            );
        }
        return (
            <div className="app-container text-center" style={{ overflow: 'auto' }}>
                <h1>{title}</h1>
                <br />
                <ButtonSecondary onClick={postMessageToLearn(message)}>
                    {postMessageText}
                </ButtonSecondary>
                <br />
                <h3>Page Number: {searchResults.pagination.offset + 1}</h3>
                <h3>Items Per Page: {searchResults.pagination.count}</h3>
                <h3>Total Items: {searchResults.pagination.total_count}</h3>
                {
                    searchResults.data.map(result => (<div key={result.id}>
                        <img src={result.images.original.url} alt={result.title} />
                    </div>))
                }
            </div>
        );
    }
}

App.propTypes = {
    title: PropTypes.string.isRequired,
};
