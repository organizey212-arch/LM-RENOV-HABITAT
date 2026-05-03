import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Profile } from "../types";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** true tant que Supabase répond à la session initiale */
  authLoading: boolean;
  /** true tant que le profil est en cours de lecture (avec session connue) */
  profileLoading: boolean;
  /** false après connexion tant que la 1ère lecture profil n’est pas finie ; évite de rediriger avant de connaître le rôle */
  profileResolved: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[Symo dashboard] Lecture profiles:", error.message);
    return null;
  }
  if (!data) return null;

  const role = data.role === "admin" ? "admin" : "user";
  return {
    id: data.id as string,
    role,
    full_name: data.full_name as string | null,
    updated_at: data.updated_at as string | null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileResolved, setProfileResolved] = useState(true);

  /** Ne pas traiter TOKEN_REFRESHED (même id) comme un nouvel utilisateur : évite profileResolved bloqué. */
  const lastAuthUserIdRef = useRef<string | null>(null);

  const applySession = useCallback((next: Session | null) => {
    const uid = next?.user?.id ?? null;
    const prevUid = lastAuthUserIdRef.current;

    setSession(next);
    setUser(next?.user ?? null);

    if (uid !== prevUid) {
      lastAuthUserIdRef.current = uid;
      if (uid) {
        setProfileResolved(false);
      } else {
        setProfileResolved(true);
        setProfile(null);
        setProfileLoading(false);
      }
    }

    setAuthLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    const uid = session?.user?.id;
    if (!uid) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    try {
      const p = await fetchProfile(uid);
      setProfile(p);
    } finally {
      setProfileLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      applySession(null);
      return;
    }

    let cancelled = false;

    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      applySession(data.session ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      applySession(next);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [applySession]);

  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid || !isSupabaseConfigured) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setProfileLoading(true);
      try {
        const p = await fetchProfile(uid);
        if (cancelled) return;
        setProfile(p);
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
          setProfileResolved(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error("Supabase non configuré (variables VITE_ manquantes).") };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => undefined);
    }
    applySession(null);
  }, [applySession]);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      authLoading,
      profileLoading,
      profileResolved,
      signIn,
      signOut,
      refreshProfile,
    }),
    [session, user, profile, authLoading, profileLoading, profileResolved, signIn, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth hors AuthProvider");
  return ctx;
}
