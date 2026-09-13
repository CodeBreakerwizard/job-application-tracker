import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post(
                "/applications",
                {
                    ...form,
                    salary: form.salary
                        ? Number(form.salary)
                        : undefined,
                }
            );

            setApplications([
                response.data.application,
                ...applications,
            ]);

            setForm({
                company: "",
                role: "",
                location: "",
                status: "Applied",
                jobUrl: "",
                salary: "",
                notes: "",
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create application"
            );
        }
    };

    const handleDelete = async (id) => {
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

            setForm({
                company: "",
                role: "",
                location: "",
                status: "Applied",
                jobUrl: "",
                salary: "",
                notes: "",
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update application"
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
                return new Date(b.appliedDate) - new Date(a.appliedDate);
            }

            if (sortBy === "oldest") {
                return new Date(a.appliedDate) - new Date(b.appliedDate);
            }

            if (sortBy === "company") {
                return a.company.localeCompare(b.company);
            }

            return 0;
        });

    if (loading) {
        return <p>Loading applications...</p>;
    }

    return (
        <div>
            <Navbar />

            <h1>Job Applications</h1>

            <div>
                <input
                    type="text"
                    placeholder="Search company or role"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="OA">OA</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Withdrawn">Withdrawn</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="company">Company A-Z</option>
                </select>

            </div>

            {error && <p>{error}</p>}

            <form onSubmit={editingId ? handleUpdate : handleSubmit}>
                <input
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleChange}
                    required
                />

                <input
                    name="role"
                    placeholder="Role"
                    value={form.role}
                    onChange={handleChange}
                    required
                />

                <input
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                />

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="Applied">Applied</option>
                    <option value="OA">OA</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Withdrawn">Withdrawn</option>
                </select>

                <input
                    name="jobUrl"
                    placeholder="Job URL"
                    value={form.jobUrl}
                    onChange={handleChange}
                />

                <input
                    name="salary"
                    type="number"
                    placeholder="Salary"
                    value={form.salary}
                    onChange={handleChange}
                />

                <textarea
                    name="notes"
                    placeholder="Notes"
                    value={form.notes}
                    onChange={handleChange}
                />

                <button type="submit">
                    {editingId ? "Update Application" : "Add Application"}
                </button>
            </form>

            <hr />

            {applications.length === 0 ? (
                <p>No applications yet.</p>
            ) : filteredApplications.length === 0 ? (
                <p>No matching applications found.</p>
            ) : (
                filteredApplications.map((application) => (
                    <div key={application._id}>
                        <h3>{application.company}</h3>

                        <p>Role: {application.role}</p>

                        <p>Location: {application.location || "Not specified"}</p>

                        <p>Status: {application.status}</p>

                        <p>
                            Applied:{" "}
                            {new Date(application.appliedDate).toLocaleDateString()}
                        </p>

                        {application.salary && (
                            <p>Salary: ₹{application.salary}</p>
                        )}

                        {application.jobUrl && (
                            <p>
                                <a
                                    href={application.jobUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View Job
                                </a>
                            </p>
                        )}

                        {application.notes && (
                            <p>Notes: {application.notes}</p>
                        )}

                        <button onClick={() => handleEdit(application)}>
                            Edit
                        </button>

                        <button onClick={() => handleDelete(application._id)}>
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Applications;