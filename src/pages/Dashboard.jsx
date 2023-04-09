import { logout } from "../config/firebase";

const Dashboard = () => {
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <h1>Dashboard (Ruta protegida)</h1>
            <button onClick={handleLogout}>Logout</button>
        </>
    );
};

export default Dashboard;
