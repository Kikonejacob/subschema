const React = require('react');
const tu = require('../tutils');
const loader = require('../loader.jsx');

const ButtonsTemplate = React.createClass({
    getDefaultProps(){
        return {
            buttonsClass: 'btn-group',
            buttonClass: 'btn',
            buttonTemplate: 'ButtonTemplate',
            buttons: [{
                action: 'Submit',
                label: 'Submit',
                template: 'Button'
            }],
            handler: function (event, action, btn) {

            }
        }
    },
    makeButtons(){
        var handler = this.props.handler;
        return this.props.buttons.map((b)=> {
            var btn = tu.isString(b) ? {
                action: b,
                label: b,
                handler
            } : _.extend({}, b, {handler});
            if (this.props.buttonClass) {
                btn.buttonClass = (btn.buttonClass || '') + ' ' + this.props.buttonClass;
            }
            btn.template = loader.loadTemplate(b.template || this.props.buttonTemplate);
            return btn;
        })
    },

    render(){
        return <div className={this.props.buttonsClass}>
            {this.makeButtons().map((b, i)=> {
                var Template = b.template;
                return <Template key={"btn-"+i} {...b} />
            })}
        </div>
    }

})

module.exports = ButtonsTemplate;