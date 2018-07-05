import React from 'react';
import PropTypes from 'prop-types';
import { EMBED_URL_PREFIX } from '../constants';

export default class VideoPreview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            videoIsRendered: props.alwaysShowPreview,
        };

        this.onClickPreview = this.onClickPreview.bind(this);
    }

    onClickPreview(event) {
        event.preventDefault();

        this.setState({
            videoIsRendered: true,
        }, () => {
            if (this.frameEl) {
                this.frameEl.focus();
            }
        });
    }

    render() {
        const { alwaysShowPreview, className, result } = this.props;

        if (alwaysShowPreview || this.state.videoIsRendered) {
            return (
                <iframe
                    className={className}
                    title={result.snippet.title}
                    frameBorder="0"
                    ref={(el) => { this.frameEl = el; }}
                    src={`${EMBED_URL_PREFIX}${result.id.videoId}`}
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                    tabIndex="0"
                    allowFullScreen
                />
            );
        } else if (result.snippet.thumbnails && result.snippet.thumbnails.medium) {
            return (
                <a
                    className={className}
                    href={`https://www.youtube.com/watch?v=${result.id.videoId}`}
                    onClick={this.onClickPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img alt={result.snippet.title} src={result.snippet.thumbnails.medium.url} />
                </a>
            );
        }

        return null;
    }

}

VideoPreview.propTypes = {
    alwaysShowPreview: PropTypes.bool.isRequired,
    className: PropTypes.string.isRequired,
    result: PropTypes.shape({
        id: PropTypes.shape({
            videoId: PropTypes.string.isRequired,
        }).isRequired,
        snippet: PropTypes.shape({
            channelId: PropTypes.string.isRequired,
            channelTitle: PropTypes.string.isRequired,
            description: PropTypes.string,
            publishedAt: PropTypes.string.isRequired,
            thumbnails: PropTypes.shape(),
            title: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};
