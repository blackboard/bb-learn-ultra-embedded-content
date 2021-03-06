/* eslint react/self-closing-comp: 0 */
/* eslint react/no-array-index-key: 0 */

// NOTE: This is designed to work with an async service that serves paginated
// results from the server side. It is NOT a client side pagination solution.

import React from 'react';
import PropTypes from 'prop-types';
import 'bb-public-library/styles/icons.scss';
import 'bb-public-library/styles/pagination.scss';
import { calculatePages } from '../../utilities/lib';

const PaginationControls = ({ disabled, hideFirstLastButtons, pagination, translate, handlePageChange, showResultsCount }) => {
    const { pagesList, totalPages } = calculatePages(pagination);
    const currentPage = pagination.pageNumber;
    const configurePageChange = pageNumber => event => handlePageChange(event, pageNumber);
    const pagingInfo = translate('pagination.pagingInfo', {
        firstItem: (currentPage * pagination.itemsPerPage) - (pagination.itemsPerPage - 1),
        lastItem: currentPage * pagination.itemsPerPage > pagination.totalItems ?
            pagination.totalItems :
            currentPage * pagination.itemsPerPage,
        totalItems: pagination.totalItems,
    });

    if (totalPages < 1) {
        return null;
    }

    return (
        <div className="pagination-controls px-4">
            <div className="pages-info">
                {showResultsCount && pagingInfo}
            </div>
            <div className="controls-list">
                {
                    !hideFirstLastButtons &&
                    <button
                        className="page-button-start"
                        disabled={disabled}
                        onClick={configurePageChange(1)}
                        type="button"
                    >
                        {'<<'}
                    </button>
                }
                <button
                    className="page-button-back icon-medium back-arrow"
                    aria-label={translate('pagination.ariaPreviousPage')}
                    disabled={disabled}
                    onClick={configurePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                    type="button"
                >
                </button>
                {
                    pagesList.map((button, i) =>
                        (<button
                            key={i}
                            className={button.pageNumber === currentPage ? 'page-button active' : 'page-button'}
                            disabled={disabled}
                            onClick={configurePageChange(button.pageNumber)}
                            type="button"
                        >
                            {button.pageNumber}
                        </button>) // eslint-disable-line comma-dangle
                    )
                }
                <button
                    className="page-button-forward icon-medium forward-arrow"
                    aria-label={translate('pagination.ariaNextPage')}
                    disabled={disabled}
                    onClick={configurePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    type="button"
                >
                </button>
                {
                    !hideFirstLastButtons &&
                    <button
                        className="page-button-end"
                        disabled={disabled}
                        onClick={configurePageChange(totalPages)}
                        type="button"
                    >
                        {'>>'}
                    </button>
                }
            </div>
        </div>
    );
};

PaginationControls.propTypes = {
    disabled: PropTypes.bool,
    pagination: PropTypes.shape({
        pageNumber: PropTypes.number.isRequired,
        itemsPerPage: PropTypes.number.isRequired,
        totalItems: PropTypes.number.isRequired,
    }).isRequired,
    translate: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    hideFirstLastButtons: PropTypes.bool,
    showResultsCount: PropTypes.bool,
};

PaginationControls.defaultProps = {
    disabled: false,
    hideFirstLastButtons: false,
    showResultsCount: false,
};

export default PaginationControls;
