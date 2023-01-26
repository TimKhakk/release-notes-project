import type { Cookies } from "@sveltejs/kit";

export function parseFromCookies(cookieKeyName: string, cookies: Cookies) {
  return JSON.parse(cookies.get(cookieKeyName) ?? 'null') as string | null;
}