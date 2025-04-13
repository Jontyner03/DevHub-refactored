import { useState } from "react";

export default function TagSelector({ availableTags, selectedTags, setSelectedTags }) {
  const [input, setInput] = useState("");
  const [filteredTags, setFilteredTags] = useState(availableTags);
  const [showList, setShowList] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Filter tags based on input and sort by relevance
    const filtered = availableTags
      .filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()))
      .sort(
        (a, b) =>
          a.name.toLowerCase().indexOf(value.toLowerCase()) -
          b.name.toLowerCase().indexOf(value.toLowerCase())
      );

    setFilteredTags(filtered);
  };

  const handleTagClick = (tag) => {
    if (!selectedTags.some((selected) => selected.name === tag.name)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setInput(""); // Reset input
    setFilteredTags(availableTags); // Reset filtered tags
    setShowList(false); // Hide the list after selecting a tag
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag.name !== tagToRemove.name));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <div
            key={tag.name}
            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full shadow"
          >
            {tag.icon && <img src={tag.icon} alt="" className="w-4 h-4 mr-2" />}
            <span>{tag.name}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-xs text-gray-200 hover:text-gray-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onFocus={() => setShowList(true)} 
        placeholder="Add tags"
        className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showList && (
        <ul className="bg-gray-800 border border-gray-700 rounded shadow max-h-40 overflow-y-auto">
          {filteredTags.map((tag) => (
            <li
              key={tag.name}
              onClick={() => handleTagClick(tag)}
              className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer text-white"
            >
              {tag.icon && <img src={tag.icon} alt="" className="w-4 h-4 mr-2" />}
              {tag.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
