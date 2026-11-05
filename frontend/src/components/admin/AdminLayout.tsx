import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
    
    return (
        <div>
            {/* sidebar drawer */}
            <AdminSidebar />
            {/* main content */}
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;