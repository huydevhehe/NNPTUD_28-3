const xlsx = require("xlsx");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose"); // ✅ thêm ở đây

// đọc excel
function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
}

// gen password
function generatePassword() {
  return crypto.randomBytes(12).toString("base64").slice(0, 16);
}

// mailtrap config
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4ac958bd98adf1",
    pass: "15c99d1192dfcb",
  },
});

// gửi mail
async function sendMail(email, password) {
  await transporter.sendMail({
    from: '"Admin" <no-reply@test.com>',
    to: email,
    subject: "Password account",
    text: `Password của bạn là: ${password}`,
  });
}

// import user
async function importUsers(filePath, User) {
  const users = readExcel(filePath);

  for (let u of users) {
    const password = generatePassword();

    const newUser = new User({
      username: u.username,
      email: u.email,
      password: password,
      // ✅ fix role ObjectId
      role: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011")
    });

    await newUser.save();
    await sendMail(u.email, password);

    console.log("OK:", u.email);
  }
}

module.exports = importUsers;