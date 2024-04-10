import Mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type Drone = {
  _id?: string;
  unique_id?: string;
  name: string;
  drone_id?: string;
  drone_type?: string;
  make_name?: string;
  site_id: string;
  deleted_by?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deleted_on?: Date;
};

const Schema = new Mongoose.Schema(
  {
    _id: {
      type: Mongoose.Schema.Types.ObjectId,
      select: false,
      default: () => new Mongoose.Types.ObjectId(),
    },
    unique_id: { type: String, unique: true, required: true, index: true, default: uuidv4 },
    drone_id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    drone_type: { type: String, required: true },
    make_name: { type: String, required: true },
    site_id: { type: String, required: true },
    deleted_by: { type: String },
    deleted_on: { type: Date },
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

Schema.set('toObject', { virtuals: true });
Schema.set('toJSON', { virtuals: true });

const DroneModel = Mongoose.model('drones', Schema);

DroneModel.syncIndexes();

export default DroneModel;
