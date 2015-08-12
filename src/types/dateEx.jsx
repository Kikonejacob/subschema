var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');

var React=require('react-bootstrap-datetimepicker.min.js');

var DateInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        var {onBlur,onValueChange,onChange, className, fieldAttrs, ...props} = this.props;
        return <DateTimeField
                  onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                  inputFormat='DD-MM-YYYY'
                  viewMode='years'
                  
                  className={css.forField(this)}   value={this.state.value}
                      
                  {...props}
                  {...fieldAttrs}
                />
                
               
    }
});

module.exports = DateInputEx;
