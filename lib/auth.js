import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectDB } from "./mongodb";

// Ensure DB is connected before initializing auth
const mongooseConnection = await connectDB();
if (!mongooseConnection) {
  throw new Error("Failed to connect to MongoDB for Better Auth");
}
const nativeDb = mongooseConnection.connection.db;

export const auth = betterAuth({
  database: mongodbAdapter(nativeDb),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      console.log("Reset password email sent to", user.email, url);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustHost: true,
  user: {
    additionalFields: {
      phone: { type: "string", required: false },
      photoURL: { type: "string", required: false },
      coverURL: { type: "string", required: false },
      nickname: { type: "string", required: false },
      address: { type: "string", required: false },
      home: { type: "string", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Sync Better Auth 'image' field (from Google) to our 'photoURL' field
          if (user.image && !user.photoURL) {
            await nativeDb.collection("user").updateOne(
              { id: user.id },
              { $set: { photoURL: user.image } }
            );
          }
        },
      },
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: false, // Ensure cookies work on localhost (http)
  }
});
