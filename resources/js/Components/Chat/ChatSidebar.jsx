import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/inertia-react";
import { Search, MessageSquarePlus, User } from "lucide-react";
import axios from "axios";

export default function ChatSidebar({ recentMessages }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get("/chat/users");
            setAllUsers(response.data);
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    };

    const filteredUsers = showAllUsers
        ? allUsers.filter((user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : recentMessages.filter((user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

    return (
        <div className="flex flex-col h-screen bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center mb-4">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="search"
                        className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400 bg-gray-100 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Search users"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <button
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => setShowAllUsers(!showAllUsers)}
                    >
                        {showAllUsers ? "Show Recent" : "Show All Users"}
                    </button>
                    <button className="text-blue-500 hover:text-blue-600">
                        <MessageSquarePlus className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredUsers.map((user, index) => (
                    <Link
                        href={`/chat/${user.user_id}`}
                        key={index}
                        className="flex items-center px-4 py-3 hover:bg-gray-100 transition duration-150 ease-in-out"
                    >
                        <div className="flex-shrink-0 relative">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <User className="w-10 h-10 text-gray-400 bg-gray-200 rounded-full p-2" />
                            )}
                            <span
                                className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white ${
                                    user.isActive
                                        ? "bg-green-400"
                                        : "bg-gray-300"
                                }`}
                            ></span>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.name}
                                </p>
                                {!showAllUsers && (
                                    <p className="text-xs text-gray-500">
                                        {user.lastMessageTime}
                                    </p>
                                )}
                            </div>
                            {!showAllUsers && (
                                <p className="text-sm text-gray-500 truncate">
                                    {user.message}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
