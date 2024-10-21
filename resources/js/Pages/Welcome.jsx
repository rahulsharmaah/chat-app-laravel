import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';

export default function Welcome(props) {
    return (
        <>
            <Head title="Welcome to ChatApp" />
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col justify-center items-center p-6">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to ChatApp</h1>
                    <p className="text-center text-gray-600 mb-8">Connect, chat, and collaborate in real-time.</p>
                    
                    <div className="space-y-4">
                        {props.auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition duration-300"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition duration-300"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition duration-300"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                
                <footer className="mt-8 text-center text-white">
                    <p>Created by Rahul Sharma</p>
                    <p className="text-sm">Task Assignment Full Stack Developer</p>
                    <p className="text-xs mt-2">
                        Powered by Laravel v{props.laravelVersion} (PHP v{props.phpVersion})
                    </p>
                </footer>
            </div>
        </>
    );
}