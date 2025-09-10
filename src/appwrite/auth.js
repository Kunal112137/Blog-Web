import conf from "../config/conf";
import { Client, Account, ID } from "appwrite";
console.log("Conf values:", conf);

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password });
            }
            return userAccount;
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            // 👇 FIXED: don't throw error for guests
            return null;
        }
    }

    async LogOut() {
        try {
            return await this.account.deleteSession("current");
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
