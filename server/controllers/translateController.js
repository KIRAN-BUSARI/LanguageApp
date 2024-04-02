// import translate from 'node-google-translate-skidz';
// import connectToDb from '../db/index.js';

// const translateController = async (req, res) => {
//     try {
//         const connection = await connectToDb();

//         const { text, source, target } = req.body;

//         // Check if required fields are provided
//         if (!text || !source || !target) {
//             return res.status(400).json({
//                 error: 'Missing required fields'
//             });
//         }

//         // Check if translation already exists in the database
//         const [rows] = await connection.query('SELECT * FROM translations WHERE original_text = ? AND source_language = ? AND target_language = ?', [text, source, target]);
//         console.log(rows);
//         if (rows.length > 0) {
//             return res.status(200).json({
//                 success: true,
//                 translatedText: rows[0].translated_text,
//                 message: "Text already translated"
//             });
//         } else {
//             // If translation doesn't exist, translate using node-google-translate-skidz
//             translate({
//                 text,
//                 source,
//                 target
//             }, async function (result) {
//                 const translatedText = result.translation;

//                 // Save translation to database
//                 await connection.query('INSERT INTO translations (original_text, translated_text, source_language, target_language) VALUES (?, ?, ?, ?)', [text, translatedText, source, target]);

//                 console.log('Translation saved to database');

//                 return res.status(200).json({
//                     success: true,
//                     translatedText: translatedText,
//                     message: "Text Translation successful"
//                 });
//             });
//         }
//     } catch (error) {
//         console.error('Error:', error.message);
//         return res.status(500).json({ error: 'Database error' });
//     }
// };

// export {
//     translateController
// };

import jwt from "jsonwebtoken";
import translate from 'node-google-translate-skidz';
import connectToDb from '../db/index.js';

const translateController = async (req, res) => {
    try {
        const connection = await connectToDb();

        // Extract token from request headers
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        // Verify and decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'LanguageTranslatorApp');

        const { text, source, target } = req.body;
        const userId = decodedToken.userId;
        // console.log(userId);

        // Check if required fields are provided
        if (!text || !source || !target) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        // Translate the text
        translate({ text, source, target }, async function (result) {
            const translatedText = result.translation;

            try {
                const [translateTable] = await connection.query("SHOW TABLES LIKE 'TRANSLATIONS'");
                if (translateTable.length === 0) {
                    await connection.query(`
                        CREATE TABLE translations (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            original_text TEXT NOT NULL,
                            translated_text TEXT NOT NULL,
                            source_language VARCHAR(10) NOT NULL,
                            target_language VARCHAR(10) NOT NULL,
                            user_id INT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users(id)
                        );
                    `);
                }

                // Save translation to database with user ID
                await connection.query(
                    'INSERT INTO translations (original_text, translated_text, source_language, target_language, user_id) VALUES (?, ?, ?, ?, ?)',
                    [text, translatedText, source, target, userId]
                );

                console.log('Translation saved to database');

                return res.status(200).json({
                    success: true,
                    translatedText: translatedText,
                    message: "Text Translation successful"
                });
            } catch (error) {
                console.error('Error saving translation to database:', error.message);
                return res.status(500).json({ error: 'Database error' });
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// translationController.js



export { translateController };