import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [prepTopics, setPrepTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications");
                setApplications(response.data.applications);

                const prepResponse = await api.get("/prep");
                setPrepTopics(prepResponse.data.prepTopics);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const total = applications.length;

    const applied = applications.filter(
        (application) => application.status === "Applied"
    ).length;

    const oa = applications.filter(
        (application) => application.status === "OA"
    ).length;

    const interviews = applications.filter(
        (application) => application.status === "Interview"
    ).length;

    const offers = applications.filter(
        (application) => application.status === "Offer"
    ).length;

    const rejected = applications.filter(
        (application) => application.status === "Rejected"
    ).length;

    const statusData = [
        { name: "Applied", value: applied },
        { name: "OA", value: oa },
        { name: "Interview", value: interviews },
        { name: "Offer", value: offers },
        { name: "Rejected", value: rejected },
    ];

    const totalProblems = prepTopics.reduce(
        (sum, topic) => sum + topic.totalProblems,
        0
    );

    const solvedProblems = prepTopics.reduce(
        (sum, topic) => sum + topic.solvedProblems,
        0
    );

    const prepProgress =
        totalProblems > 0
            ? Math.round((solvedProblems / totalProblems) * 100)
            : 0;

    const prepData = prepTopics.map((topic) => ({
        topic: topic.topic,
        progress:
            topic.totalProblems > 0
                ? Math.round(
                    (topic.solvedProblems /
                        topic.totalProblems) *
                    100
                )
                : 0,
    }));

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="mx-auto max-w-6xl p-6">
                <h1>Dashboard</h1>

                {error && <p>{error}</p>}

                <h2 className="mt-8 mb-4 text-2xl font-semibold">
                    Application Overview
                </h2>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-sm font-medium text-gray-500">
                            Total Applications
                        </h3>

                        <p className="mt-2 text-3xl font-bold">
                            {total}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-sm font-medium text-gray-500">
                            Applied
                        </h3>

                        <p className="mt-2 text-3xl font-bold">
                            {applied}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-sm font-medium text-gray-500">
                            Online Assessments
                        </h3>

                        <p className="mt-2 text-3xl font-bold">
                            {oa}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-sm font-medium text-gray-500">
                            Interviews
                        </h3>

                        <p className="mt-2 text-3xl font-bold">
                            {interviews}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-sm font-medium text-gray-500">
                            Offers
                        </h3>

                        <p className="mt-2 text-3xl font-bold">
                            {offers}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-sm font-medium text-gray-500">
                            Rejected
                        </h3>

                        <p className="mt-2 text-3xl font-bold">
                            {rejected}
                        </p>
                    </div>
                </div>

                {/* Application Status Chart */}
                {/* Application Status Chart */}
                <div className="mt-8 rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-2xl font-semibold">
                        Application Status
                    </h2>

                    {total === 0 ? (
                        <p className="text-gray-500">
                            Add applications to see your analytics.
                        </p>
                    ) : (
                        <div className="h-80">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="mt-4 rounded-xl bg-white p-6 shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                        Interview Prep Progress
                    </h3>

                    <p className="mt-2 text-3xl font-bold">
                        {prepProgress}%
                    </p>

                    <p className="mt-2 text-gray-500">
                        {solvedProblems} / {totalProblems} problems solved
                    </p>

                    <div className="mt-4 h-3 w-full rounded-full bg-gray-200">
                        <div
                            className="h-3 rounded-full bg-blue-600"
                            style={{ width: `${prepProgress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="mt-6 rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-2xl font-semibold">
                        Preparation by Topic
                    </h2>

                    {prepTopics.length === 0 ? (
                        <p className="text-gray-500">
                            Add prep topics to see your progress.
                        </p>
                    ) : (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={prepData}>
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="topic" />

                                    <YAxis
                                        domain={[0, 100]}
                                        unit="%"
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="progress"
                                        name="Progress"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;