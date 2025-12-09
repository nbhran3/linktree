import { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

type LinkData = {
  id: number;
  link_url: string;
  link_text: string;
};

type LinkProps = {
  link: LinkData;
  onDelete?: (linkId: number) => void;
  onEdit?: (
    linkId: number,
    linkData: { linkUrl: string; linkText: string }
  ) => void;
  isEditable?: boolean;
};

function LinkItem({ link, onDelete, onEdit, isEditable = true }: LinkProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLinkUrl, setEditLinkUrl] = useState(link.link_url);
  const [editLinkText, setEditLinkText] = useState(link.link_text);

  function handleLinkUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditLinkUrl(event.target.value);
  }

  function handleLinkTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditLinkText(event.target.value);
  }

  function handleEditClick() {
    setIsEditing(!isEditing);
  }

  function handleEdit() {
    onEdit(link.id, { linkUrl: editLinkUrl, linkText: editLinkText });
    handleEditClick();
  }

  function handleDelete() {
    onDelete(link.id);
    handleEditClick();
  }

  if (!isEditable) {
    return (
      <a
        href={link.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex-1 min-w-0">
          <div className="block font-bold mb-1 text-gray-800">
            {link.link_text}
          </div>
          <div className="block text-gray-600 text-sm">{link.link_url}</div>
        </div>
      </a>
    );
  }

  return (
    <div>
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <label className="block">
            Link Name:
            <input
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              value={editLinkText}
              onChange={handleLinkTextChange}
            />
          </label>
          <label className="block">
            Link URL:
            <input
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              value={editLinkUrl}
              onChange={handleLinkUrlChange}
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              onClick={handleEdit}
            >
              Submit
            </button>
            <button
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              onClick={handleEditClick}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="block font-bold mb-1">{link.link_text}</div>
            <div className="block text-gray-600">{link.link_url}</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="p-2 bg-transparent text-gray-400 hover:text-gray-600 hover:bg-transparent"
              onClick={handleEditClick}
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              className="p-2 bg-transparent text-gray-400 hover:text-gray-600 hover:bg-transparent"
              onClick={handleDelete}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkItem;
