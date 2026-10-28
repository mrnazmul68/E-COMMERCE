import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const UserLayout = () => {
  return (
    <div>
      {/*Header (includes Topbar + Navbar)*/}
      <Header/>
      {/*Main content*/}
      <main>
        <Outlet />
      </main>
      {/*Footer*/}
      <Footer/>
    </div>
  );
};

export default UserLayout;
