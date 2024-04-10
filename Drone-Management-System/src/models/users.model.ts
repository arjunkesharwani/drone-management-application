import Mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { STATUS } from '../common/constant';

export type User = {
  unique_id?: string;
  username: string;
  email: string;
  password: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  user_id?: string;
};

const userSchema = new Mongoose.Schema(
  {
    _id: {
      type: Mongoose.Schema.Types.ObjectId,
      select: 0,
      default: () => new Mongoose.Types.ObjectId(),
    },
    unique_id: { type: String, unique: true, required: true, index: 1, default: uuidv4 },
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, required: true, default: STATUS.ACTIVE },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const UsersModel = Mongoose.model('users', userSchema);

UsersModel.syncIndexes();

export default UsersModel;
