"use strict";
var React = require('./react');
var tu = require('./tutils');
var EMPTY_ARR = [];
var loader = require('./loader');
function initValidators(v) {
    //If it has a type init it
    if (v.type) {
        var validator = loader.loadValidator(v.type);
        return validator(v);
    }
    //If it is a RegExp than init ReExp
    if (tu.isRegExp(v)) {
        return loader.loadValidator('regexp')({
            regexp: v
        });
    }
    //If its a function just return it.
    if (tu.isFunction(v)) {
        return v;
    }
    //otherwise lets try initing it.
    return loader.loadValidator(v)();
}


var Editor = React.createClass({
    displayName: 'Editor',
    mixins:[require('./LoaderMixin')],
    getDefaultProps() {
        return {
            field: {
                type: 'Text'
            },
            /*onValueChange() {
            },*/
            onValidate() {
            },
            template: 'EditorTemplate'

        }
    },
    getInitialState(){
        return {
            hasChanged: false
        }
    },

    setValue(value){
        this.refs.field.setValue(value);
    },
    componentWillMount(){
        var validators = this.props.field.validators;
        this.validators = validators ? validators.map(initValidators) : EMPTY_ARR;
        this.props.valueManager.addListener(this.props.path, this.handleChange, this, true);
        this.props.valueManager.addValidateListener(this.props.path, this._validate, this);

    },
    componentWillUnmount(){
        this.props.valueManager.removeListener(this.props.path, this.handleChange);
        this.props.valueManager.removeValidateListener(this.props.path, this._validate);
    },
    handleValidate(value, component, e) {
        this.state.hasValidated = true;
        this.validate();
    },

    handleChange(newValue, oldValue, name) {
        var hasChanged = newValue != oldValue;
        if (!hasChanged) {
            return;
        }
        this.state.hasChanged = true;
        var errors = this.getErrorMessages(newValue);
        if (!this.state.hasValidated) {
            if (!errors || errors.length === 0) {
                this.state.hasValidated = true;
            }
        } else {
            this.validate(newValue, errors);
        }
    },
    getValue(){
        return this.props.valueManager.path(this.props.path);
    },

    /**
     * Runs validation and updates empty fields.
     *
     */
        validate(value, errors){
        value = arguments.length === 0 ? this.getValue() : value;
        errors = errors || this.getErrorMessages(value);

        this.props.valueManager.updateErrors(this.props.path, errors);
        this.setState({
            hasValidated: true
        });
        return errors;
    },
    _validate: function () {
        this.validate(this.getValue());
    },
    getErrorMessages(value){
        var vm = this.props.valueManager;

        value = arguments.length === 0 ? this.getValue() : value;
        var msgs = this.validators.map((v)=> {
            return v(value, vm);
        }).filter(tu.nullCheck);
        return msgs;
    },


    title: function () {
        var field = this.props.field || {};
        if (field.title === false) {
            return null;
        }
        if (field.title != null) {
            return field.title;
        }
        //Add spaces
        return field.name.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => {
            return s.toUpperCase();
        });
    },
    render() {
        var {field, name, value, path, onValueChange,  template,onValidate, ...props} = this.props;
        var {name,type,fieldClass, editorClass, errorClassName, help} = field;

        //err = errors, //&& errors[path] && errors[path][0] && errors[path],
        var Component = this.props.loader.loadType(type),
            title = this.title(),
            errorClassName = errorClassName == null ? 'has-error' : errorClassName;
        var Template;
        if (template === false || field.template === false || type === 'Hidden') {
            Template = null;
        } else {
            Template = this.template();
        }
        var child = <Component ref="field" {...props} field={field} name={name} form={this.props.form}
                               path={path}
                                {...field}
                               editorClass={editorClass}
                               valueManager={this.props.valueManager}
                               onValidate={this.handleValidate}/>;
        //errMessage, errorClassName, name, fieldClass, title, help
        return Template ?
            <Template field={field} name={name} fieldClass={fieldClass} title={title} help={help} path={path}
                      errorClassName={errorClassName} valueManager={this.props.valueManager}>
                {child}
            </Template> :
            child;

    }
});
module.exports = Editor;