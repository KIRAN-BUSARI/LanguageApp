import translate from 'node-google-translate-skidz';
import connectToDb from '../db/index.js';

const translateController = async (req, res) => {
    try {
        const connection = await connectToDb();

        const { text, source, target } = req.body;

        // Check if required fields are provided
        if (!text || !source || !target) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        // Check if translation already exists in the database
        const [rows] = await connection.query('SELECT * FROM translations WHERE original_text = ? AND source_language = ? AND target_language = ?', [text, source, target]);
        console.log(rows);
        if (rows.length > 0) {
            return res.status(200).json({
                success: true,
                translatedText: rows[0].translated_text,
                message: "Text already translated"
            });
        } else {
            // If translation doesn't exist, translate using node-google-translate-skidz
            translate({
                text,
                source,
                target
            }, async function (result) {
                const translatedText = result.translation;

                // Save translation to database
                await connection.query('INSERT INTO translations (original_text, translated_text, source_language, target_language) VALUES (?, ?, ?, ?)', [text, translatedText, source, target]);

                console.log('Translation saved to database');

                return res.status(200).json({
                    success: true,
                    translatedText: translatedText,
                    message: "Text Translation successful"
                });
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Database error' });
    }
};

export {
    translateController
};
