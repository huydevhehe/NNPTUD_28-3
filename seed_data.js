const mongoose = require('mongoose');
const userModel = require('./schemas/users');
const roleModel = require('./schemas/roles');

const mongoURI = "mongodb+srv://nguyenquochuyc7_db_user:ddAgMl7EMdtZbWD7@cluster0.zzqlfbm.mongodb.net/NNPTUD-C4";

async function seed() {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB...");

        // 1. Tạo hoặc lấy Role mẫu
        let role = await roleModel.findOne({ name: 'user' });
        if (!role) {
            role = new roleModel({ name: 'user', description: 'Normal user role' });
            await role.save();
            console.log("Created Role: user");
        }

        const createTestUser = async (username, email) => {
            let user = await userModel.findOne({ username });
            if (!user) {
                user = new userModel({
                    username: username,
                    email: email,
                    password: '123456',
                    role: role._id,
                    status: true
                });
                await user.save();
                console.log(`Created User: ${username} (ID: ${user._id})`);
            } else {
                console.log(`User ${username} already exists (ID: ${user._id})`);
            }
            return user;
        };

        const u1 = await createTestUser('testuser1', 'test1@example.com');
        const u2 = await createTestUser('testuser2', 'test2@example.com');

        console.log("\n--- TEST DATA READY ---");
        console.log(`User 1 ID: ${u1._id}`);
        console.log(`User 2 ID: ${u2._id}`);
        console.log("Password for both: 123456");
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
