import Joi from 'joi';

export const droneSchema = {
  name: Joi.string().required(),
  drone_id: Joi.string().required(),
  drone_type: Joi.string().required(),
  make_name: Joi.string().required(),
  site_id: Joi.string().required(),
};

export const updateDroneSchema = {
  name: Joi.string().optional(),
  drone_id: Joi.string().optional(),
  drone_type: Joi.string().optional(),
  make_name: Joi.string().optional(),
  site_id: Joi.string().optional(),
};
