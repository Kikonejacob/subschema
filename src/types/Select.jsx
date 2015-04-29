var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants');

var Select = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName,
        subSchema: {
            type: 'Object',
            template: 'OrTemplate',
            subSchema: {
                options: 'OptionSchema',
                processor: 'OptionProcessorSchema'
            }
        }
    },

    render() {
        var {field, name} = this.props;
        var value = this.state.value;
        var {title, placeholder} = field;
        var opts = this.props.field.options || [];
        var hasValue = opts.some(function (v) {
                return (v === value || v.val === value);
            }) || value == null;

        return <select className={Constants.clz(Select.inputClassName, this.props.editorClass)}
                       onBlur={this.handleValidate} onChange={this.handleChange}
                       name={name} value={this.getValue()} title={title}
            >
            {hasValue ? <option key={'s' + opts.length} value={null}>{this.props.placeholder}</option> : null }
            {opts.map((o, i)=> {
                if (value == null && (o == null || o.val == null)) {
                    hasValue = true;
                }
                return <option key={'s' + i} value={o.val|| o}>{o.label || o}</option>
            })}

        </select>
    }

})
module.exports = Select;