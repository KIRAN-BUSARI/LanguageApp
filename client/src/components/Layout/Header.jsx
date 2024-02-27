import { useEffect, useState } from "react"
import axiosInstance from "../Helper/axiosInstance"
import { HiMiniLanguage } from "react-icons/hi2";
const Header = () => {
    const [username, setUsername] = useState("")

    useEffect(() => {
        axiosInstance.get("/users/getUser", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                // console.log(res.data.user);
                // setUsername(res.data.user.firstName + " " + res.data.user.lastName)
                setUsername(res.data.user.USERNAME)
            })
    })
    return <div className="shadow h-14 flex justify-between bg-black">
        <div className="flex text-3xl items-center text-white ml-3">
            <HiMiniLanguage />
        </div>
        <div className="flex flex-col justify-center h-full ml-4 text-white font-bold">
            Language Translator App
        </div>
        <div className="flex mr-3">
            <div className="flex flex-col justify-center h-full mr-2 text-xl text-white">
                Hello
            </div>
            <div className="mr-3 uppercase flex items-center text-gray-200 text-xl font-bold">
                {username}
            </div>
        </div>
    </div >
}

export default Header;