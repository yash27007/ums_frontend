"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  teacherId:string;
  studentId:string;
  iat: number;
  exp: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const getUserRole = (token: string): string => {
    try {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      console.log(decoded)
      return decoded.role.toUpperCase();
    } catch (err) {
      console.error("Error decoding token:", err);
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.auth.login(email, password);
      setToken(response.accessToken);
  
      const role = getUserRole(response.accessToken);
      console.log("Decoded Role:", role); // Debugging
  
      if (!role) {
        setError("Invalid token data.");
        return;
      }
  
      switch (role) {
        case "ADMIN":
          console.log("Redirecting to /admin");
          router.replace("/admin");
          break;
        case "TEACHER":
          console.log("Redirecting to /teacher");
          router.push("/teacher");
          break;
        case "STUDENT":
          console.log("Redirecting to /student");
          router.push("/student");
          break;
        default:
          setError("Unauthorized role.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials.");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            User Management System Sign In
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
