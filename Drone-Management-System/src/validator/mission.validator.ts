import Joi from 'joi';

export const missionSchema = {
  alt: Joi.number().required(),
  speed: Joi.number().required(),
  name: Joi.string().required(),
  waypoints: Joi.array()
    .items(
      Joi.object({
        alt: Joi.number().required(),
        lat: Joi.number().required(),
        lng: Joi.number().required(),
      }),
    )
    .required(),
  site_id: Joi.string().required(),
  category_id: Joi.string().required(),
};

export const updateMissionSchema = {
  alt: Joi.number().optional(),
  speed: Joi.number().optional(),
  name: Joi.string().optional(),
  waypoints: Joi.array()
    .items(
      Joi.object({
        alt: Joi.number().optional(),
        lat: Joi.number().optional(),
        lng: Joi.number().optional(),
      }),
    )
    .optional(),
  category_id: Joi.string().optional(),
};
