import { Route, Routes } from "react-router-dom";
import UserLayout from "./components/layout/UserLayout";
import Home from "./pages/Home";
import {Toaster} from "sonner"

const App = () => {
  return (
    <>
    <Toaster position="top-right" duration={2000}/>
    <Routes>
      <Route path="/" element={<UserLayout />}>
        {/*User layout */}
        <Route index element={<Home/>}/>
      </Route>
      {/* <Route path="/admin" element={<AdminLayout />} /> */}
    </Routes>
    </>
    
  );
};

export default App;
