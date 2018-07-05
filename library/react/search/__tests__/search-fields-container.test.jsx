import React from 'react';
import { mount } from 'enzyme';
import { SelectBox } from '../../';
import SearchFieldsContainer from '../search-fields-container';
import TEST_SORT_FILTER_CONFIG from '../test-constants/testSortFilterConfig';

describe('SearchFieldsContainer', () => {
    let wrapper;
    const mockTranslate = jest.fn(key => key);
    const mockUpdateSearchParams = jest.fn();
    const mockSearchContent = jest.fn();

    beforeEach(() => {
        wrapper = mount(
            <SearchFieldsContainer
                isTesting
                searchContent={mockSearchContent}
                sortFilterConfig={TEST_SORT_FILTER_CONFIG}
                translate={mockTranslate}
                updateSearchParams={mockUpdateSearchParams}
            />,
        );
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    const verifySelectOptions = (selectBoxes, index) => {
        expect(selectBoxes.at(index).find('.option-container').everyWhere((el, idx) => {
            const props = el.children().at(0).getElement().props;
            const text = TEST_SORT_FILTER_CONFIG[index].options[idx].text;
            return props['data-text'] === text &&
            props.children === text;
        })).toEqual(true);
    };

    it('displays the correct select options from sortFilterConfig', () => {
        const selectBoxes = wrapper.find(SelectBox);
        expect(selectBoxes.length).toBe(TEST_SORT_FILTER_CONFIG.length);

        verifySelectOptions(selectBoxes, 0);
        verifySelectOptions(selectBoxes, 1);

        wrapper.setProps({
            sortFilterConfig: [],
        });

        expect(wrapper.find(SelectBox).length).toBe(0);
    });

    it('resets search to page 1 and auto-searches when SelectBox option is selected', () => {
        wrapper.instance().handleDropDownSelect(TEST_SORT_FILTER_CONFIG[0].name, TEST_SORT_FILTER_CONFIG[0].defaultSelectedValue);
        expect(wrapper.props().updateSearchParams).toHaveBeenCalledTimes(1);
        expect(wrapper.props().updateSearchParams).toHaveBeenLastCalledWith({
            pageNumber: 1,
            [TEST_SORT_FILTER_CONFIG[0].name]: TEST_SORT_FILTER_CONFIG[0].defaultSelectedValue,
        });
        expect(wrapper.prop('searchContent')).toBeCalled();
    });

    it('resets search to page 1 and updates the search text param when getSearchResults is called', () => {
        const searchValue = 'Test Input Text';
        wrapper.setState({ searchText: searchValue });
        wrapper.instance().getSearchResults();
        expect(mockUpdateSearchParams).toHaveBeenCalledTimes(1);
        expect(mockUpdateSearchParams).toHaveBeenLastCalledWith({
            pageNumber: 1,
            searchText: searchValue,
        });
    });

    it('updates the state on search input change but does not update the api search params', () => {
        const searchValue = 'Test Input Text';
        wrapper.instance().onSearchTextChange('contentSearchInput', searchValue);
        expect(wrapper.state().searchText).toBe(searchValue);
        expect(mockUpdateSearchParams).not.toHaveBeenCalled();
    });

    it('disables the search box and button when the disabled prop is passed', () => {
        wrapper.setProps({ disabled: true });
        wrapper.update();

        expect(wrapper.find('SearchBox').prop('disabled')).toBe(true);
        expect(wrapper.find('ButtonSecondary').prop('disabled')).toBe(true);
        expect(wrapper.find('SelectBox').map(node => node.prop('disabled'))).toEqual([true, true]);
    });

    it('enables the search box and button by default', () => {
        expect(wrapper.find('SearchBox').prop('disabled')).toBe(false);
        expect(wrapper.find('ButtonSecondary').prop('disabled')).toBe(false);
        expect(wrapper.find('SelectBox').map(node => node.prop('disabled'))).toEqual([false, false]);
    });

    it('updates SearchBox text based on the current displayed search text prop', () => {
        const displayedSearchText = 'Utahraptor input';
        wrapper.setProps({
            displayedSearchText,
        });
        wrapper.update();

        expect(wrapper.find('SearchBox').prop('value')).toBe(displayedSearchText);
    });
});
