import mongoose from 'mongoose';

const connectToDatabase = async () =>{
    try{
        if(!process.env.DB_URI) {
            throw new Error('DB_URI environment variable is not set');
        }
        await mongoose.connect(process.env.DB_URI);
    }catch(error){
        console.error("Error connecting to Database:",error);
        process.exit(1);
    }
}

export default connectToDatabase;