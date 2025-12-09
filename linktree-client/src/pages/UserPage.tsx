import { useState, useEffect, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "../context/AuthContext";
import Message from "../components/Message";

type LinktreeData = {
  id: number;
  linktree_suffix: string;
};

function UserPage() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [linktrees, setLinktrees] = useState<LinktreeData[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [newLinktree, setNewlinktree] = useState("");
  const [linktreeToDelete, setLinktreeToDelete] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const apiUrl = "http://localhost:3000";

  const authAxios = axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  });

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    async function fetchLinktrees() {
      const respond = await authAxios.get("/linktrees");
      console.log(respond.data);
      setLinktrees(respond.data.linktrees);
    }
    fetchLinktrees();
  }, []);

  function handleNewLinktree(event: React.ChangeEvent<HTMLInputElement>) {
    setNewlinktree(event.target.value);
    console.log(newLinktree);
  }

  async function handleSubmitNewLinktree() {
    try {
      const respond = await authAxios.post("/linktrees", {
        linktreeSuffix: newLinktree,
      });
      setLinktrees((prev) => [
        ...prev,
        { id: respond.data.id, linktree_suffix: respond.data.linktreeSuffix },
      ]);
      setNewlinktree("");
      setIsClicked(false);
      setMessage({ text: respond.data.message || "Linktree created successfully", type: "success" });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create linktree. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    }
  }

  async function handleDeleteLinktree(id: number) {
    try {
      const respond = await authAxios.delete(`/linktrees/${id}`);
      setLinktrees((prev) => prev.filter((linktree) => linktree.id !== id));
      setLinktreeToDelete(null);
      setMessage({ text: respond.data?.message || "Linktree deleted successfully", type: "success" });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete linktree. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
      setLinktreeToDelete(null);
    }
  }

  function handleIsClicked() {
    setIsClicked(!isClicked);
  }

  function handleLogout() {
    setUserInfo(null);
    navigate("/login");
  }

  return (
    <div className="flex justify-center px-6 min-h-screen py-8 relative">
      <div className="absolute top-4 right-6 z-10">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md font-medium"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
      <div className="w-full max-w-xl">
        <div className="border border-gray-300 rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              My Linktrees
            </h1>
          </div>
          {message && (
            <Message
              message={message.text}
              type={message.type}
              onClose={() => setMessage(null)}
            />
          )}
          {isClicked ? (
            <div className="space-y-4 mb-4">
              <label className="block">
                Linktree Suffix:
                <input
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter linktree suffix"
                  value={newLinktree}
                  onChange={handleNewLinktree}
                />
              </label>
              <div className="flex gap-2 justify-end">
                <button
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                  onClick={handleIsClicked}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                  onClick={handleSubmitNewLinktree}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <button
              className="w-full mb-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
              onClick={handleIsClicked}
            >
              Add New Linktree
            </button>
          )}
          <div className="grid gap-3">
            {linktrees.map((linktree) => (
              <div
                key={linktree.id}
                className="rounded-lg border-2 border-teal-500 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {linktreeToDelete === linktree.id ? (
                  <div className="space-y-3">
                    <p className="text-gray-700 font-medium">
                      Are you sure you want to delete this linktree?
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        onClick={() => handleDeleteLinktree(linktree.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        onClick={() => setLinktreeToDelete(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <Link
                      to={`/linktrees/${linktree.id}`}
                      className="flex-1 min-w-0"
                    >
                      <h2 className="text-xl font-bold text-gray-800 hover:text-teal-600 transition-colors">
                        @{linktree.linktree_suffix}
                      </h2>
                    </Link>
                    <button
                      className="p-2 bg-transparent text-gray-400 hover:text-gray-600 hover:bg-transparent flex-shrink-0"
                      onClick={() => setLinktreeToDelete(linktree.id)}
                      aria-label="Delete linktree"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
