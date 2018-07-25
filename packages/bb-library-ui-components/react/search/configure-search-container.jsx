import React from 'react';
import PropTypes from 'prop-types';
import configureSearchResults from './configure-search-results';
import SearchFieldsContainer from './search-fields-container';
import pickDefinedValues from '../../../bb-library-utilities/main/pick-defined-values';
import { PaginationControls } from '../';

const DEFAULT_SEARCH_PARAMS = {
    itemsPerPage: 10,
    pageNumber: 1,
    searchText: '',
};

export default function configureSearchContainer(Service, SearchResult) {
    class ThirdPartySearchContainer extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                pagination: {
                    itemsPerPage: 10,
                    pageNumber: 1,
                    totalItems: 0, // This is really just a placeholder starting at 0
                },
                paginationIsDisabled: false,
                results: [],
                isFirstSearch: true,
                displayedSearchText: DEFAULT_SEARCH_PARAMS.searchText,
            };

            this.handlePageChange = this.handlePageChange.bind(this);
            this.updateSearchParams = this.updateSearchParams.bind(this);
            this.updateResults = this.updateResults.bind(this);
            this.onResultsChange = this.onResultsChange.bind(this);
            Service.registerListener(this.onResultsChange);

            this.searchParams = DEFAULT_SEARCH_PARAMS;
            this.searchResults = configureSearchResults(SearchResult);
        }

        componentWillUnmount() {
            Service.deregisterListener(this.onResultsChange);
        }

        onResultsChange({
            paginationIsDisabled,
            pagination,
            results,
        }) {
            this.setState(pickDefinedValues({
                paginationIsDisabled,
                pagination,
                results,
            }));
        }

        focus() {
            this.searchInput.focus();
        }

        updateResults() {
            return Service.search(this.searchParams).then((response) => {
                this.setState({
                    isFirstSearch: false,
                    pagination: response.pagination,
                    results: response.results,
                    displayedSearchText: this.searchParams.searchText,
                }, () => Service.onSearchCompleted({ pagination: response.pagination, searchParams: this.searchParams }));
            }).catch((error) => {
                console.log(error); // eslint-disable-line no-console
                // TODO: Display a proper error message
            });
        }

        updateSearchParams(params) {
            this.searchParams = Object.assign(this.searchParams, params);
        }

        handlePageChange(event, pageNumber) {
            event.preventDefault();

            if (pageNumber !== this.state.pagination.pageNumber) {
                this.updateSearchParams({
                    pageNumber,
                    itemsPerPage: this.state.pagination.itemsPerPage,
                });
                this.updateResults();
                const pagination = Object.assign({}, this.state.pagination, { pageNumber });
                this.setState({ pagination });
            }
        }

        render() {
            const { isFirstSearch, pagination, results } = this.state;
            const { autoComplete, onContentSelect, sortFilterConfig, translate } = this.props;
            const SearchResults = this.searchResults;
            return (
                <div className="third-party-search-container">
                    <SearchFieldsContainer
                        autoComplete={autoComplete}
                        searchContent={this.updateResults}
                        translate={translate}
                        disabled={this.state.paginationIsDisabled}
                        sortFilterConfig={sortFilterConfig}
                        updateSearchParams={this.updateSearchParams}
                        displayedSearchText={this.state.displayedSearchText}
                    />
                    <SearchResults
                        pagination={pagination}
                        results={results}
                        onContentSelect={onContentSelect}
                        translate={translate}
                        isFirstSearch={isFirstSearch}
                    />
                    <PaginationControls
                        hideFirstLastButtons
                        pagination={pagination}
                        disabled={this.state.paginationIsDisabled}
                        translate={translate}
                        handlePageChange={this.handlePageChange}
                    />
                </div>
            );
        }
    }

    ThirdPartySearchContainer.propTypes = {
        autoComplete: PropTypes.oneOf(['off', 'on']),
        onContentSelect: PropTypes.func.isRequired,
        sortFilterConfig: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            defaultSelectedValue: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.shape({
                value: PropTypes.string.isRequired,
                text: PropTypes.string.isRequired,
            })).isRequired,
        })),
        translate: PropTypes.func.isRequired,
    };

    ThirdPartySearchContainer.defaultProps = {
        autoComplete: 'off',
        sortFilterConfig: [],
    };

    return ThirdPartySearchContainer;
}
