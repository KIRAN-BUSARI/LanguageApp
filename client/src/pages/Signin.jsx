import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import axiosInstance from "../components/Helper/axiosInstance";

const Signin = () => {
    const navigate = useNavigate();

    const [pass, setPass] = useState(true);
    const handlePass = () => {
        setPass(!pass);
    };

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    // function to handle the user input
    const handleUserInput = (event) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    // function to login
    const handleLogin = async (event) => {
        event.preventDefault();

        // checking the empty fields
        if (!loginData.email || !loginData.password) {
            toast.error("Please fill all the fields");
            return;
        }

        try {
            let res = axiosInstance.post("/users/signin", {
                email: loginData.email,
                password: loginData.password,
            })
            // console.log(res.data);
            toast.promise(res, {
                loading: "Logging in...",
                success: (data) => data.data.message,
                error: (err) => err.response.data.message
            })
            res = await res;
            console.log(res.data.role);
            if (res.data.success) {
                // toast.success(res.data.message);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem('role', res.data.role)
                if (res.data.role === "admin") {
                    navigate("/admin");
                    location.reload()
                } else {
                    navigate("/");
                    location.reload()
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        // clearing the login inputs
        setLoginData({
            email: "",
            password: "",
        });
    };

    return (
        <div className="flex items-center justify-center h-[88vh] from-black to-gray-900 bg-gradient-to-tr">
            <form
                onSubmit={handleLogin}
                className="flex flex-col justify-center gap-4 rounded-lg p-4 w-80 h-[26rem] bg-gray-300 shadow-[0_0_15px_black]"
            >
                <h1 className="text-center text-2xl font-bold text-gray-900">
                    Login Page
                </h1>
                <div className="flex flex-col gap-1">
                    <label
                        className="text-lg font-semibold text-gray-900"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        className="bg-transparent px-2 py-1 border border-gray-900 text-black"
                        value={loginData.email}
                        onChange={handleUserInput}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        className="text-lg font-semibold text-gray-900"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="flex items-center">
                        <input
                            required
                            type={pass ? "password" : "text"}
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            className="bg-transparent px-2 py-1 max-w-full w-96 border border-gray-900 text-black"
                            value={loginData.password}
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

                {/* guest account access */}
                <div
                    onClick={() =>
                        setLoginData({ email: "test@gmail.com", password: "Test@123" })
                    }
                    className="text-center link text-gray-900 cursor-pointer"
                >
                    Guest Login
                </div>

                <button
                    className="w-full bg-[#0095ff] hover:text-white rounded-sm py-2 font-semibold text-lg cursor-pointer"
                    type="submit"
                >
                    Login
                </button>

                {/* <Link to={"/forgetpassword"}>
                    <p className="text-center link text-[#0095ff] cursor-pointer hover:underline">
                        Forget Password ?
                    </p>
                </Link> */}

                <p className="text-center">
                    {"Don't have an account ? "}
                    <Link
                        to={"/signup"}
                        className="link text-[#0095ff] cursor-pointer  hover:underline"
                    >
                        Create Account
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signin;