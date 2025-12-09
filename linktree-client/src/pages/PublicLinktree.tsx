import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LinkItem from "../components/LinkItem";

type Link = {
  id: number;
  link_url: string;
  link_text: string;
};

type PublicLinktreeData = {
  linktreeSuffix: string;
  links: Link[];
};

function PublicLinktree() {
  const { suffix } = useParams<{ suffix: string }>();
  const [linktree, setLinktree] = useState<PublicLinktreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublicLinktree() {
      if (!suffix) {
        setError("No linktree suffix provided");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching linktree with suffix:", suffix);
        const response = await axios.get(
          `http://localhost:3000/public/linktrees/${suffix}`
        );
        console.log("Response data:", response.data);
        setLinktree(response.data);
      } catch (err: any) {
        console.error("Error fetching public linktree:", err);
        console.error("Error response:", err.response);
        console.error("Error response data:", err.response?.data);
        console.error("Error status:", err.response?.status);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load linktree";
        setError(errorMessage);
        setLinktree(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicLinktree();
  }, [suffix]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <div className="text-gray-600 text-sm">
            Suffix: {suffix || "N/A"}
          </div>
          <div className="text-gray-500 text-xs mt-2">
            Check the browser console for more details
          </div>
        </div>
      </div>
    );
  }

  if (!linktree) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-600 text-lg">Linktree not found</div>
          <div className="text-gray-500 text-sm mt-2">
            Suffix: {suffix || "N/A"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-6 min-h-screen py-8">
      <div className="w-full max-w-xl">
        <div className="border border-gray-300 rounded-lg p-4 mt-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              @{linktree.linktreeSuffix}
            </h2>
          </div>
          <div className="grid gap-3">
            {linktree.links.map((link) => (
              <div
                key={link.id}
                className="rounded-lg border-2 border-teal-500 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <LinkItem link={link} isEditable={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicLinktree;
