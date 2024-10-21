import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/inertia-react";
import { MessageSquare, Users, Bell } from "lucide-react";
import axios from "axios";

export default function Dashboard({ auth, errors }) {
    const [recentChats, setRecentChats] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [stats, setStats] = useState({
        activeChats: 0,
        onlineUsers: 0,
        unreadMessages: 0,
    });

    useEffect(() => {
        fetchRecentChats();
        fetchAllUsers();
    }, []);

    const fetchRecentChats = async () => {
        try {
            const response = await axios.get("/chat/recent");
            setRecentChats(response.data);
            setStats((prevStats) => ({
                ...prevStats,
                activeChats: response.data.length,
                unreadMessages: response.data.filter(
                    (chat) => chat.message && !chat.read
                ).length,
            }));
        } catch (error) {
            console.error("Error fetching recent chats:", error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get("chat/users");
            setAllUsers(response.data);
            setStats((prevStats) => ({
                ...prevStats,
                onlineUsers: response.data.filter((user) => user.isActive)
                    .length,
            }));
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                                Welcome, {auth.user.name}!
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <StatCard
                                    name="Active Chats"
                                    value={stats.activeChats}
                                    Icon={MessageSquare}
                                />
                                <StatCard
                                    name="Online Users"
                                    value={stats.onlineUsers}
                                    Icon={Users}
                                />
                                <StatCard
                                    name="Unread Messages"
                                    value={stats.unreadMessages}
                                    Icon={Bell}
                                />
                            </div>

                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Recent Chats
                                    </h3>
                                </div>
                                <div className="border-t border-gray-200">
                                    <ul className="divide-y divide-gray-200">
                                        {recentChats.map((chat) => (
                                            <li
                                                key={chat.user_id}
                                                className="px-4 py-4 sm:px-6"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        {chat.name}
                                                    </p>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {chat.isActive
                                                                ? "Online"
                                                                : "Offline"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:flex sm:justify-between">
                                                    <div className="sm:flex">
                                                        <p className="flex items-center text-sm text-gray-500">
                                                            {chat.message
                                                                ? chat.message
                                                                : "No messages yet"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const StatCard = ({ name, value, Icon }) => (
    <div className="bg-indigo-100 overflow-hidden shadow rounded-lg">
        <div className="p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <Icon
                        className="h-6 w-6 text-indigo-600"
                        aria-hidden="true"
                    />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            {name}
                        </dt>
                        <dd className="text-3xl font-semibold text-gray-900">
                            {value}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
);
