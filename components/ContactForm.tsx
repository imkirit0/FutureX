"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, PencilLine, Send } from "lucide-react";
import { useState } from "react";
import { socials } from "@/lib/data";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn, EASE_OUT } from "@/lib/utils";

/* Set this to switch the form to a prefilled mailto: draft. */
const ENQUIRY_EMAIL = "";

const interests = ["Course enquiry", "VibeKids school demo", "Partnership", "Something else"];

const inputCls =
  "mt-2 w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-[0.95rem] text-white placeholder:text-sky-dim/60 transition-colors focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30";

export default function ContactForm() {
  const [interest, setInterest] = useState(interests[0]);
  const [composed, setComposed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const text = `${interest}\n\n${message}\n\nFrom: ${name} (${email})`;

    if (ENQUIRY_EMAIL) {
      const subject = encodeURIComponent(`${interest}: ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
      window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`;
    }
    setComposed(text);
    setCopied(false);
  }

  async function copy() {
    if (!composed) return;
    try {
      await navigator.clipboard.writeText(composed);
      setCopied(true);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="border-gradient relative overflow-hidden rounded-3xl bg-ink-2/60 p-7 shadow-card md:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {composed ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            role="status"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="font-display mt-6 text-2xl font-bold text-white md:text-3xl">
              {ENQUIRY_EMAIL ? "Your email draft is open." : "Your enquiry is ready to send."}
            </h2>
            {!ENQUIRY_EMAIL && (
              <>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-body-soft">
                  Copy the message below and send it to us on Instagram or LinkedIn. We reply from there.
                </p>
                <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/10 bg-ink/60 p-5 font-sans text-[0.95rem] leading-relaxed text-body">
                  {composed}
                </pre>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button type="button" onClick={copy}>
                    {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                    {copied ? "Copied" : "Copy message"}
                  </Button>
                  <ButtonLink href={socials.instagram} external variant="secondary" arrow="up">
                    Send on Instagram
                  </ButtonLink>
                  <ButtonLink href={socials.linkedin} external variant="secondary" arrow="up">
                    Send on LinkedIn
                  </ButtonLink>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={() => setComposed(null)}
              className="mt-8 inline-flex cursor-pointer items-center gap-1.5 text-sm text-sky-dim transition-colors hover:text-white"
            >
              <PencilLine className="h-4 w-4" aria-hidden /> Edit the message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Send us a note</h2>
            <p className="mt-2 text-[0.95rem] text-body-soft">We usually reply within a couple of working days.</p>

            <fieldset className="mt-8">
              <legend className="text-sm font-medium text-body">What is this about?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {interests.map((opt) => {
                  const active = interest === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInterest(opt)}
                      aria-pressed={active}
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all",
                        active
                          ? "border-accent bg-accent text-ink shadow-glow"
                          : "border-white/10 bg-white/[0.03] text-body-soft hover:border-white/25 hover:text-white"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-body">Your name</span>
                <input name="name" required autoComplete="name" className={inputCls} placeholder="Priya Sharma" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-body">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputCls}
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-body">Message</span>
              <textarea
                name="message"
                required
                rows={5}
                className={cn(inputCls, "resize-y")}
                placeholder="Tell us a little about your background and what you are hoping to do."
              />
            </label>

            <Button type="submit" size="lg" className="mt-7 w-full sm:w-auto">
              <Send className="h-4 w-4" aria-hidden />
              {ENQUIRY_EMAIL ? "Open email draft" : "Prepare my enquiry"}
            </Button>
            <p className="mt-4 text-xs leading-relaxed text-sky-dim">
              {ENQUIRY_EMAIL
                ? `Opens your mail app with a draft addressed to ${ENQUIRY_EMAIL}.`
                : "We will package your message so you can send it to us on Instagram or LinkedIn in one tap."}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
