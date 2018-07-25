import React from 'react';
import PropTypes from 'prop-types';
import { ButtonPrimary, ButtonSecondary, Input, RadioGroup } from '../../../bb-library-ui-components/react';
import SearchResult from './search-result';
import { CONTENT_DISPLAY_TYPES } from '../constants';

class EditItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            inputs: {
                altText: props.previewAttrs.title,
                displayType: CONTENT_DISPLAY_TYPES.displayInline,
            },
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.isValid = this.isValid.bind(this);
        this.onValidateInputs = this.onValidateInputs.bind(this);
    }

    componentDidMount() {
        this.title.focus();
    }

    handleInputChange(key, value) {
        this.setState(prevState => ({
            inputs: Object.assign({}, prevState.inputs, {
                [key]: value,
            }),
        }));
    }

    isValid() {
        return !Object.keys(this.state.errors).some(key => this.state.errors[key].length > 0);
    }

    onValidateInputs(error) {
        this.setState(prevState => ({
            errors: Object.assign({}, prevState.errors, error),
        }));
    }

    render() {
        const { goBack, onCancel, onSubmit, previewAttrs, translate } = this.props;
        const { inputs } = this.state;
        const submit = () => onSubmit(inputs);
        const isInvalid = !this.isValid();
        const altTextLabel = translate('edit.altTextLabel');
        const displayTypeLabel = translate('edit.displayTypeLabel');
        const editingPageTitle = translate('edit.title');
        const defaultButtonText = translate('buttons.cancel');
        const primaryButtonText = translate('buttons.insert');
        const returnButtonText = translate('buttons.return');
        const displayTypeText = {
            displayAsLink: translate('edit.displayTypeOptions.displayAsLink'),
            displayInline: translate('edit.displayTypeOptions.displayInline'),
        };

        return (
            <div className="giphy-edit-container">
                <div className="main-content pt-2">
                    <h1 tabIndex="-1" className="mx-4 my-2" ref={(el) => { this.title = el; }}>{editingPageTitle}</h1>
                    <div className="third-party-search-container giphy mx-4 my-4">
                        <SearchResult
                            alwaysShowPreview
                            result={previewAttrs}
                            translate={translate}
                        />
                        <label className="required" htmlFor="altText">{altTextLabel}</label>
                        <Input
                            className=""
                            id="altText"
                            name="altText"
                            onChange={this.handleInputChange}
                            onValidate={this.onValidateInputs}
                            translate={translate}
                            type="text"
                            value={inputs.altText}
                            validations={['isRequired']}
                        />
                        <label htmlFor="displayType">{displayTypeLabel}</label>
                        <RadioGroup
                            name="displayType"
                            onSelect={this.handleInputChange}
                            options={[
                                {
                                    value: CONTENT_DISPLAY_TYPES.displayAsLink,
                                    text: displayTypeText.displayAsLink,
                                },
                                {
                                    value: CONTENT_DISPLAY_TYPES.displayInline,
                                    text: displayTypeText.displayInline,
                                },
                            ]}
                            value={inputs.displayType}
                        />
                    </div>
                </div>
                <div className="footer-content text-right mt-4 py-3 px-4 border-t-2">
                    <ButtonSecondary className="anchor py-2 px-4 float-left" onClick={goBack}>
                        {returnButtonText}
                    </ButtonSecondary>
                    <div className="right-button-group">
                        <ButtonSecondary onClick={onCancel}>
                            {defaultButtonText}
                        </ButtonSecondary>
                        <ButtonPrimary
                            disabled={isInvalid}
                            onClick={submit}
                        >
                            {primaryButtonText}
                        </ButtonPrimary>
                    </div>
                </div>
            </div>
        );
    }
}

EditItem.propTypes = {
    goBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    previewAttrs: PropTypes.shape().isRequired,
    translate: PropTypes.func.isRequired,
};

export default EditItem;
