import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

export default function Comment({
  comment,
  isLoggedIn,
  currentUserId,
  onDeleteClick,
  highlight, 
}) {

   //Sanitize the comment content and disallow <img> tags
   const sanitizedContent = DOMPurify.sanitize(comment.content, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"], // Allow safe attributes
  });

  return (
    <div
      className={`comment ${
        highlight ? "highlighted-comment" : ""
      }`}
    >
      <div className="flex items-start">
        {comment.user.profileImage && (
          <img
            src={comment.user.profileImage}
            alt={comment.user.name}
            className="w-8 h-8 rounded-full mr-3"
          />
        )}
        <div className="flex-1">
          <p className="text-gray-300 break-words">
            <strong>
              <Link
                to={`/u/${comment.user._id}`}
                className="text-blue-400 hover:underline"
              >
                {comment.user.name}
              </Link>
            </strong>{" "}
            <span dangerouslySetInnerHTML={{ __html: sanitizedContent }}></span>
          </p>
        </div>

        {isLoggedIn && comment.user._id === currentUserId && (
          <button
            onClick={() => onDeleteClick(comment)}
            className="project-button mt-2 text-red-500 hover:text-red-700 flex items-right"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}