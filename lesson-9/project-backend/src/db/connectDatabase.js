import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST);
    console.log('Successfully connected database');
  } catch (error) {
    console.log('Failed connect database', error);
    throw error;
  }
};

export default connectDatabase;
