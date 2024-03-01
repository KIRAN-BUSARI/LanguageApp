import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../components/Helper/axiosInstance';

const UserTranslationsPage = () => {
    const { userId } = useParams();
    const [translations, setTranslations] = useState([]);

    useEffect(() => {
        fetchTranslations();
    }, [userId]);

    const fetchTranslations = async () => {
        try {
            const response = await axiosInstance.get(`/users/${userId}/translations`);
            setTranslations(response.data.translations);
        } catch (error) {
            console.error('Error fetching translations:', error);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">User Translations</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {translations.length === 0 ? (
                    <div className="p-8 text-center text-gray-600">
                        No translations found for this user.
                    </div>
                ) : (
                    <ul>
                        {translations.map(translation => (
                            <li key={translation.id} className="border-b last:border-b-0">
                                <div className="p-4">
                                    <p className="text-lg font-semibold">Original Text:</p>
                                    <p className="text-gray-800">{translation.original_text}</p>
                                    <p className="text-lg font-semibold mt-2">Translated Text:</p>
                                    <p className="text-gray-800">{translation.translated_text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserTranslationsPage;
