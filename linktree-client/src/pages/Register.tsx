import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";

function Register() {
  const navigate = useNavigate();
  const [registerInfo, setRegisterInfo] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setRegisterInfo((prevValue) => ({
      password: prevValue.password,
      email: newValue,
    }));
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setRegisterInfo((prevValue) => ({
      password: newValue,
      email: prevValue.email,
    }));
  }

  async function handleCheckRegisterInfo() {
    const { email, password } = registerInfo;
    try {
      const respond = await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
      });
      setMessage({ text: respond.data.message || "Registration successful", type: "success" });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    }
  }

  return (
    <div className="flex justify-center px-6 min-h-screen items-center">
      <div className="w-full max-w-xl">
        <div className="border border-gray-300 rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Register</h1>
          </div>
          {message && (
            <Message
              message={message.text}
              type={message.type}
              onClose={() => setMessage(null)}
            />
          )}
          <div className="space-y-4">
            <label className="block">
              Email:
              <input
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                name="email"
                placeholder="Enter Email"
                value={registerInfo.email}
                onChange={handleEmailChange}
              />
            </label>
            <label className="block">
              Password:
              <input
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                name="password"
                type="password"
                placeholder="Enter Password"
                value={registerInfo.password}
                onChange={handlePasswordChange}
              />
            </label>
            <button 
              className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
              onClick={handleCheckRegisterInfo}
            >
              Register
            </button>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-500 hover:text-teal-600 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
