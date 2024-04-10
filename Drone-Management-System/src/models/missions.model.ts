import Mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { STATUS } from '../common/constant';

export type Mission = {
  _id?: string;
  unique_id?: string;
  name: string;
  alt?: number;
  speed?: number;
  waypoints?: Array<{
    alt: number;
    lat: number;
    lng: number;
  }>;
  site_id: string;
  category_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
};

const Schema = new Mongoose.Schema(
  {
    _id: {
      type: Mongoose.Schema.Types.ObjectId,
      select: false,
      default: () => new Mongoose.Types.ObjectId(),
    },
    unique_id: { type: String, unique: true, required: true, index: true, default: uuidv4 },
    name: { type: String, required: true },
    alt: { type: Number },
    speed: { type: Number },
    waypoints: [
      {
        alt: { type: Number },
        lat: { type: Number },
        lng: { type: Number },
      },
    ],
    status: { type: String, required: true, default: STATUS.ACTIVE },
    site_id: { type: String, required: true, ref: 'sites' },
    category_id: { type: String, ref: 'category' },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

Schema.virtual('site', {
  ref: 'sites',
  localField: 'site_id',
  foreignField: 'unique_id',
});

Schema.virtual('category', {
  ref: 'category',
  localField: 'category_id',
  foreignField: 'unique_id',
});

Schema.set('toObject', { virtuals: true });
Schema.set('toJSON', { virtuals: true });

const MissionModel = Mongoose.model('missions', Schema);

MissionModel.syncIndexes();

export default MissionModel;
