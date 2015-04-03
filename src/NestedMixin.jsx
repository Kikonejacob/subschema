var React = require('react');
var tu = require('./tutils'), tpath = tu.path;
var Editor = require('./Editor.jsx');

var NestedMixin = {
    getDefaultProps() {
        return {
            template: null,
            path: null,
            schema: {},
            onValueChange() {
            },
            onValidate(){
            },
            form: null
        }

    },
    getInitialState(){
        return {};
    },

    setValue(newValue, oldValue, property, path){
        if (property == null) {
            tu.values(this.refs).forEach((ref)=> {
                ref.refs.field.setValue(newValue && newValue[ref.props.name]);
            });
        } else {
            var parts = path.split('.', 2);
            this.refs[parts[0]].refs.field.setValue(newValue, oldValue, parts[0], parts[1]);
        }
    },
    setErrors(errors, newValue, oldValue, property, path){
        if (property == null) {
            tu.values(this.refs).forEach((ref)=> {
                ref.setErrors && ref.setErrors(errors);
            });
        } else {
            var {key, rest} = path.split('.', 2);
            this.refs[key].editor.setErrors(errors, newValue, oldValue, property, rest);
        }
        this.state.errors = errors;
    },
    makeFieldset(f, i) {

        var ret = f.legend ?
            <fieldset key={'f' + i}>
                <legend>{f.legend}</legend>
                {this.makeFields(f.fields).map(this.addEditor, this)}
            </fieldset> :
            <div key={'f' + i}>{this.makeFields(f.fields).map(this.addEditor, this)}</div>
        return ret;
    },

    handleValueChange(newValue, oldValue, property, path) {

        if (this.props.onValueChange(newValue, oldValue, property, path) !== false) {
            if (this.form === this) {
                this.setValue(newValue, oldValue, property, path);
            }
        }
    },

    handleValidate(errors, newValue, oldValue, property, path){
        if (this.props.onValidate(newValue, oldValue, property, path) !== false) {
            if (this.form === this) {
                var e = {};
                e[path] = errors;
                this.form.setErrors(e);
            }
        }
    },
    getErrorMessages(){
        var refs = this.refs;
        var errors = tu.flatten(Object.keys(refs).map((v) => {
            var ers = refs[v] && refs[v].editor.getErrorMessages();
            if (ers == null || ers.length === 0) return 0;
            var msg = {};
            msg[refs[v].props.path] = ers;
            return msg;
        }).filter(tu.nullCheck));
    },
    /**
     * Return null if no validation errors,
     * otherwise return a map of errors.
     */
        validate(){
        var refs = this.refs, msgs = null;
        Object.keys(refs).forEach((v) => {
            var ref = refs[v], ers;

            //So nested forms do their own validation.
            if (ref.refs.field.validate) {
                ers = ref.refs.field.validate();
                if (ers == null) return null;
                if (!msgs)msgs = {};
                Object.keys(ers).forEach((v)=> {
                    msgs[v] = ers[v];
                });
            } else {
                //otherwise the editor does it.  I know wierd,
                //open to suggestions.
                ers = ref.validate();
                if (ers == null || ers.length === 0) return null;
                if (msgs == null) msgs = {};
                msgs[ref.props.path] = ers;
            }
        });
        return msgs;
    },
    getValue(){
        var refs = this.refs, value = {};
        Object.keys(refs).forEach((v) => {
            value[v] = refs[v].getValue();
        });
        return value;
    },
    addEditor(field){
        var f = field.name;
        var {path} = this.props;
        var {value, errors} = this.state;
        return <Editor ref={f} key={'key-' + f} path={tu.path(path, f)} value={value && value[f]}
                       field={field}
                       errors={errors}
                       name={f}
                       form={this.form}
                       template={field.template}
                       onValueChange={this.handleValueChange} onValidate={this.handleValidate}/>
    },
    makeFields(fields) {
        var fieldMap = {}, schema = this.schema.schema, template = this.props.template;

        fields = tu.toArray(fields).map((v) => {
            return v.split('.', 2);
        }).map((v) => {
            var f = v[0];
            if (v.length > 1) {
                (fieldMap[f] || (fieldMap[f] = [])).push(v[1]);
            }
            return f;
        });


        return tu.unique(fields).filter((f)=> {
            return schema[f];
        }).map((f) => {

            var ref = _.isString(f) ? schema[f] : f;
            if (tu.isString(ref)) {
                ref = {
                    name: f,
                    type: ref,
                    template: template
                }
            } else {
                if (!ref.type) {
                    ref.type = 'Text';
                }
                if (!ref.name) {
                    ref.name = f;
                }
                if (!ref.template) {
                    ref.template = template;
                }

            }
            if (!ref.fields && fieldMap[f]) {
                ref.fields = fieldMap[f];
            }
            return ref;
        })
    },


    renderSchema(form) {
        if (form) {
            this.form = form;
        } else {
            this.form = this;
        }
        var schema = this.schema, fieldsets = schema.fieldsets, fields = schema.fields || Object.keys(schema.schema);
        return (fieldsets && Array.isArray(fieldsets) ? fieldsets : ( fieldsets && (fieldsets.legend || fieldsets.fields) ) ? [fieldsets] : [{fields: tu.toArray(fields)}])
            .map(this.makeFieldset, this);
    }
}
module.exports = NestedMixin;