import { proofOf, replay, report, summaryOf, ticketAgeSeconds, timeAllowed } from '@/lib/grade';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const chosenLevel = [1, 2, 3].includes(body?.chosenLevel) ? (body.chosenLevel as number) : null;

  const age = ticketAgeSeconds(body?.ticket);
  if (age === null) return Response.json({ error: 'This quiz session is not valid. Please start again.' }, { status: 400 });
  if (age > timeAllowed(chosenLevel)) return Response.json({ error: 'The quiz took longer than the time allowed, so it cannot be scored. Please retake it.' }, { status: 400 });

  const session = replay(chosenLevel, body?.stages);
  if (!session) return Response.json({ error: 'Assessment data is invalid. Please retake the test.' }, { status: 400 });

  // Advisory only, like GATE: shown to counsellors, never changes the result.
  const tabSwitches = Math.min(999, Math.max(0, Math.trunc(Number(body?.tabSwitches) || 0)));
  const r = report(session, tabSwitches);
  const summary = summaryOf(r);
  return Response.json({ report: r, summary, proof: proofOf(summary) });
}
