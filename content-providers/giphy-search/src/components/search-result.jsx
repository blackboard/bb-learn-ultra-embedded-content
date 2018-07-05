import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ButtonSecondary } from '../../../../library/react';

const SearchResult = ({ result, onContentSelect, translate }) => {
    const selectResult = selection => () => onContentSelect(selection);

    return (
        <div className="result-item">
            <div className="preview">
                <div className="screen-wide">
                    <img src={result.images.original.url} alt={result.title} />
                </div>
            </div>
            <div className="details">
                <div className="screen-narrow">
                    <img src={result.images.original.url} alt={result.title} />
                </div>
                <div className="title">
                    {result.title}
                </div>
                <div className="specifics">
                    <span>
                        {
                            translate('results.score', {
                                score: result._score, // eslint-disable-line no-underscore-dangle
                            })
                        }
                    </span>
                    <span>{translate('results.trendingDate', { date: moment(result.trending_datetime).format('l') })}</span>
                </div>
                <br />
                <div className="preview-text-container">
                    <p className="preview-text">
                        {`${translate('results.previewText')}`}
                    </p>
                    {<a
                        className="preview-link"
                        href={result.bitly_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {result.url}
                    </a>}
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
    onContentSelect: PropTypes.func,
    result: PropTypes.shape({
        id: PropTypes.string.isRequired,
        images: PropTypes.shape({
            original: PropTypes.shape({
                url: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
        title: PropTypes.string,
    }).isRequired,
    translate: PropTypes.func.isRequired,
};

SearchResult.defaultProps = {
    onContentSelect: null,
};

export default SearchResult;
