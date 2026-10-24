import { Route, Routes } from "react-router-dom";
import UserLayout from "./components/layout/UserLayout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        {/*User layout */}
      </Route>
      {/* <Route path="/admin" element={<AdminLayout />} /> */}
    </Routes>
  );
};

export default App;
