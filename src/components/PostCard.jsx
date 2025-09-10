import React from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

function PostCard({ title, featuredImage, $id }) {
  const imageUrl = featuredImage
    ? appwriteService.getFilePreview(featuredImage)
    : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="rounded-lg w-full h-40 object-cover"
          />
        </div>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
