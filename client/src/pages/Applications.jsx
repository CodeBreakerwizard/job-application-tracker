import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        company: "",
        role: "",
        location: "",
        status: "Applied",
        jobUrl: "",
        salary: "",
        notes: "",
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get("/applications");
            setApplications(response.data.applications);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch applications"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            company: "",
            role: "",
            location: "",
            status: "Applied",
            jobUrl: "",
            salary: "",
            notes: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/applications", {
                ...form,
                salary: form.salary
                    ? Number(form.salary)
                    : undefined,
            });

            setApplications([
                response.data.application,
                ...applications,
            ]);

            resetForm();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create application"
            );
        }
    };

    const handleEdit = (application) => {
        setEditingId(application._id);

        setForm({
            company: application.company,
            role: application.role,
            location: application.location || "",
            status: application.status,
            jobUrl: application.jobUrl || "",
            salary: application.salary || "",
            notes: application.notes || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.put(
                `/applications/${editingId}`,
                {
                    ...form,
                    salary: form.salary
                        ? Number(form.salary)
                        : undefined,
                }
            );

            setApplications(
                applications.map((application) =>
                    application._id === editingId
                        ? response.data.application
                        : application
                )
            );

            setEditingId(null);
            resetForm();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update application"
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/applications/${id}`);

            setApplications(
                applications.filter(
                    (application) => application._id !== id
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete application"
            );
        }
    };

    const filteredApplications = applications
        .filter((application) => {
            const matchesSearch =
                application.company
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                application.role
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                application.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === "newest") {
                return (
                    new Date(b.appliedDate) -
                    new Date(a.appliedDate)
                );
            }

            if (sortBy === "oldest") {
                return (
                    new Date(a.appliedDate) -
                    new Date(b.appliedDate)
                );
            }

            if (sortBy === "company") {
                return a.company.localeCompare(b.company);
            }

            return 0;
        });

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-gray-500">
                    Loading applications...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Job Applications
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Manage and track your job applications.
                    </p>
                </div>

                {error && (
                    <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* Add / Edit Form */}
                <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {editingId
                            ? "Edit Application"
                            : "Add Application"}
                    </h2>

                    <form
                        onSubmit={
                            editingId
                                ? handleUpdate
                                : handleSubmit
                        }
                        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                        <input
                            name="company"
                            placeholder="Company"
                            value={form.company}
                            onChange={handleChange}
                            required
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <input
                            name="role"
                            placeholder="Role"
                            value={form.role}
                            onChange={handleChange}
                            required
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <input
                            name="location"
                            placeholder="Location"
                            value={form.location}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Applied">Applied</option>
                            <option value="OA">OA</option>
                            <option value="Interview">
                                Interview
                            </option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">
                                Rejected
                            </option>
                            <option value="Withdrawn">
                                Withdrawn
                            </option>
                        </select>

                        <input
                            name="jobUrl"
                            placeholder="Job URL"
                            value={form.jobUrl}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <input
                            name="salary"
                            type="number"
                            placeholder="Salary"
                            value={form.salary}
                            onChange={handleChange}
                            min="0"
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <textarea
                            name="notes"
                            placeholder="Notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows="3"
                            className="md:col-span-2 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <div className="flex gap-3 md:col-span-2">
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                            >
                                {editingId
                                    ? "Update Application"
                                    : "Add Application"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        resetForm();
                                    }}
                                    className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Search / Filter / Sort */}
                <div className="mt-8 flex flex-col gap-4 md:flex-row">
                    <input
                        type="text"
                        placeholder="Search company or role..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    >
                        <option value="All">
                            All Statuses
                        </option>
                        <option value="Applied">Applied</option>
                        <option value="OA">OA</option>
                        <option value="Interview">
                            Interview
                        </option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">
                            Rejected
                        </option>
                        <option value="Withdrawn">
                            Withdrawn
                        </option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value)
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    >
                        <option value="newest">
                            Newest First
                        </option>
                        <option value="oldest">
                            Oldest First
                        </option>
                        <option value="company">
                            Company A-Z
                        </option>
                    </select>
                </div>

                {/* Applications */}
                <div className="mt-6">
                    {filteredApplications.length === 0 ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">
                                No applications found
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Try changing your search or filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {filteredApplications.map(
                                (application) => (
                                    <div
                                        key={application._id}
                                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {
                                                        application.company
                                                    }
                                                </h3>

                                                <p className="mt-1 text-gray-600">
                                                    {
                                                        application.role
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-medium ${application.status === "Applied"
                                                    ? "bg-blue-50 text-blue-600"
                                                    : application.status === "OA"
                                                        ? "bg-purple-50 text-purple-600"
                                                        : application.status === "Interview"
                                                            ? "bg-orange-50 text-orange-600"
                                                            : application.status === "Offer"
                                                                ? "bg-green-50 text-green-600"
                                                                : application.status === "Rejected"
                                                                    ? "bg-red-50 text-red-600"
                                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {application.status}
                                            </span>
                                        </div>

                                        <div className="mt-5 space-y-2 text-sm text-gray-600">
                                            <p>
                                                <span className="font-medium text-gray-800">
                                                    Location:
                                                </span>{" "}
                                                {application.location ||
                                                    "Not specified"}
                                            </p>

                                            <p>
                                                <span className="font-medium text-gray-800">
                                                    Applied:
                                                </span>{" "}
                                                {new Date(
                                                    application.appliedDate
                                                ).toLocaleDateString()}
                                            </p>

                                            {application.salary && (
                                                <p>
                                                    <span className="font-medium text-gray-800">
                                                        Salary:
                                                    </span>{" "}
                                                    ₹
                                                    {application.salary.toLocaleString()}
                                                </p>
                                            )}

                                            {application.notes && (
                                                <p>
                                                    <span className="font-medium text-gray-800">
                                                        Notes:
                                                    </span>{" "}
                                                    {
                                                        application.notes
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-3">
                                            {application.jobUrl && (
                                                <a
                                                    href={
                                                        application.jobUrl
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    View Job
                                                </a>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        application
                                                    )
                                                }
                                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        application._id
                                                    )
                                                }
                                                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Applications;