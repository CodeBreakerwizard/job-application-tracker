import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Prep() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        topic: "",
        totalProblems: "",
        solvedProblems: "",
    });

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await api.get("/prep");
            setTopics(response.data.prepTopics);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch prep topics"
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
            topic: "",
            totalProblems: "",
            solvedProblems: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (
            Number(form.solvedProblems) >
            Number(form.totalProblems)
        ) {
            setError(
                "Solved problems cannot exceed total problems."
            );
            return;
        }

        try {
            const response = await api.post("/prep", {
                topic: form.topic,
                totalProblems: Number(form.totalProblems),
                solvedProblems: Number(form.solvedProblems),
            });

            setTopics([
                response.data.prepTopic,
                ...topics,
            ]);

            resetForm();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create prep topic"
            );
        }
    };

    const handleEdit = (topic) => {
        setEditingId(topic._id);

        setForm({
            topic: topic.topic,
            totalProblems: topic.totalProblems,
            solvedProblems: topic.solvedProblems,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");

        if (
            Number(form.solvedProblems) >
            Number(form.totalProblems)
        ) {
            setError(
                "Solved problems cannot exceed total problems."
            );
            return;
        }

        try {
            const response = await api.put(
                `/prep/${editingId}`,
                {
                    topic: form.topic,
                    totalProblems: Number(
                        form.totalProblems
                    ),
                    solvedProblems: Number(
                        form.solvedProblems
                    ),
                }
            );

            setTopics(
                topics.map((topic) =>
                    topic._id === editingId
                        ? response.data.prepTopic
                        : topic
                )
            );

            setEditingId(null);
            resetForm();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update prep topic"
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/prep/${id}`);

            setTopics(
                topics.filter(
                    (topic) => topic._id !== id
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete prep topic"
            );
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-gray-500">
                    Loading prep tracker...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="mx-auto max-w-6xl px-6 py-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Interview Prep
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Track your DSA and interview preparation progress.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* Form */}
                <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {editingId
                            ? "Edit Topic"
                            : "Add Preparation Topic"}
                    </h2>

                    <form
                        onSubmit={
                            editingId
                                ? handleUpdate
                                : handleSubmit
                        }
                        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                        <input
                            name="topic"
                            placeholder="Topic (e.g. Arrays)"
                            value={form.topic}
                            onChange={handleChange}
                            required
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <input
                            name="totalProblems"
                            type="number"
                            min="0"
                            placeholder="Total Problems"
                            value={form.totalProblems}
                            onChange={handleChange}
                            required
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <input
                            name="solvedProblems"
                            type="number"
                            min="0"
                            placeholder="Solved Problems"
                            value={form.solvedProblems}
                            onChange={handleChange}
                            required
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <div className="flex gap-3 md:col-span-3">
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                            >
                                {editingId
                                    ? "Update Topic"
                                    : "Add Topic"}
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

                {/* Topics */}
                <div className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        My Preparation
                    </h2>

                    {topics.length === 0 ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">
                                No topics added yet
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Add your first preparation topic above.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {topics.map((topic) => {
                                const progress =
                                    topic.totalProblems > 0
                                        ? Math.min(
                                              100,
                                              Math.round(
                                                  (topic.solvedProblems /
                                                      topic.totalProblems) *
                                                      100
                                              )
                                          )
                                        : 0;

                                return (
                                    <div
                                        key={topic._id}
                                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {topic.topic}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {
                                                        topic.solvedProblems
                                                    }{" "}
                                                    /{" "}
                                                    {
                                                        topic.totalProblems
                                                    }{" "}
                                                    problems solved
                                                </p>
                                            </div>

                                            <span className="text-lg font-bold text-blue-600">
                                                {progress}%
                                            </span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="h-3 rounded-full bg-blue-600 transition-all duration-500"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            ></div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        topic
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
                                                        topic._id
                                                    )
                                                }
                                                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Prep;