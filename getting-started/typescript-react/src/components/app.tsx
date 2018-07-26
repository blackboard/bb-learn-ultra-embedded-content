import * as React from 'react';
import { MESSAGE_TYPES, EMBED_URL_PREFIX, WORKFLOW_STATES } from '../constants';
import {
    ButtonSecondary,
    Spinner,
} from '../../../../bb-public-library/react-components/lib/index.js';
import translator from '../services/translator';

declare global {
    interface Document { origin: string; } // tslint:disable-line:interface-name
}

interface IApp {
    getMashupConfig: any;
}

interface IProps {
    title: string;
}

interface IState {
    locale: string;
    workflow: string;
}

export default class App extends React.Component<IProps, IState> implements IApp {
    private origin: string;
    private translate: Function;

    constructor(props: IProps, context?: any) {
        super(props, context);

        this.state = {
            locale: 'en',
            workflow: WORKFLOW_STATES.loading,
        };

        // Helper methods
        this.origin = document.referrer ? new URL(document.referrer).origin : document.origin;
        this.translate = (key: string, params: object) => translator('en', key, params);

        // Method binding
        this.getMashupConfig = this.getMashupConfig.bind(this);
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

    getMashupConfig(config: any) {
        console.log('Mashup config received: ', config); // tslint:disable-line:no-console
        // NOTE: Use the mashup config to set up the API for search, localization, data modeling, etc.
        this.setState({
            workflow: WORKFLOW_STATES.editing,
        });
    }

    postMessage(message: any) {
        console.log('Message posted: ', message); // tslint:disable-line:no-console
        window.parent.postMessage(message, this.origin);
    }

    receiveMessage(event: MessageEvent) {
        // This is a security measure to ensure that we only respond to messages
        // that originated from a parent/referrer that is the window embedding this iFrame
        if (this.origin !== event.origin) {
            return;
        }

        if (event.data.config && event.data.config.locale && (this.state.locale !== event.data.config.locale)) {
            this.setCurrentLocale(event.data.config.locale);
            this.translate = (key: string, params: object) => translator(event.data.config.locale, key, params);
        }

        if (event.data.messageType === MESSAGE_TYPES.incoming.initContent) {
            this.getMashupConfig(event.data.config);
        }
    }

    setCurrentLocale(locale: string) {
        this.setState({ locale });
    }

    render() {
        const { title } = this.props;
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
        const postMessageToLearn = ( contentMessage: object ) => () => this.postMessage(contentMessage);

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
                <ButtonSecondary onClick={postMessageToLearn(message)}>
                    {postMessageText}
                </ButtonSecondary>
            </div>
        );
    }
}
