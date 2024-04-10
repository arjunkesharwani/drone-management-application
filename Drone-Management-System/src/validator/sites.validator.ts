import Joi from 'joi';

export const siteSchema = {
  site_name: Joi.string().required(),
  position: Joi.object({
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
  }).required(),
};

export const updateSiteSchema = {
  site_name: Joi.string().optional(),
  position: Joi.object({
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),
  }).optional(),
};
