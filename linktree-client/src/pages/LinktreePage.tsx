import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LinktreeItem from "../components/LinktreeItem";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Message from "../components/Message";

type Link = {
  id: number;
  link_url: string;
  link_text: string;
  name: string;
};

type Linktree = {
  id: number;
  linktree_suffix: string;
};

function LinktreePage() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const [links, setLinks] = useState<Link[]>([]);
  const [linktree, setLinktree] = useState<Linktree>();
  const [isClicked, setIsClicked] = useState(false);
  const [newLink, setNewLink] = useState({ linkUrl: "", linkText: "" });
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const apiUrl = "http://localhost:3000/linktrees";

  const authAxios = axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  });

  useEffect(() => {
    async function fetchLinks() {
      const respond = await authAxios.get(`/${id}`);
      console.log(respond);
      setLinks(respond.data.links);
      setLinktree({
        id: respond.data.id,
        linktree_suffix: respond.data.linktreeSuffix,
      });
    }

    fetchLinks();
  }, [id]);

  function handleLinkUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setNewLink((prevValue) => ({
      linkUrl: newValue,
      linkText: prevValue.linkText,
    }));
  }

  function handleLinkTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setNewLink((prevValue) => ({
      linkUrl: prevValue.linkUrl,
      linkText: newValue,
    }));
  }

  async function handleSubmitNewLink() {
    const { linkUrl, linkText } = newLink;
    try {
      const respond = await authAxios.post(`/${id}/links`, {
        linkText: linkText,
        linkUrl: linkUrl,
      });
      setLinks(respond.data.links);
      setNewLink({ linkUrl: "", linkText: "" });
      setIsClicked(!isClicked);
      setMessage({ text: respond.data.message || "Link added successfully", type: "success" });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to add link. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    }
  }

  async function handleDeleteLink(linkId: number) {
    try {
      const respond = await authAxios.delete(`/${id}/links/${linkId}`);
      setLinks(respond.data.links);
      setMessage({ text: respond.data.message || "Link deleted successfully", type: "success" });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete link. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    }
  }

  async function handleEditLink(
    linkId: number,
    linkData: { linkUrl: string; linkText: string }
  ) {
    try {
      const respond = await authAxios.patch(`${id}/links/${linkId}`, linkData);
      setLinks(respond.data.links);
      setMessage({ text: respond.data.message || "Link updated successfully", type: "success" });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update link. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    }
  }

  function handleIsClicked() {
    setIsClicked(!isClicked);
  }

  function handleIsMenuClicked() {
    setIsMenuClicked(!isMenuClicked);
  }

  function handleLogout() {
    setUserInfo(null);
    navigate("/login");
  }

  function handleNavigateToLinktrees() {
    navigate("/userPage");
  }

  if (!linktree) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex justify-center px-6 relative min-h-screen bg-gray-50">
      <div className="absolute top-4 right-6 z-10">
        <button
          className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow-md"
          onClick={handleIsMenuClicked}
          aria-label="Toggle menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        {isMenuClicked && (
          <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 space-y-2 min-w-[180px] animate-slideDown">
            <button
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between"
              onClick={handleNavigateToLinktrees}
            >
              Linktrees List
            </button>
            <button
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
      <div className="w-full max-w-xl">
        {message && (
          <div className="mb-4">
            <Message
              message={message.text}
              type={message.type}
              onClose={() => setMessage(null)}
            />
          </div>
        )}
        <LinktreeItem
        linktree={linktree}
        link={links}
        onDelete={handleDeleteLink}
        onEdit={handleEditLink}
        isAddingLink={isClicked}
        onAddClick={handleIsClicked}
        onCancelAdd={handleIsClicked}
        onSubmitNewLink={handleSubmitNewLink}
        newLink={newLink}
        onLinkUrlChange={handleLinkUrlChange}
        onLinkTextChange={handleLinkTextChange}
      />
      </div>
    </div>
  );
}

export default LinktreePage;
