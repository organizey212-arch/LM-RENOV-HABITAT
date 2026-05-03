export type UserRole = "admin" | "user";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string | null;
  updated_at: string | null;
};
