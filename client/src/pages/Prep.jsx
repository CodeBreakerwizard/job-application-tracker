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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

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

            setForm({
                topic: "",
                totalProblems: "",
                solvedProblems: "",
            });
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
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.put(
                `/prep/${editingId}`,
                {
                    topic: form.topic,
                    totalProblems: Number(form.totalProblems),
                    solvedProblems: Number(form.solvedProblems),
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

            setForm({
                topic: "",
                totalProblems: "",
                solvedProblems: "",
            });
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
                topics.filter((topic) => topic._id !== id)
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete prep topic"
            );
        }
    };

    if (loading) {
        return <p>Loading prep tracker...</p>;
    }

    return (
        <div>
            <Navbar />

            <h1>Interview Prep</h1>

            {error && <p>{error}</p>}

            <h2>Add Topic</h2>

            <form onSubmit={editingId ? handleUpdate : handleSubmit}>
                <input
                    name="topic"
                    placeholder="Topic"
                    value={form.topic}
                    onChange={handleChange}
                    required
                />

                <input
                    name="totalProblems"
                    type="number"
                    placeholder="Total Problems"
                    value={form.totalProblems}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <input
                    name="solvedProblems"
                    type="number"
                    placeholder="Solved Problems"
                    value={form.solvedProblems}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <button type="submit">
                    {editingId ? "Update Topic" : "Add Topic"}
                </button>
            </form>

            <hr />

            <h2>My Preparation</h2>

            {topics.length === 0 ? (
                <p>No topics added yet.</p>
            ) : (
                topics.map((topic) => (
                    <div key={topic._id}>
                        <h3>{topic.topic}</h3>

                        <p>
                            {topic.solvedProblems} /{" "}
                            {topic.totalProblems} solved
                        </p>

                        <p>
                            Progress:{" "}
                            {topic.totalProblems > 0
                                ? Math.round(
                                    (topic.solvedProblems /
                                        topic.totalProblems) *
                                    100
                                )
                                : 0}
                            %
                        </p>

                        <button
                            type="button"
                            onClick={() => handleEdit(topic)}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDelete(topic._id)}
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Prep;