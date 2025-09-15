import mongoose from 'mongoose';
import { db_name } from '../constant.js';

const connectDB = async () => {
  const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`);
  console.log('\n MongoDB is connected !! At Host ', connectionInstance.connection.host);
};

export default connectDB;
