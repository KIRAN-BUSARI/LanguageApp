import translate from 'node-google-translate-skidz';
import connectToDb from '../db/index.js';

const translateController = async (req, res) => {
    const connection = await connectToDb();

    const { text, source, target } = req.body;

    // Check if required fields are provided
    if (!text || !source || !target) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    // Check if translation already exists in the database
    connection.query('SELECT * FROM translations WHERE original_text = ? AND source_language = ? AND target_language = ?', [text, source, target], (err, result) => {
        if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).json({
                error: 'Database error'
            });
        }
        if (result.length > 0) {
            return res.json({
                translatedText: result[0].translated_text
            });
        } else {
            // If translation doesn't exist, translate using node-google-translate-skidz
            translate({
                text,
                source,
                target
            }, function (result) {
                const translatedText = result.translation;

                // Save translation to database
                connection.query('INSERT INTO translations (original_text, translated_text, source_language, target_language) VALUES (?, ?, ?, ?)', [text, translatedText, source, target], (err, result) => {
                    if (err) {
                        console.error('Error saving translation to database:', err.message);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    console.log('Translation saved to database');
                });

                res.status(200).json({
                    translatedText: translatedText
                });
            });
        }
    });
}

export {
    translateController
}