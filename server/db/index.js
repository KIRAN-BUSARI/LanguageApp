import mysql from 'mysql2/promise';
// import mysql from 'mysql';
import { config } from 'dotenv';
config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
// console.log(dbConfig.user);

const connectToDb = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig)
        console.log('Connected to MySQL database');
        return connection
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        throw error;
    }
}

export default connectToDb 
