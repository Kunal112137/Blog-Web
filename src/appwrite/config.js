import conf from '../config/conf';
import { Client, ID, Databases, Storage } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // 🔹 Create a new blog post
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),   // document ID
                {
                    title,
                    slug,       // keep slug as a field, not doc ID
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
        }
    }

    // 🔹 Update post (use post.$id, not slug)
    async updatePost(postId, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId,   // ✅ must be the document ID
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    // 🔹 Delete post (use post.$id)
    async deletePost(postId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId   // ✅ must be the document ID
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    // 🔹 Get single post
    async getPost(postId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId
            );
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    // 🔹 Get all posts (default: active ones)
    async getPosts(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    // 🔹 File upload (fixed: no permissions array here)
    // 🔹 File upload (returns both id + preview URL)
    async uploadFile(file) {
      try {
        console.log("🚀 Uploading file:", file);
    
        const uploaded = await this.bucket.createFile(
          conf.appwriteBucketId,
          ID.unique(),
          file
        );
    
        // 👇 Build preview URL
        const previewUrl = this.getFileView(uploaded.$id);
    
        const result = {
          id: uploaded.$id,
          url: previewUrl
        };
    
        console.log("✅ File uploaded successfully:", result);
        return result;
      } catch (error) {
        console.error("❌ Appwrite service :: uploadFile :: error", error);
        return null;
      }
    }
    
      

    // 🔹 Delete file
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    // 🔹 Get file preview
    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        );
    }
    // ✅ Add this inside Service class
getFileView(fileId) {
  return this.bucket.getFileView(
    conf.appwriteBucketId,
    fileId
  );
}

}

const service = new Service();
export default service;
