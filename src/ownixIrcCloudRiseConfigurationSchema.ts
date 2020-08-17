import * as Joi from 'joi';

export default Joi.object().keys({
    customHighlightColorEnabled: Joi.bool().default(false),
    customHighlightColorValue: Joi.string().default('#ff0000')
});