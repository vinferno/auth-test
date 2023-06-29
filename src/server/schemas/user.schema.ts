import mongoose from 'mongoose';
import type { User } from '../../shared/models/user.model';
const {Schema, model} = mongoose

const userSchema = new Schema<User>({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
});
userSchema.pre<User>("save", function save(next) {
    this.password = this.password;
    next() });

export const UserModel = model<User>('User',userSchema)
