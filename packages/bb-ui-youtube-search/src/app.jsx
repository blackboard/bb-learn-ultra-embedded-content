import React from 'react';
import axios from 'axios';
import moment from 'moment';
import SearchResult from './components/search-result';
import translator from './services/translator';
import YouTubeService from './services/you-tube-service';
import EditItem from './components/edit-item';
import { MESSAGE_TYPES, SORT_FILTER_CONFIG, EMBED_URL_PREFIX, WORKFLOW_STATES } from './constants';
import {
    configureSearchContainer,
    ButtonSecondary,
    Spinner,
} from '../../bb-library-ui-components/react';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultLanguage: 'en',
            filterUnsuitableVideos: true,
            locale: 'en',
            selectedResponse: {},
            workflow: WORKFLOW_STATES.loading,
            youtubeApiKey: '',
            previouslyFocusedElement: null,
        };

        this.YouTubeService = new YouTubeService();
        this.searchContainer = configureSearchContainer(this.YouTubeService, SearchResult);
        this.translate = (key, params) => translator('en', key, params);
        this.origin = document.referrer ? new URL(document.referrer).origin : document.origin;

        this.getYouTubeConfig = this.getYouTubeConfig.bind(this);
        this.initSearch = this.initSearch.bind(this);
        this.returnToSearch = this.returnToSearch.bind(this);
        this.onContentSelect = this.onContentSelect.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.setCurrentLocale = this.setCurrentLocale.bind(this);
        this.getSearchPage = this.getSearchPage.bind(this);
        this.getEditPage = this.getEditPage.bind(this);
        this.focus = this.focus.bind(this);
    }

    componentWillMount() {
        window.addEventListener('message', this.receiveMessage, false);
    }

    componentDidMount() {
        this.postMessage({
            messageType: MESSAGE_TYPES.outgoing.pageLoaded,
        });
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.receiveMessage);
    }

    getYouTubeConfig(config) {
        axios({
            method: 'get',
            url: `${config.apiBasePath}/v1/mashups/youtube`,
            headers: {
                'X-Blackboard-XSRF': config.xsrfToken,
            },
        }).then((response) => {
            const initYouTubeApi = () => {
                gapi.client.init({ // eslint-disable-line no-undef
                    apiKey: response.data.options.apiKey,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
                }).then(() => {
                    this.initSearch(response.data.options.apiKey,
                        response.data.options.defaultLanguage,
                        response.data.options.filterUnsuitableVideos);
                });
            };
            gapi.load('client', initYouTubeApi); // eslint-disable-line no-undef
        }).catch((error) => {
            console.log(error); // eslint-disable-line no-console
        });
    }

    initSearch(apiKey, defaultLanguage, filterUnsuitableVideos) {
        this.YouTubeService.setApiKey(apiKey);
        this.setState({
            defaultLanguage,
            filterUnsuitableVideos,
            youtubeApiKey: apiKey,
            workflow: WORKFLOW_STATES.searching,
        }, this.focus);
    }

    returnToSearch() {
        this.setState({
            workflow: WORKFLOW_STATES.searching,
        }, this.focus);
    }

    focus() {
        if (this.state.previouslyFocusedElement) {
            this.state.previouslyFocusedElement.focus();
        } else {
            this.title.focus();
        }
    }

    postMessage(message) {
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
            this.getYouTubeConfig(event.data.config);
        }
    }

    setCurrentLocale(locale) {
        this.setState({ locale });
        moment.locale(locale);
        this.YouTubeService.setRelevanceLanguage(locale);
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
        const dataType = displayOptions.displayType === 'displayInline' ? 'video' : 'link';
        const response = this.state.selectedResponse;
        this.postMessage({
            dataContent: {
                alt: displayOptions.altText,
                src: `${EMBED_URL_PREFIX}${response.id.videoId}`,
                response,
            },
            dataType,
            messageType: MESSAGE_TYPES.outgoing.contentReady,
        });
    }

    getSearchPage() {
        const isEditing = this.state.workflow === WORKFLOW_STATES.editing;
        const ThirdPartySearchContainer = this.searchContainer;
        const defaultButtonText = this.translate('buttons.cancel');
        const searchingPageTitle = this.translate('search.title');

        let containerClassName = 'youtube-search-container';
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
            <div className="app-container">
                {this.getSearchPage()}
                {this.getEditPage()}
            </div>
        );
    }
}

export default App;
