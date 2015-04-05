var React = require('react');
var NestedMixin = require('./NestedMixin.jsx');
var loader = require('./loader.jsx');
var Form = React.createClass({
    displayName: 'Form',
    mixins: [NestedMixin],
    getDefaultProps() {
        return {
            template: 'FormTemplate',
            onSubmit(){

            }
        }

    },
    handleSubmit(e){
        e && e.preventDefault();
        var errors = this.validate();
        this.props.onSubmit(e, errors, this.getValue());
    },

    render() {

        var {schema, subSchema,  fields, submitButton,  template, ...props} = this.props;
        this.schema = subSchema ? {schema: subSchema, fields: fields} : schema;
        var sb = submitButton || this.schema.submitButton;
        var Template = loader.loadTemplate(template);
        return <Template onValidate={this.handleValidate} onSubmit={this.handleSubmit}>
            {this.schema && this.schema.schema ? this.renderSchema(this) : null}
            {sb ?
                <button type="submit" className='btn btn-primary' dangerouslySetInnerHTML={{__html: sb}}/> : null}

        </Template>
    }

});
module.exports = Form;