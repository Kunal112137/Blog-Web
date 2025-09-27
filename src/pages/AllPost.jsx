import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components/index";
import appwriteService from "../appwrite/config";

function AllPost() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts().then((res) => {
      if (res) {
        // Map posts to include a proper image URL
        const postsWithImage = res.documents.map((post) => {
          // Check if featuredimage exists
          const imageUrl = post.featuredImage
            ? `https://[YOUR_APPWRITE_ENDPOINT]/v1/storage/buckets/[BUCKET_ID]/files/${post.featuredimage}/view?project=[PROJECT_ID]`
            : null;

          return {
            ...post,
            featuredImage: imageUrl,
          };
        });

        setPosts(postsWithImage);
      }
    });
  }, []);

  return (
    <div className="w-full py-8 ">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPost;
