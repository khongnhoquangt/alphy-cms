import Cookies from "js-cookie"

const AUTH_COOKIE_NAME = "auth_token"

// Secret authentication key - user must enter this exact key to login
export const AUTH_SECRET_KEY = "alphy-wallet-2024-secret-key"

export function validateKey(inputKey: string): boolean {
  return inputKey === AUTH_SECRET_KEY
}

export function setAuth(key: string): void {
  Cookies.set(AUTH_COOKIE_NAME, key, { expires: 7 })
}

export function getAuth(): string | null {
  return Cookies.get(AUTH_COOKIE_NAME) || null
}

export function clearAuth(): void {
  Cookies.remove(AUTH_COOKIE_NAME)
}

export function isAuthenticated(): boolean {
  const key = getAuth()
  // Check if auth exists AND the stored key matches the secret key
  return key !== null && key === AUTH_SECRET_KEY
}