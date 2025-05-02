import { SignJWT, jwtVerify } from 'jose';

/**
 * Encrypts data into a JWT token and URL encodes it for safe transport (Edge-compatible)
 * @param data The data to encrypt
 * @returns URL-encoded JWT token
 */
export const encryptJson = async <T>(data: T): Promise<string> => {
  if (!process.env.AUTH_SECRET) {
    throw new Error('AUTH_SECRET environment variable is not set');
  }
  
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  
  // Create JWT with jose library (Edge compatible)
  const token = await new SignJWT({ ...data as object })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m') // Token expires in 30 minutes
    .sign(secret);
  
  // URL encode the token for safe transport in URLs
  return encodeURIComponent(token);
};

/**
 * Decrypts a JWT token and returns the original data (Edge-compatible)
 * @param token The URL-encoded JWT token to decrypt
 * @returns The original data
 */
export const decryptJson = async <T = Record<string, unknown>>(token: string): Promise<T> => {
  if (!process.env.AUTH_SECRET) {
    throw new Error('AUTH_SECRET environment variable is not set');
  }
  
  try {
    // First URL decode the token
    const decodedToken = decodeURIComponent(token);
    
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    
    // Verify and decode the JWT
    const { payload } = await jwtVerify(decodedToken, secret);
    return payload as unknown as T;
  } catch (error) {
    console.error('Error decrypting JWT token:', error);
    throw new Error('Failed to decrypt token');
  }
}; 