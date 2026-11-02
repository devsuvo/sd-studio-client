import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// MongoClient connects lazily, so a placeholder URI keeps `next build` working without secrets.
const client = new MongoClient(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017");
const db = client.db(process.env.DB_NAME ?? "studiospace");

export const auth = betterAuth({
  appName: "SD Studio",
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  plugins: [
    // Issues short-lived JWTs (GET /api/auth/token) that the Express API verifies via /api/auth/jwks.
    jwt({
      jwt: {
        expirationTime: "15m",
        definePayload: ({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
        }),
      },
    }),
    nextCookies(),
  ],
});
