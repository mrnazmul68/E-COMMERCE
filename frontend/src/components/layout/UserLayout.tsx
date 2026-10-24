import { Outlet } from "react-router-dom";
import Header from "../common/Header";

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
    </div>
  );
};

export default UserLayout;
