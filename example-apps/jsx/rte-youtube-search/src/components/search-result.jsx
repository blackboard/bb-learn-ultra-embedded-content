import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ButtonSecondary } from 'bb-public-library/react-components';
import VideoPreview from './video-preview';

const SearchResult = ({ alwaysShowPreview, result, onContentSelect, translate }) => {
    const selectResult = selection => () => onContentSelect(selection);

    return (
        <div className="result-item">
            <div className="preview">
                <VideoPreview alwaysShowPreview={alwaysShowPreview} className="screen-wide" result={result} />
            </div>
            <div className="details">
                <VideoPreview alwaysShowPreview={alwaysShowPreview} className="screen-narrow" result={result} />
                <div className="title">
                    {result.snippet.title}
                </div>
                <div className="specifics">
                    {
                        result.snippet.channelTitle &&
                        <span>{translate('results.user', { user: result.snippet.channelTitle })}</span>
                    }
                    {
                        result.snippet.publishedAt &&
                        <span>{translate('results.publishedAt', { added: moment(result.snippet.publishedAt).format('l') })}</span>
                    }
                </div>
                <div className="summary">{result.snippet.description}</div>
                <br />
                <div className="preview-text-container">
                    <p className="preview-text">
                        {`${translate('results.previewText')}`}
                    </p>
                    <a
                        className="preview-link"
                        href={`https://www.youtube.com/watch?v=${result.id.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {`https://www.youtube.com/watch?v=${result.id.videoId}`}
                    </a>
                </div>
            </div>
            {
                !!onContentSelect &&
                <div className="actions">
                    <ButtonSecondary
                        className="select-button secondary text-grey-darkest py-2 px-4"
                        onClick={selectResult(result)}
                    >
                        {`${translate('buttons.select')}`}
                    </ButtonSecondary>
                </div>
            }
        </div>
    );
};

SearchResult.propTypes = {
    alwaysShowPreview: PropTypes.bool,
    onContentSelect: PropTypes.func,
    result: PropTypes.shape({
        id: PropTypes.shape({
            videoId: PropTypes.string.isRequired,
        }).isRequired,
        key: PropTypes.string.isRequired,
        snippet: PropTypes.shape({
            channelId: PropTypes.string.isRequired,
            channelTitle: PropTypes.string.isRequired,
            description: PropTypes.string,
            publishedAt: PropTypes.string.isRequired,
            thumbnails: PropTypes.shape(),
            title: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    translate: PropTypes.func.isRequired,
};

SearchResult.defaultProps = {
    alwaysShowPreview: false,
    onContentSelect: null,
};

export default SearchResult;
