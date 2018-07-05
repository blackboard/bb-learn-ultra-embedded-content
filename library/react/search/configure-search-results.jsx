/* eslint react/no-array-index-key: 0 */

import React from 'react';
import PropTypes from 'prop-types';

export default function configureSearchResults(SearchResult) {
    const SearchResults = (props) => {
        const { isFirstSearch, results, onContentSelect, translate } = props;
        const initialMessage = translate('search.resultOrderMessage');

        return (
            <div className="search-results-container px-4">
                {
                    isFirstSearch ?
                        <div className="initial-message"><p>_</p><p>{initialMessage}</p><p>_</p></div> :
                    !results.length &&
                        <div className="no-results">{translate('search.noResults')}</div>
                }
                {
                    results.map(result => (
                        <SearchResult
                            key={result.key}
                            result={result}
                            onContentSelect={onContentSelect}
                            translate={translate}
                        />
                    ))
                }
            </div>
        );
    };

    SearchResults.propTypes = {
        isFirstSearch: PropTypes.bool.isRequired,
        results: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
        })),
        onContentSelect: PropTypes.func.isRequired,
        translate: PropTypes.func.isRequired,
    };

    SearchResults.defaultProps = {
        results: [],
    };

    return SearchResults;
}
