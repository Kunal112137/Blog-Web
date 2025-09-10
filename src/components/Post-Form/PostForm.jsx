import React, { useCallback } from "react";
import { RTE, Button, Input, Select } from "../index";
import { useForm } from "react-hook-form";
import appwriteservice from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUserData } from "../../store/authSlice";

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      status: post?.status || ''
    },
  });

  const navigate = useNavigate();
  const userData = useSelector(selectUserData);
  const [preview, setPreview] = React.useState(null);

  // 🔹 Handle form submit
  // 🔹 Handle form submit
  // 🔹 Handle form submit
  const submit = async (data) => {
    console.log("Submitting to Appwrite:", data);
  
    if (!data.slug) {
      data.slug = slugTransform(data.title);
    }
  
    if (!userData) {
      alert("Please log in first!");
      return;
    }
  
    try {
      if (post) {
        // 🔹 Update existing post
        let featuredImage = post.featuredImage;
  
        if (data.image instanceof File) {
          const file = await appwriteservice.uploadFile(data.image);
          if (file) {
            featuredImage = file.$id;
          }
        }
        
  
        const updatedPost = await appwriteservice.updatePost(post.$id, {
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImage,
        });
  
        if (updatedPost) navigate(`/post/${updatedPost.$id}`);
      } else {
        // 🔹 Create new post
        let featuredImage = null;
  
        if (data.image && data.image[0]) {
          const file = await appwriteservice.uploadFile(data.image[0], userData.$id);
          if (file) {
            featuredImage = file.$id;
          }
        }
  
        const dbpost = await appwriteservice.createPost({
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImage,
          userId: userData.$id,
        });
  
        console.log("DB Response:", dbpost);
        if (dbpost) navigate(`/post/${dbpost.$id}`);
      }
    } catch (err) {
      console.error("❌ Error while submitting:", err);
    }
  
    console.log("✅ Final submit data:", {
      ...data,
      image: undefined, // remove FileList from log
    });
  };
  



  // 🔹 Slug generator
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
          }
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
      {/* File input */}
<Input
  label="Featured Image :"
  type="file"
  className="mb-4"
  accept="image/png, image/jpg, image/jpeg, image/gif"
  {...register("image", { required: !post })}
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // ✅ preview works
    }
  }}
/>

{/* Show preview of new image if selected */}
{preview && (
  <div className="w-full mb-4">
    <img
      src={preview}
      alt="Preview"
      className="rounded-lg"
      style={{ width: "100%", height: "auto" }}
    />
  </div>
)}

{/* If editing and no new image chosen, show existing */}
{!preview && post?.featuredImage && (
  <div className="w-full mb-4">
    <img
      src={appwriteservice.getFilePreview(post.featuredImage)}
      alt={post.title || "Post Image"}
      className="rounded-lg"
      style={{ width: "100%", height: "auto" }}
    />
  </div>
)}



        {/* Show preview of new image if selected */}
        {preview && (
          <div className="w-full mb-4">
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              className="rounded-lg"
            />
          </div>
        )}

        {/* If editing and no new image chosen, show existing */}
        {!preview && post?.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={appwriteservice.getFilePreview(post.featuredImage)}
              alt={post.title || "Post Image"}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
