import { NextRequest, NextResponse } from "next/server";
import {
  handleAuth,
  handleLogin,
  handleCallback,
  Session,
  AppRouteHandlerFnContext,
  IdentityProviderError,
  CallbackHandlerError,
} from "@auth0/nextjs-auth0";
import { UserAlreadyExistsError, createDBUser } from "@/lib/users/createDBUser";

// TIP: Change this to the path you want your user to redirect, when redirect url is not present in the params
const DEFAULT_REDIRECT_AFTER_LOGIN = "/";

const afterCallback = async (_req: NextRequest, session: Session) => {
  // get or create user profile in database
  const { user } = session;
  const { sub, email, name, picture } = user;
  try {
    await createDBUser({
      sub,
      email,
      name,
      photo: picture,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      // No need to do anything, user already exists
    } else {
      throw error;
    }
  }

  return session;
};

const handler = handleAuth({
  signup: handleLogin({
    returnTo: DEFAULT_REDIRECT_AFTER_LOGIN,
    authorizationParams: { screen_hint: "signup" },
  }),
  login: handleLogin({
    returnTo: DEFAULT_REDIRECT_AFTER_LOGIN,
  }),
  async callback(req: NextRequest, res: AppRouteHandlerFnContext) {
    try {
      return await handleCallback(req, res, { afterCallback });
    } catch (error) {
      if (error instanceof CallbackHandlerError) {
        const { cause } = error;
        if (cause instanceof IdentityProviderError) {
          return NextResponse.json(
            {
              error: cause.error,
              errorDescription: cause.errorDescription,
            },
            {
              status: 400,
            }
          );
        }
      }
      throw error;
    }
  },
});

export const GET = handler;
