// import { useState } from 'react';
// import axiosInstance from '../components/Helper/axiosInstance';
// import toast from 'react-hot-toast';

// function Translate() {
//     const [text, setText] = useState('');
//     const [sourceLanguage, setSourceLanguage] = useState('');
//     const [targetLanguage, setTargetLanguage] = useState('');
//     const [translatedText, setTranslatedText] = useState('');
//     const [error, setError] = useState('');

//     const handleTranslate = async () => {
//         try {
//             let res = axiosInstance.post('/translate/translateLang', {
//                 text: text,
//                 source: sourceLanguage,
//                 target: targetLanguage
//             });
//             toast.promise(res, {
//                 loading: 'Translating...',
//                 success: (data) => data.data.message,
//                 error: (data) => data.data.error
//             })
//             // console.log(res.data);
//             res = await res
//             setTranslatedText(res.data.translatedText);
//             setError('');
//         } catch (error) {
//             if (error.res) {
//                 setError(error.res.data.error);
//             } else {
//                 setError('An error occurred while translating');
//             }
//             setTranslatedText('');
//         }
//     };

//     return (
//         <div className="bg-black h-[88vh] flex justify-center items-center">
//             <div className="max-w-md w-full mx-auto mt-10 p-6 bg-gray-500 rounded-lg shadow-md ">
//                 <h1 className="text-2xl font-bold mb-4">Translate</h1>
//                 <div className="mb-4">
//                     <label htmlFor="text" className="block text-gray-700">Text</label>
//                     <input type="text" id="text" name="text" value={text} onChange={(e) => setText(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md" />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="sourceLanguage" className="block text-gray-700">Source Language</label>
//                     <input type="text" id="sourceLanguage" name="sourceLanguage" value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md" />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="targetLanguage" className="block text-gray-700">Target Language</label>
//                     <input type="text" id="targetLanguage" name="targetLanguage" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md" />
//                 </div>
//                 <button onClick={handleTranslate} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Translate</button>
//                 {translatedText && (
//                     <div className="mt-4">
//                         <h2 className="text-lg font-semibold mb-2">Translated Text</h2>
//                         <p>{translatedText}</p>
//                     </div>
//                 )}
//                 {error && (
//                     <div className="mt-4">
//                         <p className="text-red-500">{error}</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Translate;

import { useState } from 'react';
import axiosInstance from '../components/Helper/axiosInstance';
import toast from 'react-hot-toast';

function Translate() {
    const [text, setText] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [error, setError] = useState('');

    const handleTranslate = async () => {
        try {
            let res = axiosInstance.post('/translate/translateLang', {
                text: text,
                source: sourceLanguage,
                target: targetLanguage
            });
            toast.promise(res, {
                loading: 'Translating...',
                success: (data) => data.data.message,
                error: (data) => data.data.error
            })
            res = await res
            setTranslatedText(res.data.translatedText);
            setError('');
        } catch (error) {
            if (error.res) {
                setError(error.res.data.error);
            } else {
                setError('An error occurred while translating');
            }
            setTranslatedText('');
        }
    };

    const handleSourceLanguageChange = (e) => {
        setSourceLanguage(e.target.value);
    };

    const handleTargetLanguageChange = (e) => {
        setTargetLanguage(e.target.value);
    };

    // Array of 10 example languages
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'kn', name: 'Kannada' },
        { code: 'te', name: 'Telugu' },
        { code: 'hi', name: 'Hindi' },
        { code: 'es', name: 'Spanish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' }
    ];

    return (
        <div className="bg-black h-[88vh] flex justify-center items-center">
            <div className="max-w-md w-full mx-auto mt-10 p-6 bg-gray-600 rounded-lg shadow-md ">
                <h1 className="text-2xl font-bold mb-4 text-white">Translate</h1>
                <div className="mb-4">
                    <label htmlFor="text" className="block text-gray-100">Text</label>
                    <input type="text" id="text" name="text" value={text} onChange={(e) => setText(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="sourceLanguage" className="block text-gray-100">Source Language</label>
                    <select id="sourceLanguage" name="sourceLanguage" value={sourceLanguage} onChange={handleSourceLanguageChange} className="mt-1 p-2 w-full border-gray-500 rounded-md">
                        <option>Select Source Language</option>
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="targetLanguage" className="block text-gray-100">Target Language</label>
                    <select id="targetLanguage" name="targetLanguage" value={targetLanguage} onChange={handleTargetLanguageChange} className="mt-1 p-2 w-full border-gray-800 rounded-md">
                        <option>Select Target Language</option>
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleTranslate} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Translate</button>
                {translatedText && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2">Translated Text</h2>
                        <p>{translatedText}</p>
                    </div>
                )}
                {error && (
                    <div className="mt-4">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Translate;
