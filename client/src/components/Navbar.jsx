import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav>
            <h2>JobTrack</h2>

            <div>
                <Link to="/dashboard">Dashboard</Link>
                {" | "}
                <Link to="/applications">Applications</Link>
                {" | "}
                <Link to="/prep">Interview Prep</Link>
                {" | "}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;