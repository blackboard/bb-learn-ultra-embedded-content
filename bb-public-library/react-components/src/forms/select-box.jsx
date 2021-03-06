/* eslint max-len: 0 */
/* eslint eqeqeq: 0 */
/* eslint jsx-a11y/interactive-supports-focus: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import KeyCode from 'key-code';
import classNames from 'classnames';

const SELECTION_KEYS = [KeyCode.ENTER, KeyCode.SPACE];

class SelectBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            axIndex: 0,
            optionsAreVisible: false,
            isInValid: true,
            isTouched: false,
        };

        this.handleArrowKey = this.handleArrowKey.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.toggleSelectionVisibility = this.toggleSelectionVisibility.bind(this);
        this.updateValidations = this.updateValidations.bind(this);
    }

    componentWillMount() {
        document.addEventListener('click', this.handlePageClick);
    }

    componentDidMount() {
        this.updateValidations(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value || this.props.required !== nextProps.required) {
            this.updateValidations(nextProps);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handlePageClick);
    }

    handleArrowKey(change) {
        const { options } = this.props;
        const prevAxIndex = this.state.axIndex;
        let axIndex = 0;
        if (prevAxIndex + change > options.length - 1) {
            axIndex = 0;
        } else if (prevAxIndex + change < 0) {
            axIndex = options.length - 1;
        } else {
            axIndex = prevAxIndex + change;
        }
        this.setState({
            axIndex,
        });
    }

    handleKeyDown(event) {
        if (!this.props.disabled) {
            const pressedKey = event.keyCode;
            if (pressedKey === KeyCode.TAB) {
                if (this.state.optionsAreVisible) {
                    this.toggleSelectionVisibility();
                }
                return;
            }
            event.preventDefault();
            if (this.state.optionsAreVisible) {
                if (pressedKey === KeyCode.UP) {
                    this.handleArrowKey(-1);
                } else if (pressedKey === KeyCode.DOWN) {
                    this.handleArrowKey(1);
                } else if (pressedKey === KeyCode.ESC) {
                    this.toggleSelectionVisibility();
                } else if (SELECTION_KEYS.includes(pressedKey)) {
                    this.props.onChange(this.props.options[this.state.axIndex].value);
                    this.setState({
                        axIndex: this.state.axIndex,
                        optionsAreVisible: false,
                    });
                }
            } else if (SELECTION_KEYS.includes(pressedKey)) {
                this.toggleSelectionVisibility();
            }
        }
    }

    handlePageClick(event) {
        if (event.target !== this.buttonElement) {
            this.setState({
                optionsAreVisible: false,
            });
        }
    }

    handleSelectionChange(event) {
        event.preventDefault();
        if (!this.props.disabled) {
            const selection = this.props.options[event.target.dataset.index];
            this.props.onChange(selection.value);
        }
    }

    onFocus() {
        this.setState({
            isTouched: true,
        });
    }

    toggleSelectionVisibility() {
        const { disabled, options, value } = this.props;

        if (!disabled) {
            let axIndex = options.findIndex(option => option.value === value);
            axIndex = axIndex === -1 ? 0 : axIndex;

            this.setState({
                axIndex,
                optionsAreVisible: !this.state.optionsAreVisible,
            });
        }
    }

    updateValidations(props) {
        const { onValidate, translate } = this.props;

        this.setState({
            isInValid: props.required && (!props.value && props.value !== false),
        });
        if (onValidate) {
            onValidate({
                [props.id]: translate('validations.isRequired'),
            });
        }
    }

    render() {
        const { className, disabled, id, isTesting, options, placeHolderText, required, translate, value } = this.props;
        const { axIndex, isInValid, isTouched, optionsAreVisible } = this.state;
        const selectedOption = options.find(option => option.value === value);
        const selectedText = translate(selectedOption.text);
        const mainClasses = classNames({
            active: optionsAreVisible,
            disabled,
            'is-invalid': isInValid,
            'is-valid': !isInValid && required,
            'is-touched': isTouched,
            'select-box': true,
        });

        const buttonClasses = classNames({
            'arrow-down': true,
            'icon-xsmall': true,
        });

        return (
            <div className="form-field">
                <div className={`${mainClasses} ${className}`}>
                    <button
                        className={buttonClasses}
                        id={id}
                        ref={(el) => { this.buttonElement = el; }}
                        onClick={this.toggleSelectionVisibility}
                        onFocus={this.onFocus}
                        onKeyDown={this.handleKeyDown}
                        disabled={disabled}
                    >
                        {selectedText || placeHolderText}
                    </button>
                    {
                        (optionsAreVisible || isTesting) &&
                        <ul role="listbox" className="options-list">
                            {
                                options.map((option, index) => {
                                    const isSelected = option.value === value;
                                    const classList = classNames({
                                        'ax-active': index == axIndex,
                                        'option-container': true,
                                        selected: isSelected,
                                    });

                                    return (
                                        <li
                                            key={option.value}
                                            className={classList}
                                            role="presentation"
                                        >
                                            <a
                                                onClick={this.handleSelectionChange}
                                                role="option"
                                                className="option-link"
                                                aria-checked={isSelected}
                                                aria-selected={isSelected}
                                                data-index={index}
                                                data-text={option.text}
                                            >
                                                {translate(option.text)}
                                            </a>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

SelectBox.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string.isRequired,
    isTesting: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onValidate: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    })).isRequired,
    placeHolderText: PropTypes.string,
    required: PropTypes.bool,
    translate: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

SelectBox.defaultProps = {
    className: 'block',
    disabled: false,
    isTesting: false,
    onValidate: null,
    placeHolderText: 'Select...',
    required: false,
};

export default SelectBox;
