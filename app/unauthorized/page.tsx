"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-red-500/30"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto text-red-400 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </motion.div>

          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="mt-4 text-gray-400">
            You don't have permission to access this page. This area is
            restricted to administrators only.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push("/")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md transition-colors"
          >
            Return to Home
          </button>

          <button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-md transition-colors"
          >
            Go Back
          </button>

          <Link
            href="/login"
            className="text-center bg-transparent hover:bg-gray-700 text-gray-300 px-4 py-3 rounded-md border border-gray-600 transition-colors"
          >
            Login with Different Account
          </Link>
        </div>

        <p className="text-sm text-center text-gray-500 mt-6">
          If you believe this is an error, please contact the site
          administrator.
        </p>
      </motion.div>
    </div>
  );
}
