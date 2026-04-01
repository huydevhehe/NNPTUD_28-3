const mongoose = require('mongoose');
const roleModel = require('./schemas/roles');

async function checkRoles() {
    try {
        await mongoose.connect("mongodb+srv://nguyenquochuyc7_db_user:ddAgMl7EMdtZbWD7@cluster0.zzqlfbm.mongodb.net/NNPTUD-C4");
        const roles = await roleModel.find({});
        console.log("ROLES_FOUND:", JSON.stringify(roles, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("CONNECTION_ERROR:", error.message);
        process.exit(1);
    }
}

checkRoles();
