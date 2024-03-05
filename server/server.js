import { config } from 'dotenv'
config()
import app from './app.js'
import connectToDb from './db/index.js';

app.get('/', (_req, res) => {
    res.send("Hi")
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT || 8080}`);
    connectToDb()
});
