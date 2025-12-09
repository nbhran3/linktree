import LinkItem from "./LinkItem";

type LinktreeData = {
  id: number;
  linktree_suffix: string;
};

type LinkData = {
  id: number;
  link_url: string;
  link_text: string;
};

type LinktreeProps = {
  linktree: LinktreeData;
  link: LinkData[];
  onDelete: (linkId: number) => void;
  onEdit: (
    linkId: number,
    linkData: { linkText: string; linkUrl: string }
  ) => void;
  isAddingLink: boolean;
  onAddClick: () => void;
  onCancelAdd: () => void;
  onSubmitNewLink: () => void;
  newLink: { linkUrl: string; linkText: string };
  onLinkUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLinkTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function LinktreeItem({ 
  linktree, 
  link, 
  onDelete, 
  onEdit,
  isAddingLink,
  onAddClick,
  onCancelAdd,
  onSubmitNewLink,
  newLink,
  onLinkUrlChange,
  onLinkTextChange
}: LinktreeProps) {
  return (
    <>
      <div className="w-full max-w-xl">
        <div className="border border-gray-300 rounded-lg p-4 mt-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              @{linktree.linktree_suffix}
            </h2>
          </div>
          <button 
            className="mt-4 mb-4 w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
            onClick={onAddClick}
          >
            Add Link
          </button>
          <div className="grid gap-3">
            {link.map((link) => (
              <div key={link.id} className="rounded-lg border-2 border-teal-500 bg-white p-3 shadow-sm">
                <LinkItem
                  link={link}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {isAddingLink && (
        <div 
          className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
          onClick={onCancelAdd}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Add New Link</h3>
            <div className="space-y-4">
              <label className="block">
                Link Name:
                <input 
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newLink.linkText}
                  onChange={onLinkTextChange}
                  placeholder="Enter link name"
                />
              </label>
              <label className="block">
                Link URL:
                <input 
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newLink.linkUrl}
                  onChange={onLinkUrlChange}
                  placeholder="https://example.com"
                />
              </label>
              <div className="flex gap-2 justify-end pt-2">
                <button 
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                  onClick={onSubmitNewLink}
                >
                  Submit
                </button>
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={onCancelAdd}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LinktreeItem;
