/** What the encrypted session cookie holds. */
export type SessionData = {
  user?: { id: string; email?: string; name?: string };
  pendingLogin?: { state: string; verifier: string };
};
