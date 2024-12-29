import { GetUsers200ResponseOneOfInner } from "auth0";
import managementClient from "./managementClient";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  21
);

export class Auth0UserAlreadyExistsError extends Error {
  existingUser: GetUsers200ResponseOneOfInner;
  constructor(existingUser: GetUsers200ResponseOneOfInner) {
    super("User already exists");
    this.name = "Auth0UserAlreadyExistsError";
    this.message = "User already exists in Auth0";
    this.existingUser = existingUser;
  }
}

export enum CREATE_REASON {
  SIGNUP = "SIGNUP",
  INVITE = "INVITE",
}

export interface UserMetadata {
  createReason: CREATE_REASON;
  invitedTo?: string;
  [key: string]: unknown;
}

const createAuth0User = async (
  email: string,
  metadata: UserMetadata,
  redirect_to?: string
) => {
  // Check if user already exists
  const existingUser = await managementClient.usersByEmail.getByEmail({
    email,
  });

  if (existingUser.data.length > 0) {
    throw new Auth0UserAlreadyExistsError(existingUser.data[0]);
  }

  const user = await managementClient.users.create({
    email: email,
    password: nanoid(32),
    email_verified: true,
    connection: "Username-Password-Authentication",
    user_metadata: metadata,
  });

  // Update email_verified to false
  await managementClient.users.update(
    { id: user.data.user_id },
    { email_verified: false }
  );

  // Create password reset email ticket
  const resetPasswordTicket = await managementClient.tickets.changePassword({
    user_id: user.data.user_id,
    mark_email_as_verified: true,
    result_url: redirect_to,
  });

  return {
    user: user.data,
    resetPasswordTicket: resetPasswordTicket.data,
  };
};

export default createAuth0User;
