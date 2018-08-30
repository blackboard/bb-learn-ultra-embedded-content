import React from 'react';
import PropTypes from 'prop-types';
import {
    ButtonSecondary,
    Spinner,
} from 'bb-public-library/react-components';
import { MESSAGE_TYPES, WORKFLOW_STATES } from '../constants';
import translator from '../services/translator';

export default class App extends React.Component {
    static alertMessage(message) {
        window.alert(message); // eslint-disable-line no-alert
    }

    constructor() {
        super();

        this.state = {
            locale: 'en',
            workflow: WORKFLOW_STATES.loading,
        };

        // Helper methods
        this.origin = document.referrer ? new URL(document.referrer).origin : document.origin;
        this.translate = (key, params) => translator('en', key, params);

        // Method binding
        this.getLTIConfig = this.getLTIConfig.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.setCurrentLocale = this.setCurrentLocale.bind(this);
    }

    componentWillMount() {
        window.addEventListener('message', this.receiveMessage, false);
    }

    componentDidMount() {
        // Post a message to Bb Learn after the LTI UI renders
        this.postMessage({
            messageType: MESSAGE_TYPES.outgoing.pageLoaded,
        });
        // Let's mock the receiveMessage event by posting a message locally
        // Delete the following lines before compiling app for production
        // window.postMessage({
        //     config: {
        //         locale: 'en',
        //     },
        //     messageType: MESSAGE_TYPES.incoming.initContent,
        // }, document.origin);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.receiveMessage);
    }

    getLTIConfig(config) {
        console.log('LTI config received: ', config); // eslint-disable-line no-console
        // NOTE: Use the LTI config to set up the API for search, localization, data modeling, etc.
        this.setState({
            workflow: WORKFLOW_STATES.editing,
        });
    }

    postMessage(message) {
        console.log('Message posted from LTI provider: ', message); // eslint-disable-line no-console
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
            this.getLTIConfig(event.data.config);
        }
    }

    setCurrentLocale(locale) {
        this.setState({ locale });
    }

    render() {
        const { title } = this.props;
        const isLoading = this.state.workflow === WORKFLOW_STATES.loading;
        const postMessageText = this.translate('buttons.sendAlert');
        // Let's mock a message that we will send to Bb Learn when our content is created/selected
        const message = this.translate('alert.congratulations');
        const displayAlertMessage = contentMessage => () => App.alertMessage(contentMessage);

        if (isLoading) {
            return (
                <div className="loading-container">
                    <Spinner isLoading={isLoading} size="xxlarge" />
                </div>
            );
        }
        return (
            <div className="app-container text-center">
                <h1>{title}</h1>
                <br />
                <ButtonSecondary onClick={displayAlertMessage(message)}>
                    {postMessageText}
                </ButtonSecondary>
            </div>
        );
    }
}

App.propTypes = {
    title: PropTypes.string.isRequired,
};
