import mongoose from 'mongoose';

export interface UserRecord {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema<UserRecord>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true });

const UserModel = mongoose.models.User as mongoose.Model<UserRecord> | undefined
  ?? mongoose.model<UserRecord>('User', UserSchema);

export default UserModel;
