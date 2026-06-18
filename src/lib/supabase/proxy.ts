import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/env";
import { isInvalidRefreshTokenError } from "@/lib/supabase/auth-errors";
import type { Database } from "@/types/database.types";

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    const { error } = await supabase.auth.getClaims();

    if (isInvalidRefreshTokenError(error)) {
      return clearSupabaseAuthCookies(request);
    }
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      return clearSupabaseAuthCookies(request);
    }

    throw error;
  }

  return response;
};

const clearSupabaseAuthCookies = (request: NextRequest) => {
  const authCookieNames = request.cookies
    .getAll()
    .map(({ name }) => name)
    .filter(isSupabaseAuthCookieName);

  authCookieNames.forEach((name) => {
    request.cookies.delete(name);
  });

  const response = NextResponse.next({ request });

  authCookieNames.forEach((name) => {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  });

  return response;
};

const isSupabaseAuthCookieName = (name: string) => {
  return (
    name.startsWith("sb-") &&
    (name.includes("auth-token") || name.includes("code-verifier"))
  );
};
