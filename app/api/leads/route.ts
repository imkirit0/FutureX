import { saveLead } from '@/lib/db';
import { STATUSES, replay, report } from '@/lib/engine';


export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? '').trim().slice(0, 100);
  const email = String(body?.email ?? '').trim().toLowerCase().slice(0, 200);
  const phone = String(body?.phone ?? '').trim().slice(0, 25);
  const status = String(body?.status ?? '');
  const chosenLevel = [1, 2, 3].includes(body?.chosenLevel) ? (body.chosenLevel as number) : null;

  if (name.length < 2) return Response.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'Please enter a valid email.' }, { status: 400 });
  if (!/^\+?[\d\s-]{7,20}$/.test(phone)) return Response.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  if (!STATUSES.includes(status)) return Response.json({ error: 'Please choose what describes you.' }, { status: 400 });
  if (body?.consent !== true) return Response.json({ error: 'Please agree to be contacted.' }, { status: 400 });

  // Recompute the result from the submitted papers instead of trusting the client.
  const session = replay(chosenLevel, body?.stages);
  if (!session) return Response.json({ error: 'Assessment data is invalid. Please retake the test.' }, { status: 400 });
  const r = report(session);
  // Advisory only, like GATE: shown to counsellors, never changes the result.
  const tabSwitches = Math.min(999, Math.max(0, Math.trunc(Number(body?.tabSwitches) || 0)));

  // A storage failure must not cost the student their results.
  let saved = true;
  try {
    await saveLead({
      name, email, phone, status, mode: chosenLevel ? 'level-check' : 'new-student', chosen_level: chosenLevel,
      recommended_level: r.recommended, verdict: r.verdict, score: r.score, total: r.total, stages_passed: r.top + 1,
      strengths: r.strengths, gaps: r.gaps, tab_switches: tabSwitches,
    });
  } catch (e) {
    console.error('lead insert failed', e);
    saved = false;
  }

  return Response.json({ report: r, saved });
}
