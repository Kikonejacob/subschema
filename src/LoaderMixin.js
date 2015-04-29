var loader = require('./loader'), util = require('./tutils');
var LoaderMixin = {
    getDefaultProps(){
        return {
            loader: loader
        }
    },
    template(template){
        template = arguments.length ? template : 'template';
        template = (this.props.field && (template in this.props.field)) ? this.props.field[template] : (template in this.props) ? this.props[template] : template;
        if (util.isString(template)) {
            return this.props.loader.loadTemplate(template, this.props);
        }
        return template === false ? null : template;
    }
    ,
    processor(processor){
        processor = arguments.length ? processor : 'processor';
        processor = (this.props.field && (processor in this.props.field)) ? this.props.field[processor] : (processor in this.props) ? this.props[processor] : processor;
        if (util.isString(processor)) {
            return this.props.loader.loadProcessor(processor, this.props);
        }
        return processor === false ? null : processor;
    }

}
module.exports = LoaderMixin;