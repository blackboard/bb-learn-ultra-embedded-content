import React from 'react';
import axios from 'axios';
import moment from 'moment';
import EditItem from './edit-item';
import SearchResult from './search-result';
import { MESSAGE_TYPES, SORT_FILTER_CONFIG, WORKFLOW_STATES } from '../constants';
import {
    configureSearchContainer,
    ButtonSecondary,
    Spinner,
} from '../../../../../bb-public-library/react-components/lib';
import translator from '../services/translator';
import GiphyService from '../services/giphy-service';

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            locale: 'en',
            previouslyFocusedElement: null,
            searchResults: {
                data: [],
                pagination: {},
            },
            selectedResponse: {},
            workflow: WORKFLOW_STATES.loading,
        };

        // Helper methods
        this.GiphyService = new GiphyService();
        this.searchContainer = configureSearchContainer(this.GiphyService, SearchResult);
        this.origin = document.referrer ? new URL(document.referrer).origin : document.origin;
        this.translate = (key, params) => translator('en', key, params);

        // Method binding
        this.focus = this.focus.bind(this);
        this.getGiphyMashupConfig = this.getGiphyMashupConfig.bind(this);
        this.getSearchPage = this.getSearchPage.bind(this);
        this.onContentSelect = this.onContentSelect.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.returnToSearch = this.returnToSearch.bind(this);
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

    focus() {
        if (this.state.previouslyFocusedElement) {
            this.state.previouslyFocusedElement.focus();
        } else {
            this.title.focus();
        }
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
            }, this.focus);
        }).catch(() => {
            // Let's mock a response from the Learn backend
            this.GiphyService.setApiKey('keSYPWldgPh4xaQULuKATCjkEFIV0qRT');
            this.setState({
                locale: 'en',
                workflow: WORKFLOW_STATES.searching,
            });
        }, this.focus);
    }

    onContentSelect(response) {
        this.setState({
            previouslyFocusedElement: document.activeElement,
            selectedResponse: response,
            workflow: WORKFLOW_STATES.editing,
        });
    }

    onDismiss() {
        this.postMessage({
            messageType: MESSAGE_TYPES.outgoing.canceled,
        });
    }

    onSubmit(displayOptions) {
        const dataType = displayOptions.displayType === 'displayInline' ? 'image' : 'link';
        const response = this.state.selectedResponse;
        const message = {
            dataContent: {
                alt: displayOptions.altText,
                src: response.images.original.url,
            },
            dataType,
            messageType: MESSAGE_TYPES.outgoing.contentReady,
        };
        this.postMessage(message);
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

    returnToSearch() {
        this.setState({
            workflow: WORKFLOW_STATES.searching,
        }, this.focus);
    }

    setCurrentLocale(locale) {
        this.setState({ locale });
        moment.locale(locale);
        this.GiphyService.setRelevanceLanguage(locale);
    }

    getEditPage() {
        const { selectedResponse, workflow } = this.state;
        const isEditing = workflow === WORKFLOW_STATES.editing;

        if (isEditing) {
            return (
                <EditItem
                    goBack={this.returnToSearch}
                    onCancel={this.onDismiss}
                    onSubmit={this.onSubmit}
                    previewAttrs={selectedResponse}
                    translate={this.translate}
                />
            );
        }
        return null;
    }

    getSearchPage() {
        const isEditing = this.state.workflow === WORKFLOW_STATES.editing;
        const ThirdPartySearchContainer = this.searchContainer;
        const defaultButtonText = this.translate('buttons.cancel');
        const searchingPageTitle = this.translate('search.title');

        let containerClassName = 'giphy-search-container';
        if (isEditing) {
            containerClassName += ' hidden';
        }

        return (
            <div className={containerClassName}>
                <div className="main-content pt-2">
                    <h1 tabIndex="-1" className="px-4 my-2" ref={(el) => { this.title = el; }}>{searchingPageTitle}</h1>
                    <ThirdPartySearchContainer
                        onContentSelect={this.onContentSelect}
                        translate={this.translate}
                        sortFilterConfig={SORT_FILTER_CONFIG}
                    />
                </div>
                <div className="footer-content text-right mt-4 py-3 px-4 border-t-2 border-grey-lighter">
                    <ButtonSecondary onClick={this.onDismiss}>
                        {defaultButtonText}
                    </ButtonSecondary>
                </div>
            </div>
        );
    }

    render() {
        const isLoading = this.state.workflow === WORKFLOW_STATES.loading;

        if (isLoading) {
            return (
                <div className="loading-container">
                    <Spinner isLoading={isLoading} size="xxlarge" />
                </div>
            );
        }
        return (
            <div className="app-container" style={{ overflow: 'auto' }}>
                {this.getEditPage()}
                {this.getSearchPage()}
            </div>
        );
    }
}
