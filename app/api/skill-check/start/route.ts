import { issueTicket } from '@/lib/grade';

// Pressing Start fetches a ticket: a signed timestamp the grader uses to bound the quiz's wall time.
export async function POST() {
  return Response.json({ ticket: issueTicket() });
}
