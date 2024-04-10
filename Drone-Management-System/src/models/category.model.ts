import Mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { STATUS } from '../common/constant';

export type Category = {
  _id?: string;
  unique_id?: string;
  name: string;
  color?: string;
  tag_name?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  user_id?: string;
};

const categorySchema = new Mongoose.Schema(
  {
    _id: {
      type: Mongoose.Schema.Types.ObjectId,
      select: false,
      default: () => new Mongoose.Types.ObjectId(),
    },
    unique_id: { type: String, unique: true, required: true, index: true, default: uuidv4 },
    name: { type: String, required: true },
    status: { type: String, required: true, default: STATUS.ACTIVE },
    color: { type: String },
    tag_name: { type: String },
    user_id: { type: String, ref: 'users', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const CategoryModel = Mongoose.model('category', categorySchema);

CategoryModel.syncIndexes();

export default CategoryModel;
