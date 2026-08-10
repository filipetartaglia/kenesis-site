import { createClient } from "@/lib/supabase/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AdminUserDetail } from "./users/actions";

export async function getCurrentUser(): Promise<AdminUserDetail | null> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    return null;
  }

  const [dbUser] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      jobTitle: users.jobTitle,
      creci: users.creci,
      whatsapp: users.whatsapp,
      bio: users.bio,
      photoPath: users.photoPath,
      location: users.location,
      isPublic: users.isPublic,
      sortOrder: users.sortOrder,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.email, user.email))
    .limit(1);

  if (!dbUser || !dbUser.isActive) {
    return null;
  }

  const { userPermissions } = await import("@/db/schema");
  const perms = await db
    .select({ permission: userPermissions.permission })
    .from(userPermissions)
    .where(eq(userPermissions.userId, dbUser.id));

  const isMaster = dbUser.email === process.env.MASTER_ADMIN_EMAIL;

  return {
    ...dbUser,
    permissions: perms.map((p) => p.permission),
    isMaster,
  } as AdminUserDetail;
}

export async function requireAuth(): Promise<AdminUserDetail> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

export async function requireAdmin(): Promise<AdminUserDetail> {
  const user = await requireAuth();
  if (user.role !== "admin") {
    redirect("/admin/dashboard");
  }
  return user;
}

export async function requireMaster(): Promise<AdminUserDetail> {
  const user = await requireAuth();
  if (!user.isMaster) {
    redirect("/admin/dashboard");
  }
  return user;
}

export async function requirePermission(permission: string): Promise<AdminUserDetail> {
  const user = await requireAuth();
  
  if (user.isMaster) {
    return user;
  }
  
  if (!user.permissions.includes(permission)) {
    redirect("/admin/dashboard");
  }
  return user;
}
