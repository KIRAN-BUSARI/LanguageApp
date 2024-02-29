import { useEffect, useState } from "react";
import axiosInstance from "../components/Helper/axiosInstance";

const AdminPage = () => {
    // Check if the user is an admin
    const isAdmin = localStorage.getItem("role") === "admin";

    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (isAdmin) {
            axiosInstance.get("/users/getAllUsers")
                .then((res) => {
                    setUsers(res.data.users);
                    // console.log(res.data.users);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [])

    if (!isAdmin) {
        return (
            <div className="h-screen flex justify-center items-center">
                <h1>Unauthorized Access</h1>
            </div>
        );
    }

    return (
        <div className="h-[88vh] flex justify-center items-center bg-black text-white">
            <div className="border border-black p-2 m-2 bg-gray-500 w-[40vw] rounded-md ">
                <h1 className="text-center bold text-3xl ">Users </h1>
                {users.map((user, index) => (
                    <div key={index}>
                        <p>Name: {user.USERNAME}</p>
                        <p>Email: {user.EMAIL}</p>
                        <p>Role: {user.ROLE}</p>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;
