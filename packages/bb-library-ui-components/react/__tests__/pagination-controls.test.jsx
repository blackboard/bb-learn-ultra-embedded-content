import React from 'react';
import { shallow } from 'enzyme';
import PaginationControls from '../pagination-controls';

describe('PaginationControls', () => {
    const mockTranslate = key => key;
    const mockHandlePageChange = jest.fn();

    const getPaginationWrapper = mockPagination => shallow(
        <PaginationControls
            handlePageChange={mockHandlePageChange}
            pagination={mockPagination}
            translate={mockTranslate}
        />,
    );

    it('display correct number of buttons', () => {
        const wrapper = getPaginationWrapper({
            pageNumber: 1,
            itemsPerPage: 10,
            totalItems: 30,
        });
        const totalPageNumberButtons = wrapper.findWhere(n => n.hasClass('page-button'));
        expect(totalPageNumberButtons.length).toBe(3);
    });
});
