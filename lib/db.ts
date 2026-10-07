// Lead storage: Supabase Postgres via Prisma (schema in prisma/schema.prisma).
import { PrismaClient } from '@prisma/client';

export type Lead = {
  name: string; email: string; phone: string; status: string; mode: string;
  chosen_level: number | null; recommended_level: number; verdict: string | null;
  score: number; total: number; stages_passed: number;
  strengths: string[]; gaps: string[]; tab_switches: number;
};

export const LEAD_COLUMNS = ['created_at', 'name', 'email', 'phone', 'status', 'mode', 'chosen_level', 'recommended_level',
  'verdict', 'score', 'total', 'stages_passed', 'strengths', 'gaps', 'tab_switches'] as const;

// Reuse one client across dev hot reloads.
const g = globalThis as unknown as { prisma?: PrismaClient };
const prisma = (g.prisma ??= new PrismaClient());

export async function saveLead(l: Lead) {
  await prisma.lead.create({ data: l });
}

export async function listLeads(): Promise<Record<string, unknown>[]> {
  return prisma.lead.findMany({ orderBy: { created_at: 'desc' } });
}
