import React from 'react';
import PropTypes from 'prop-types';
import { ButtonSecondary, SearchBox, SelectBox } from '../';

export default class SearchFieldsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.initialState = {
            searchText: '',
        };

        const modifiedSearchParams = {};

        props.sortFilterConfig.forEach((group) => {
            this.initialState[group.name] = group.defaultSelectedValue || group.options[0].value;
            modifiedSearchParams[group.name] = group.defaultSelectedValue || group.options[0].value;
        });

        props.updateSearchParams(modifiedSearchParams);

        this.state = this.initialState;

        this.getSearchResults = this.getSearchResults.bind(this);
        this.handleDropDownSelect = this.handleDropDownSelect.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onSearchTextChange = this.onSearchTextChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            searchText: nextProps.displayedSearchText,
        });
    }

    getSearchResults() {
        this.props.updateSearchParams({
            pageNumber: 1,
            searchText: this.state.searchText,
        });
        this.props.searchContent();
    }

    handleDropDownSelect(key, value) {
        this.props.updateSearchParams({
            pageNumber: 1,
            [key]: value,
        });
        this.setState({
            [key]: value,
        });
        this.props.searchContent();
    }

    onEnter() {
        this.getSearchResults();
    }

    onSearchTextChange(key, value) {
        this.setState({
            searchText: value,
        });
    }

    render() {
        const { autoComplete, isTesting, sortFilterConfig, translate, disabled } = this.props;
        const onDropDownChange = key => value => this.handleDropDownSelect(key, value);

        return (
            <div className="search-fields-container">
                <div className="search-input-box">
                    <SearchBox
                        autoComplete={autoComplete}
                        disabled={disabled}
                        ariaLabel={translate('search.searchBoxAriaLabel')}
                        id="contentSearchInput"
                        labelText={translate('search.placeholderSearchText')}
                        name="contentSearchInput"
                        onChange={this.onSearchTextChange}
                        onSearch={this.onEnter}
                        translate={translate}
                        value={this.state.searchText}
                    />
                    <ButtonSecondary
                        onClick={this.getSearchResults}
                        disabled={disabled}
                    >
                        {translate('buttons.search')}
                    </ButtonSecondary>
                </div>
                {
                    sortFilterConfig.length > 0 &&
                    <div className="search-filters px-4">
                        <span className="filter-label">{translate('search.sortFilterGroupsLabel')}</span>
                            {
                                sortFilterConfig.map(group => (
                                    <span key={group.name}>
                                        <SelectBox
                                            id={group.name}
                                            disabled={disabled}
                                            isTesting={isTesting}
                                            onChange={onDropDownChange(group.name)}
                                            options={group.options}
                                            translate={translate}
                                            value={this.state[group.name]}
                                        />
                                    </span>
                                ))
                            }
                    </div>
                }
            </div>
        );
    }
}

SearchFieldsContainer.propTypes = {
    autoComplete: PropTypes.oneOf(['off', 'on']),
    isTesting: PropTypes.bool,
    searchContent: PropTypes.func.isRequired,
    sortFilterConfig: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        defaultSelectedValue: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
        })).isRequired,
    })),
    translate: PropTypes.func.isRequired,
    updateSearchParams: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    displayedSearchText: PropTypes.string,
};

SearchFieldsContainer.defaultProps = {
    autoComplete: 'off',
    isTesting: false,
    sortFilterConfig: [],
    disabled: false,
    displayedSearchText: '',
};
