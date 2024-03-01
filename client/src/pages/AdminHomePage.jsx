// import { useEffect, useState } from "react";
// import axiosInstance from "../components/Helper/axiosInstance";

// const AdminPage = () => {
//     // Check if the user is an admin
//     const isAdmin = localStorage.getItem("role") === "admin";

//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         if (isAdmin) {
//             axiosInstance.get("/users/getAllUsers")
//                 .then((res) => {
//                     setUsers(res.data.users);
//                     // console.log(res.data.users);
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 });
//         }
//     }, [])

//     if (!isAdmin) {
//         return (
//             <div className="h-screen flex justify-center items-center">
//                 <h1>Unauthorized Access</h1>
//             </div>
//         );
//     }

//     return (
//         <div className="h-[88vh] flex justify-center items-center bg-black text-white">
//             <div className="border border-black p-2 m-2 bg-gray-500 w-[40vw] rounded-md ">
//                 <h1 className="text-center bold text-3xl ">Users </h1>
//                 {users.map((user, index) => (
//                     <div key={index}>
//                         <p>Name: {user.USERNAME}</p>
//                         <p>Email: {user.EMAIL}</p>
//                         <p>Role: {user.ROLE}</p>
//                         <hr />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AdminPage;

// AdminPage.js

// import { useState, useEffect } from 'react';
// import axiosInstance from "../components/Helper/axiosInstance";

// const AdminPage = () => {
//     const [users, setUsers] = useState([]);
//     const [selectedUserId, setSelectedUserId] = useState(null);
//     const [translations, setTranslations] = useState([]);

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             const response = await axiosInstance.get('/users/getAllUsers');
//             console.log(response.data.users);
//             setUsers(response.data.users);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//         }
//     };

//     const fetchTranslations = async (userId) => {
//         try {
//             const response = await axiosInstance.get(`/users/${userId}/translations`);
//             setTranslations(response.data.translations);
//         } catch (error) {
//             console.error('Error fetching translations:', error);
//         }
//     };

//     const handleUserClick = async (userId) => {
//         setSelectedUserId(userId);
//         await fetchTranslations(userId);
//     };

//     return (
//         <div className="container mx-auto py-8">
//             <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
//             <div className="grid grid-cols-3 gap-4">
//                 {users.map(user => (
//                     <div key={user.ID} className={`p-4 border rounded cursor-pointer ${user.ID === selectedUserId ? 'bg-blue-100' : 'bg-white'}`} onClick={() => handleUserClick(user.ID)}>
//                         <h2 className="text-lg font-semibold">{user.USERNAME}</h2>
//                         <p className="text-gray-600">{user.EMAIL}</p>
//                     </div>
//                 ))}
//             </div>
//             <div className="mt-8">
//                 {translations.map(translation => (
//                     <div key={translation.id} className="border rounded p-4 mb-4">
//                         <p className="font-semibold">Original Text: {translation.original_text}</p>
//                         <p className="text-gray-600">Translated Text: {translation.translated_text}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AdminPage;


// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axiosInstance from "../components/Helper/axiosInstance";

// const UsersPage = () => {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             const response = await axiosInstance.get('/users/getAllUsers');
//             setUsers(response.data.users);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//         }
//     };

//     return (
//         <div className="container mx-auto py-8">
//             <h1 className="text-3xl font-bold mb-4">Users Page</h1>
//             <div className="grid grid-cols-3 gap-4">
//                 {users.map(user => (
//                     <Link key={user.ID} to={`/${user.ID}/translations`}>
//                         <div className="p-4 border rounded cursor-pointer">
//                             <h2 className="text-lg font-semibold">{user.USERNAME}</h2>
//                             <p className="text-gray-600">{user.EMAIL}</p>
//                         </div>
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default UsersPage;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from "../components/Helper/axiosInstance";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [showAllUsers, setShowAllUsers] = useState(false);

    useEffect(() => {
        if (showAllUsers) {
            fetchUsers();
        }
    }, [showAllUsers]);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/users/getAllUsers');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-4xl font-bold mb-4 text-center">Admin Page</h1>
            {showAllUsers ? (
                <div className="grid grid-cols-3 gap-4">
                    {users.map(user => (
                        <Link key={user.ID} to={`/${user.ID}/translations`}>
                            <div className="p-4 border rounded cursor-pointer">
                                <h2 className="text-lg font-semibold">{user.USERNAME}</h2>
                                <p className="text-gray-600">{user.EMAIL}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className='h-[80vh] flex flex-col justify-center items-center'>
                    <p className="mb-4 text-5xl">Welcome! Click the button below to view all users.</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowAllUsers(true)}>View All Users</button>
                    <div className="m-4">
                        <Link to="/translate">
                            <button className="bg-green-500 text-white px-4 py-2 rounded">Translate Page</button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;

// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axiosInstance from "../components/Helper/axiosInstance";

// const UsersPage = () => {
//     const [users, setUsers] = useState([]);
//     const [showAllUsers, setShowAllUsers] = useState(false);

//     useEffect(() => {
//         if (showAllUsers) {
//             fetchUsers();
//         }
//     }, [showAllUsers]);

//     const fetchUsers = async () => {
//         try {
//             const response = await axiosInstance.get('/users/getAllUsers');
//             setUsers(response.data.users);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//         }
//     };

//     return (
//         <div className="container mx-auto py-8 flex">
//             <div className="w-3/4">
//                 <h1 className="text-3xl font-bold mb-4">Users Page</h1>
//                 {showAllUsers ? (
//                     <div className="grid grid-cols-3 gap-4">
//                         {users.map(user => (
//                             <Link key={user.ID} to={`/${user.ID}/translations`}>
//                                 <div className="p-4 border rounded cursor-pointer">
//                                     <h2 className="text-lg font-semibold">{user.USERNAME}</h2>
//                                     <p className="text-gray-600">{user.EMAIL}</p>
//                                 </div>
//                             </Link>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className='h-[80vh] flex flex-col justify-center items-center'>
//                         <p className="mb-4 text-5xl">Welcome! Click the button below to view all users.</p>
//                         <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowAllUsers(true)}>View All Users</button>
//                     </div>
//                 )}
//                 <div className="w-1/4 ml-4">
//                     <Link to="/translate">
//                         <button className="bg-green-500 text-white px-4 py-2 rounded">Translate Page</button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UsersPage;
