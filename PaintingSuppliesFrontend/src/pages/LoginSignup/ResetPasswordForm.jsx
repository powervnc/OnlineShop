import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useInput from "./useInput";

function ResetPasswordForm() {
  const [username, bindUsername] = useInput("");
  const [email, bindEmail] = useInput("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await fetch("http://localhost:5000/api1/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password.");
      }

      // Password reset successfully, navigate to a success page or login page
      navigate('/'); // Redirect to login page after successful reset
    } catch (error) {
      setErrorMessage(error.message || "Failed to reset password.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              {...bindUsername}
              className="w-full px-3 py-2 border rounded"
              placeholder="Username"
            />
          </div>
          <div>
            <input
              type="email"
              {...bindEmail}
              className="w-full px-3 py-2 border rounded"
              placeholder="Email"
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
