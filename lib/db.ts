// Auto-created stub by fix3.ps1
// Replace with real Supabase/Prisma client
export const db = {
  from: (_: string) => ({
    select: (_q?: string) => Promise.resolve({ data: [], error: null }),
    insert: (_v: any) => Promise.resolve({ data: null, error: null }),
    update: (_v: any) => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    eq: () => ({
      single: () => Promise.resolve({ data: null, error: null })
    })
  })
};
export default db;
