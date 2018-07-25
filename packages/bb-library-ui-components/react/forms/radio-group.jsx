/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */

import React from 'react';
import PropTypes from 'prop-types';

class RadioGroup extends React.Component {
    constructor(props) {
        super(props);

        this.selectOption = this.selectOption.bind(this);
    }

    selectOption(event) {
        event.preventDefault();
        const key = this.props.name;
        const value = event.target.dataset.value;

        this.props.onSelect(key, value);
    }

    render() {
        const { options, value } = this.props;

        return (
            <div className="radio-group form-field">
                {
                    options.map(option =>
                        (<div key={option.value} className="radio-option">
                            <button
                                className="psuedo-label"
                                data-value={option.value}
                                onClick={this.selectOption}
                                type="button"
                            >
                                {option.text}
                            </button>
                            <label
                                className={option.value === value ? 'selected' : ''}
                                data-value={option.value}
                                htmlFor={option.value}
                                onClick={this.selectOption}
                            />
                        </div>),
                    )
                }
            </div>
        );
    }
}

RadioGroup.propTypes = {
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
        text: PropTypes.string.isRequired,
    })).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
};

export default RadioGroup;
