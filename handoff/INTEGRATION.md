# Scroll-story integration (FutureX home)

Copy these files into your repo (paths mirror the project):

```
components/DustStory.tsx                → new pinned dust → models → Master API section
components/ui/level-ladder-pinned.tsx   → pinned, scroll-scrubbed ladder
components/ui/poster-rail.tsx           → pinned horizontal poster scroll (replaces ScannerCardStream)
components/ui/wipe-in.tsx               → clip-wipe heading reveal
```

## app/page.tsx changes

```tsx
import DustStory from "@/components/DustStory";
import { LevelLadderPinned } from "@/components/ui/level-ladder-pinned";
import { PosterRail } from "@/components/ui/poster-rail";

// 1. Right after <Hero />, replace <MasterApi /> with:
<DustStory />                      // props: particleCount=3000, pinLength=3.8, showLines

// 2. Replace the "Ladder" <Section> with:
<LevelLadderPinned
  header={
    <SectionHeader
      eyebrow="The certification ladder"
      icon={<GraduationCap />}
      title="Four levels. One continuous climb."
      action={<ButtonLink href="/courses" variant="secondary" arrow="right">All five programs</ButtonLink>}
    />
  }
/>

// 3. Replace the poster <section> + <ScannerCardStream> with:
<PosterRail
  cards={posters}
  header={
    <SectionHeader
      eyebrow="From the studio"
      icon={<Sparkles />}
      title="Tomorrow is FutureX."
      description="A few pieces from the brand series that follows the FutureX community on social."
      action={<ButtonLink href="https://www.instagram.com/futurexailab" external variant="secondary" arrow="up">Follow on Instagram</ButtonLink>}
    />
  }
/>
```

## Heading clip-wipes

In `components/ui/section.tsx`, swap `<BlurIn as="h2" …>` for `<WipeIn as="h2" …>` (same props) to get the
left-to-right wipe on every section title. Keep `<BlurIn>` if you prefer the word blur.

## Notes

- `Hero.tsx` already has the scroll-scrub exit (parallax + fade). No change needed.
- Lenis: the components use Framer `useScroll`, which reads `window.scrollY` — works with Lenis as is.
- Reduced motion: `DustStory` stops the spin/bob; scroll scrubbing still works.
- Tweak `pinLength` on each pinned section to control how long the user scrolls through it.
- `MasterApi.tsx` and `scanner-card-stream.tsx` can be deleted if no other page imports them
  (`three` becomes unused → `npm uninstall three`).
