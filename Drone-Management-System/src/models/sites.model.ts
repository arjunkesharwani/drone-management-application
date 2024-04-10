import Mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { STATUS } from '../common/constant';

export type Site = {
  _id?: string;
  unique_id?: string;
  site_name?: string;
  position?: {
    latitude?: string;
    longitude?: string;
  };
  user_id?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Schema = new Mongoose.Schema(
  {
    _id: {
      type: Mongoose.Schema.Types.ObjectId,
      select: false,
      default: () => new Mongoose.Types.ObjectId(),
    },
    unique_id: { type: String, unique: true, required: true, index: true, default: uuidv4 },
    site_name: { type: String, required: true },
    position: {
      latitude: { type: String, required: true },
      longitude: { type: String, required: true },
    },
    user_id: { type: String, ref: 'users', required: true },
    status: { type: String, required: true, default: STATUS.ACTIVE },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

Schema.virtual('user', {
  ref: 'users',
  localField: 'user_id',
  foreignField: 'unique_id',
});

Schema.set('toObject', { virtuals: true });
Schema.set('toJSON', { virtuals: true });

const SitesModel = Mongoose.model('sites', Schema);

SitesModel.syncIndexes();

export default SitesModel;
