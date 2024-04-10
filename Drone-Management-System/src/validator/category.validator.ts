import Joi from 'joi';

export const categorySchema = {
  name: Joi.string().required(),
  color: Joi.string().required(),
  tag_name: Joi.string().required(),
};

export const updateCategorySchema = {
  name: Joi.string().optional(),
  color: Joi.string().optional(),
  tag_name: Joi.string().optional(),
};
