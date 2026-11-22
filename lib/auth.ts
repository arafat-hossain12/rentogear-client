import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.MONGODB_DB || "rentogear");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  // Generous limits so testers and tutors sharing one network are not blocked.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 300,
    customRules: {
      "/sign-in/email": { window: 60, max: 60 },
      "/sign-up/email": { window: 60, max: 60 },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, defaultValue: "" },
      address: { type: "string", required: false, defaultValue: "" },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Anyone can pick Customer or Owner when registering, but never Admin.
        // Google sign-ups always become Customer.
        before: async (user) => {
          const role = (user as { role?: string }).role === "owner" ? "owner" : "customer";
          return { data: { ...user, role } };
        },
      },
    },
  },
});