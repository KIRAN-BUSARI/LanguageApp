import mysql from 'mysql2/promise';
// import mysql from 'mysql';
import { config } from 'dotenv';
config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root@123#',
    database: process.env.DB_NAME || 'languageApp',
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
