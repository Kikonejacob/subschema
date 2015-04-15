var React = require('react');
var tu = require('../tutils');
var loader = require('../loader.jsx');


var RadioInput = React.createClass({
    propTypes: {
        title: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            title: '',
            name: '',
            placeholder: '',
            template: 'RadioItemTemplate'
        }

    },
    componentWillMount(){
        this.props.valueManager.addListener(this.props.path, this.setValue, this, true);
    },
    componentWillUnMount(){
        this.props.valueManager.removeListener(this.props.path, this.setValue);
    },
    setValue(value){
        this.setState({value});
    },

    getValue(){
        return this.state.value;
    },

    _compare(val, val2){
        if (val == null && val2 == null) {
            return true;
        }
        if (val == null || val2 == null) return false;
        return ('' + val === '' + val2);
    },
    handleCheckChange(e){
        //Make a radio behave like a checkbox when there is only 1.
        if (this.props.field.forceSelection === false || this.props.field.options && this.props.field.options.length === 1) {
            this.props.valueManager.update(this.props.path, this._compare(e.target.value, this.state.value) ? null : e.target.value, this.state.value, this.props.name, this.props.path);
        } else {
            this.props.valueManager.update(this.props.path, e.target.value, this.state.value, this.props.name, this.props.path);
        }
    },
    makeOptions(options){
        options = options || [];
        var onChange = this.handleCheckChange;
        var value = this.getValue();
        return options.map((option, index)=> {
            var {val, label, labelHTML} = tu.isString(option) ? {val: option, label: option} : option;
            if (val == null) {
                val = label;
            }
            if (label == null) {
                label = val;
            }
            return {
                val,
                label,
                labelHTML,
                onChange,
                checked: this._compare(value, val)
            }
        });
    },
    render()
    {
        var {name,template,path, dataType, field} = this.props;

        var RadioItemTemplate = loader.loadTemplate(template);

        return (<div>{this.makeOptions(field.options).map((option, index)=> {

            option.key = '' + name + option.val;

            return <RadioItemTemplate  {...option} id={path+'.'+index}>
                <input id={path+'.'+index} type="radio"
                       name={name} {...option} value={option.val}/>
            </RadioItemTemplate>


        }, this)}</div>)
    }
});

module.exports = RadioInput;