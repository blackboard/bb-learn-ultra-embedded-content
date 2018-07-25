import React from 'react';
import PropTypes from 'prop-types';

const ButtonSecondary = ({ children, className, disabled, onClick }) => (
    <button className={className} onClick={onClick} type="button" disabled={disabled}>
        {children}
    </button>
);

ButtonSecondary.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

ButtonSecondary.defaultProps = {
    className: 'secondary text-grey-darkest py-2 px-4',
    disabled: false,
};

export default ButtonSecondary;
