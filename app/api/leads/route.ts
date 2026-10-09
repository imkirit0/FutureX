import { saveLead } from '@/lib/db';
import { STATUSES } from '@/lib/engine';
import { verifiedSummary } from '@/lib/grade';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? '').trim().slice(0, 100);
  const email = String(body?.email ?? '').trim().toLowerCase().slice(0, 200);
  const phone = String(body?.phone ?? '').trim().slice(0, 25);
  const status = String(body?.status ?? '');

  if (name.length < 2) return Response.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'Please enter a valid email.' }, { status: 400 });
  if (!/^\+?[\d\s-]{7,20}$/.test(phone)) return Response.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  if (!STATUSES.includes(status)) return Response.json({ error: 'Please choose what describes you.' }, { status: 400 });
  if (body?.consent !== true) return Response.json({ error: 'Please agree to be contacted.' }, { status: 400 });

  // Only a result the grader signed can be stored; the client can't make up a score.
  const r = verifiedSummary(body?.summary, body?.proof);
  if (!r) return Response.json({ error: 'Assessment data is invalid. Please retake the test.' }, { status: 400 });

  // A storage failure must not cost the student their results.
  let saved = true;
  try {
    await saveLead({
      name, email, phone, status, mode: r.chosenLevel ? 'level-check' : 'new-student', chosen_level: r.chosenLevel,
      recommended_level: r.recommended, verdict: r.verdict, score: r.score, total: r.total, stages_passed: r.top + 1,
      strengths: r.strengths, gaps: r.gaps, tab_switches: r.tabSwitches,
    });
  } catch (e) {
    console.error('lead insert failed', e);
    saved = false;
  }

  return Response.json({ saved });
}
