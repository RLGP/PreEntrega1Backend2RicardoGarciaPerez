import { userModel } from './models/userModel.js';

class userDBManager {
    async createUser(user) {
        return await userModel.create(user);
    }

    async findUserByEmail(email) {
        return await userModel.findOne({ email });
    }

    async findUserById(id) {
        return await userModel.findById(id);
    }

    async updateUserByEmail(email, updateData) {
        return await userModel.findOneAndUpdate({ email }, updateData, { new: true });
    }

    async deleteUserByEmail(email) {
        return await userModel.findOneAndDelete({ email });
    }
}

export { userDBManager };