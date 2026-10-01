import mongoose from 'mongoose';

export async function conectarMongo() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Falta configurar MONGODB_URI.');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    autoCreate: false,
    autoIndex: false,
  });
}
