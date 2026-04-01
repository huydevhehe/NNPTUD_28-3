const mongoose = require('mongoose');
const userModel = require('./schemas/users');

async function check() {
    await mongoose.connect("mongodb+srv://nguyenquochuyc7_db_user:ddAgMl7EMdtZbWD7@cluster0.zzqlfbm.mongodb.net/NNPTUD-C4");
    const users = await userModel.find({}).limit(5);
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
}

check();
