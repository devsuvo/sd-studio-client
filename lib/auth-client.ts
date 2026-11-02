"use client";

import { createAuthClient } from "better-auth/react";
import { clearTokenCache } from "./api";

export const authClient = createAuthClient();

export const { useSession, signIn, signUp } = authClient;

export async function signOut() {
  await clearTokenCache();
  await authClient.signOut();
}
