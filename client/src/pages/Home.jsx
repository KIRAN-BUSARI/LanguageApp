import { useEffect, useState } from "react"
import axiosInstance from "../components/Helper/axiosInstance"
import { Link } from "react-router-dom"
function Home() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    useEffect(() => {
        axiosInstance.get("/users/getUser", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                // console.log(res.data.user);
                setUsername(res.data.user.USERNAME)
                setEmail(res.data.user.EMAIL)
            })
    })
    return (
        <>
            <div className="text-3xl h-[88vh] flex flex-col justify-center items-center bg-black text-white">
                <div className="flex justify-center items-center flex-col text-3xl">
                    <div className="text-4xl text-[#0095ff]">Hello {username}</div>
                    {email}
                </div>
                <div className="m-5 border-2 border-[#0095ff] rounded-full px-4 py-3 ">
                    <Link to={"/translate"}>Start Translating</Link>
                </div>
            </div>
        </>
    )
}

export default Home