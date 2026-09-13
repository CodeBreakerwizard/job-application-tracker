import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="border-b bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/dashboard"
                        onClick={closeMenu}
                        className="text-2xl font-bold text-blue-600"
                    >
                        JobTrack
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-6 md:flex">
                        <Link
                            to="/dashboard"
                            className="text-gray-600 transition hover:text-blue-600"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/applications"
                            className="text-gray-600 transition hover:text-blue-600"
                        >
                            Applications
                        </Link>

                        <Link
                            to="/prep"
                            className="text-gray-600 transition hover:text-blue-600"
                        >
                            Interview Prep
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div className="border-t py-4 md:hidden">
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/dashboard"
                                onClick={closeMenu}
                                className="rounded-lg px-3 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/applications"
                                onClick={closeMenu}
                                className="rounded-lg px-3 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            >
                                Applications
                            </Link>

                            <Link
                                to="/prep"
                                onClick={closeMenu}
                                className="rounded-lg px-3 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            >
                                Interview Prep
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-2 rounded-lg bg-gray-900 px-3 py-3 text-left font-medium text-white hover:bg-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;