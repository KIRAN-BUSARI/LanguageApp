import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/Layout/Layout";
import Translate from "./pages/Translate";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
