import React from 'react';
import PropTypes from 'prop-types';
import './styles/spinner.scss';

const Spinner = ({ ariaLive, ariaRole, isLoading, size, statusMessage }) => {
    if (isLoading) {
        return (
            <div className="spinner">
                <div className={`circle ${size}`} />
                <div
                    aria-live={ariaLive}
                    className="status-message"
                    role={ariaRole}
                >
                    { statusMessage }
                </div>
            </div>
        );
    }

    return null;
};

Spinner.propTypes = {
    ariaLive: PropTypes.oneOf(['polite', 'assertive']),
    ariaRole: PropTypes.string,
    isLoading: PropTypes.bool,
    size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge']),
    statusMessage: PropTypes.string,
};

Spinner.defaultProps = {
    ariaLive: 'polite',
    ariaRole: 'status',
    isLoading: false,
    size: 'small',
    statusMessage: null,
};

export default Spinner;
