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
        const fetchDashboardData = async () => {
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

        fetchDashboardData();
    }, []);

    // Application statistics
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

    const oaRate =
        total > 0
            ? Math.round((oa / total) * 100)
            : 0;

    const interviewRate =
        oa > 0
            ? Math.round((interviews / oa) * 100)
            : 0;

    const offerRate =
        interviews > 0
            ? Math.round((offers / interviews) * 100)
            : 0;

    // Application chart data
    const statusData = [
        { name: "Applied", value: applied },
        { name: "OA", value: oa },
        { name: "Interview", value: interviews },
        { name: "Offer", value: offers },
        { name: "Rejected", value: rejected },
    ];

    // Interview preparation statistics
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
            ? Math.round(
                (solvedProblems / totalProblems) * 100
            )
            : 0;

    // Prep chart data
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
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-gray-500">
                    Loading dashboard...
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
                        Dashboard
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Track your job search and interview preparation.
                    </p>
                </div>

                {error && (
                    <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-600">
                        {error}
                    </p>
                )}

                {/* Application Overview */}
                <h2 className="mb-4 mt-8 text-xl font-semibold text-gray-900">
                    Application Overview
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Total */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <h3 className="text-sm font-medium text-gray-500">
                            Total Applications
                        </h3>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {total}
                        </p>
                    </div>

                    {/* Applied */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <h3 className="text-sm font-medium text-gray-500">
                            Applied
                        </h3>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {applied}
                        </p>
                    </div>

                    {/* OA */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <h3 className="text-sm font-medium text-gray-500">
                            Online Assessments
                        </h3>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {oa}
                        </p>
                    </div>

                    {/* Interviews */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <h3 className="text-sm font-medium text-gray-500">
                            Interviews
                        </h3>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {interviews}
                        </p>
                    </div>

                    {/* Offers */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <h3 className="text-sm font-medium text-gray-500">
                            Offers
                        </h3>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {offers}
                        </p>
                    </div>

                    {/* Rejected */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <h3 className="text-sm font-medium text-gray-500">
                            Rejected
                        </h3>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {rejected}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">
                            Application Conversion
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                            {/* OA Rate */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <p className="text-sm font-medium text-gray-500">
                                    Application → OA
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {oaRate}%
                                </p>

                                <p className="mt-2 text-sm text-gray-500">
                                    {oa} of {total} applications
                                </p>
                            </div>

                            {/* Interview Rate */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <p className="text-sm font-medium text-gray-500">
                                    OA → Interview
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {interviewRate}%
                                </p>

                                <p className="mt-2 text-sm text-gray-500">
                                    {interviews} of {oa} OAs
                                </p>
                            </div>

                            {/* Offer Rate */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <p className="text-sm font-medium text-gray-500">
                                    Interview → Offer
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {offerRate}%
                                </p>

                                <p className="mt-2 text-sm text-gray-500">
                                    {offers} of {interviews} interviews
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Application Status Chart */}
                <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-1 text-xl font-semibold text-gray-900">
                        Application Status
                    </h2>

                    <p className="mb-4 text-sm text-gray-500">
                        Distribution of your job applications.
                    </p>

                    {total === 0 ? (
                        <p className="py-10 text-center text-gray-500">
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
                                        {statusData.map((entry, index) => {
                                            const colors = {
                                                Applied: "#3b82f6",
                                                OA: "#8b5cf6",
                                                Interview: "#f97316",
                                                Offer: "#22c55e",
                                                Rejected: "#ef4444",
                                            };

                                            return (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={colors[entry.name]}
                                                />
                                            );
                                        })}
                                    </Pie>

                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Prep Progress */}
                <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Interview Prep Progress
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Overall DSA preparation progress.
                            </p>
                        </div>

                        <p className="text-3xl font-bold text-gray-900">
                            {prepProgress}%
                        </p>
                    </div>

                    <p className="mt-4 text-gray-500">
                        {solvedProblems} / {totalProblems} problems solved
                    </p>

                    <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-3 rounded-full bg-blue-600 transition-all duration-500"
                            style={{
                                width: `${prepProgress}%`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Prep Topic Chart */}
                <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-1 text-xl font-semibold text-gray-900">
                        Preparation by Topic
                    </h2>

                    <p className="mb-4 text-sm text-gray-500">
                        Progress across your interview preparation topics.
                    </p>

                    {prepTopics.length === 0 ? (
                        <p className="py-10 text-center text-gray-500">
                            Add prep topics to see your progress.
                        </p>
                    ) : (
                        <div className="h-80">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
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
                                        fill="#3b82f6"
                                        radius={[6, 6, 0, 0]}
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