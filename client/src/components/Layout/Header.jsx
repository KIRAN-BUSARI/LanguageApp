// import { useEffect, useState } from "react"
// import axiosInstance from "../Helper/axiosInstance"
// import { HiMiniLanguage } from "react-icons/hi2";
// import { Link } from "react-router-dom";
// const Header = () => {
//     const [username, setUsername] = useState("")

//     useEffect(() => {
//         axiosInstance.get("/users/getUser", {
//             headers: {
//                 Authorization: "Bearer " + localStorage.getItem("token")
//             }
//         })
//             .then(res => {
//                 // console.log(res.data.user);
//                 // setUsername(res.data.user.firstName + " " + res.data.user.lastName)
//                 setUsername(res.data.user.USERNAME)
//             })
//     })
//     return <div className="shadow h-14 flex justify-between bg-black ">
//         <div className="flex text-3xl items-center text-white ml-3">
//             <Link to={"/"}><HiMiniLanguage /></Link>

//         </div>
//         <div className="flex flex-col justify-center h-full ml-4 text-white font-bold">
//             Language Translator App
//         </div>
//         <div className="flex mr-3">
//             <div className="flex flex-col justify-center h-full mr-2 text-xl text-white">
//                 Hello
//             </div>
//             <div className="mr-3 uppercase flex items-center text-gray-200 text-xl font-bold">
//                 {username}
//             </div>
//             <div className="text-white flex items-center px-2 py-3"><Link to={"/signin"}>Login</Link></div>
//         </div>
//     </div >
// }

// export default Header;

import { useEffect, useState } from "react";
import axiosInstance from "../Helper/axiosInstance";
import { HiMiniLanguage } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Header = () => {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (token) {
            // User is logged in, fetch user data
            axiosInstance.get("/users/getUser", {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
                .then(res => {
                    setUsername(res.data.user.USERNAME);
                    setRole(res.data.user.ROLE)
                    setIsLoggedIn(true); // Set login status to true
                })
                .catch(error => {
                    // Handle error
                    console.error("Error fetching user data:", error);
                });
        }
    }, []);

    const handleLogout = () => {
        // Clear user data and token from localStorage
        localStorage.removeItem("token");
        setUsername("");
        setIsLoggedIn(false);
    };

    return (
        <div className="shadow h-14 flex justify-between bg-black ">
            <div className="flex text-3xl items-center text-white ml-3">
                <Link to={"/"}><HiMiniLanguage /></Link>
            </div>
            <div className="flex flex-col justify-center h-full ml-4 text-white font-bold">
                Language Translator App
            </div>
            <div className="flex mr-3">
                {isLoggedIn ? ( // Conditionally render based on login status
                    <>
                        <div className="flex flex-col justify-center h-full mr-2 text-xl text-white">
                            Hello
                        </div>
                        <div className="mr-2 uppercase flex items-center text-xl font-bold text-[#0095ff]">
                            {username}
                        </div>
                        <div className="text-gray-200 flex items-center">{role}</div>
                        <div className="text-white flex items-center px-2 py-3 cursor-pointer" onClick={handleLogout}>Logout</div>
                    </>
                ) : (
                    <div className="text-white flex items-center px-2 py-3"><Link to={"/signin"}>Login</Link></div>
                )}
            </div>
        </div>
    );
}

export default Header;