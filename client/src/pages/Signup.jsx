import { useState } from "react";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../components/Helper/axiosInstance";

const Signup = () => {
    const navigate = useNavigate();

    const [pass, setPass] = useState(true);
    const handlePass = () => {
        setPass(!pass);
    }
    // for user input
    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: "",
    });

    // function to set the signup data
    const handleUserInput = (event) => {
        const { name, value } = event.target;
        setSignupData({
            ...signupData,
            [name]: value,
        });
    };

    const createNewAccount = async (event) => {
        event.preventDefault();

        // ... (previous code)
        // checking the empty fields
        if (
            !signupData.email ||
            !signupData.username ||
            !signupData.password
        ) {
            toast.error("Please fill all the fields");
            return;
        }

        // checking the name field length
        if (signupData.username.length < 5) {
            toast.error("Name should be atleast of 5 characters");
            return;
        }

        // email validation using regex
        if (
            !signupData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
        ) {
            toast.error("Invalid email id");
            return;
        }

        // password validation using regex
        if (!signupData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
            toast.error(
                "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol", {
                duration: 3000
            }
            );
            return;
        }
        try {
            const res = await axiosInstance.post("/users/signup", {
                username: signupData.username,
                email: signupData.email,
                password: signupData.password
            });
            // console.log(res.data.token);
            if (res.data.success) {
                toast.success(res.data.message);
                localStorage.setItem("token", res.data.token);
                navigate("/");
                location.reload()
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        // clearing the signup inputs
        setSignupData({
            username: "",
            email: "",
            password: "",
        });
    };

    return (
        <div className="flex items-center justify-center h-[88vh] from-black to-gray-900 bg-gradient-to-tr">
            <form
                onSubmit={createNewAccount}
                className="flex flex-col justify-center gap-3 rounded-lg p-4 w-96 shadow-[0_0_10px_black] bg-gray-300"
            >
                <h1 className="text-center text-2xl font-bold text-gray-900">
                    Registration Page
                </h1>

                {/* input for name */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-900" htmlFor="username">
                        Name
                    </label>
                    <input
                        required
                        type="name"
                        name="username"
                        id="username"
                        placeholder="Enter your name"
                        className="bg-transparent px-2 py-1 border text-black rounded-md"
                        value={signupData.username}
                        onChange={handleUserInput}
                    />
                </div>

                {/* input for email */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-900" htmlFor="email">
                        Email
                    </label>
                    <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        className="bg-transparent px-2 py-1 border text-black rounded-md"
                        value={signupData.email}
                        onChange={handleUserInput}
                    />
                </div>

                {/* input for password */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-900" htmlFor="password">
                        Password
                    </label>
                    <div className="flex items-center">
                        <input
                            required
                            type={pass ? "password" : "text"}
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            className="bg-transparent px-2 py-1 max-w-full w-96 border text-black rounded-md"
                            value={signupData.password}
                            onChange={handleUserInput}
                        />
                        <div className="-ml-7 cursor-pointer">
                            {pass ? (
                                <ImEye onClick={handlePass} />
                            ) : (
                                <ImEyeBlocked onClick={handlePass} />
                            )}
                        </div>
                    </div>
                </div>
                {/* registration button */}
                <button
                    className="w-full bg-[#0095ff] hover:text-white border-2 rounded-md py-2 font-semibold text-lg cursor-pointer"
                    type="submit"
                >
                    Create Account
                </button>

                <p className="text-center">
                    Already have an account ?{" "}
                    <Link to={"/signin"} className="link text-[#0095ff] cursor-pointer hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;