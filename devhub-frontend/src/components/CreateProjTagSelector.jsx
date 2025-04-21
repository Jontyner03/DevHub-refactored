import { useState } from "react";

export default function CreateProjTagSelector({ availableTags: initialAvailableTags, selectedTags, setSelectedTags, prompt, name  }) {
  const [input, setInput] = useState("");
  const [availableTags, setAvailableTags] = useState(initialAvailableTags); 
  const [filteredTags, setFilteredTags] = useState(initialAvailableTags);
  const [showList, setShowList] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    //Filter tags based on input and sort by relevance
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
      const updatedAvailableTags = availableTags.filter(
        (availableTag) => availableTag.name !== tag.name
      ); //Remove tag from availableTags
      //add tag to selected, rmv from available, rmv tag from filtered
      setSelectedTags([...selectedTags, tag]); 
      setAvailableTags(updatedAvailableTags); 
      setFilteredTags(updatedAvailableTags); 
    }
    setInput(""); //Reset input
    setShowList(false); //Hide the list after selecting a tag
  };

  //rmv tag from selected and add back to available tags 
  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag.name !== tagToRemove.name)); 
    setAvailableTags([...availableTags, tagToRemove]);
  };

  return (
    <div className="space-y-2">
      {/* Display Selected Tags */}
        <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <div
            key={tag.name}
            className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-full shadow transition hover:bg-gray-700 hover:shadow-lg"
          >
            {tag.icon && <img src={tag.icon} alt="" className="w-4 h-4 mr-2" />}
            <span>{tag.name}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="tag-remove-button ml-2 text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Input Field for Adding Tags */}
      <input
        id={name} 
        name={name} 
        type="text"
        value={input}
        onChange={handleInputChange}
        onFocus={() => setShowList(true)}
        placeholder={prompt || "Add tags"}
        className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Dropdown List of Available Tags */}
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