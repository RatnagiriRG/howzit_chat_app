const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected Successfully");
  } catch (err) {
    console.error("DB Connection Error: ", err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
