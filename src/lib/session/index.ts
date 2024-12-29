import "server-only";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
export const SESSION_KEY = "gloow-session";

export interface SessionValue {
  initialRef?: string;
}

export const getSession = async () => {
  // @ts-expect-error - it's a bug in iron-session
  const session = await getIronSession<SessionValue>(cookies(), {
    password: process.env.SESSION_SECRET as string,
    cookieName: SESSION_KEY,
  });

  return session;
};

export const setSession = async (newValues: Partial<SessionValue>) => {
  const session = await getSession();
  // get keys of newValues
  const keys = Object.keys(newValues) as (keyof SessionValue)[];
  // set keys of session to newValues
  keys.forEach((key) => {
    session[key] = newValues[key] as SessionValue[typeof key];
  });
  await session.save();
  return session;
};
