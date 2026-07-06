import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Film, Scissors, Calendar, Library as LibraryIcon, Wand2, TrendingUp,
  CheckCircle2, Circle, ChevronDown, ChevronRight, Ghost, Heart, Laugh,
  Search, Sparkles, Clock, Flame, Rocket, DollarSign, Info, LayoutDashboard,
  Users, Eye, Target, Award
} from 'lucide-react';

/* ============================== DATA ============================== */

const GENRE_META = {
  thriller: { label: 'Thriller', icon: Flame, color: '#fb923c', name: 'orange-400' },
  horror:   { label: 'Horror',   icon: Ghost, color: '#f87171', name: 'red-400' },
  romance:  { label: 'Romance',  icon: Heart, color: '#f472b6', name: 'pink-400' },
  mystery:  { label: 'Mystery',  icon: Search, color: '#2dd4bf', name: 'teal-400' },
};

const LONGFORM_LIBRARY = {
  thriller: [
    { title: 'The Housemaid', window: 'Fall 2025', hook: 'An ex-con takes a live-in maid job for a wealthy couple and realizes their marriage hides something darker than her own past.', angle: 'Build around the shifting power dynamic between the maid and the wife — save the twist for the last third.' },
    { title: 'She Rides Shotgun', window: 'Summer 2025', hook: 'A father fresh out of prison pulls his daughter out of school to outrun a gang hunting his family.', angle: 'Lean on the father-daughter bond as the emotional spine before escalating the chase sequences.' },
    { title: 'Caught Stealing', window: 'Late Summer 2025', hook: 'A washed-up ex-ballplayer agrees to watch a neighbor’s cat and gets dragged into a war between rival crews.', angle: 'Play up the fish-out-of-water tone — this one is as funny as it is tense.' },
    { title: 'The Long Walk', window: 'Fall 2025', hook: 'Teen boys are forced into a televised walk where dropping below a minimum speed gets you killed.', angle: 'Focus on the friendships formed under a death sentence, not just the shock value.' },
    { title: 'The Running Man', window: 'Fall 2025', hook: 'A desperate father joins a deadly game show, dodging professional hunters for thirty days to win money for his sick daughter.', angle: 'Contrast the game-show spectacle against his real desperation at home.' },
    { title: 'One Battle After Another', window: 'Fall 2025', hook: 'Ex-revolutionaries reunite years later when an old enemy resurfaces and threatens one of their own.', angle: 'Recap the fractured found-family dynamic before diving into the rescue plot.' },
    { title: 'Now You See Me: Now You Don’t', window: 'Late 2025', hook: 'The Four Horsemen return with a new generation of illusionists to expose a diamond empire’s money-laundering scheme.', angle: 'Break down the heist mechanics scene by scene — the "how did they do that" payoff is what people click for.' },
    { title: 'Send Help', window: 'Early 2026', hook: 'A survival thriller that traps its leads in an escalating nightmare with no clean way out.', angle: 'Mirror the film’s own tight pacing — keep your recap lean and relentless.' },
    { title: 'Dead Man’s Wire', window: '2026', hook: 'A hostage negotiation thriller built around a stand-off that keeps shifting who actually has the power.', angle: 'Recap it like a ticking clock, beat by beat.' },
  ],
  horror: [
    { title: 'Weapons', window: 'Summer 2025', hook: 'Every child in one class vanishes at the exact same moment, and the town unravels trying to figure out why.', angle: 'The film is told from multiple perspectives — recap it the same way, chapter by chapter.' },
    { title: 'Together', window: '2025', hook: 'A couple who just moved to the countryside start physically fusing together the longer they stay near each other.', angle: 'Frame it as a body-horror metaphor for codependency.' },
    { title: 'The Conjuring: Last Rites', window: 'Fall 2025', hook: 'Ed and Lorraine Warren take on one final, deeply personal haunting.', angle: 'Lean on franchise nostalgia in your hook — this is billed as their last case.' },
    { title: '28 Years Later: The Bone Temple', window: 'Early 2026', hook: 'Years after the rage virus reshaped Britain, a young survivor is pulled deeper into the infected mainland’s gang politics.', angle: 'World-build first, then land on the emotional core between the two leads.' },
    { title: 'Frankenstein', window: 'Fall 2025', hook: 'A lush, tragic retelling of the Frankenstein myth that leans into heartbreak as much as horror.', angle: 'Recap it like a tragedy, not a scare-by-scare breakdown.' },
    { title: 'The Bride!', window: '2026', hook: 'A stylized, gothic spin on the Bride of Frankenstein myth.', angle: 'This one is pure thumbnail gold — lead with the visuals.' },
    { title: 'Ready or Not 2: Here I Come', window: '2026', hook: 'Grace is back, and the deadly Le Domas family game has escalated to a new nightmare level.', angle: 'Keep the tone dark-comedic — the franchise is tongue-in-cheek.' },
    { title: 'Good Boy', window: '2025', hook: 'A loyal dog is the only one who can sense the evil creeping through his family’s new home.', angle: 'Recap it from the dog’s point of view for a hook nobody else is using.' },
    { title: 'Cold Storage', window: '2026', hook: 'Two storage-facility employees accidentally release a parasitic fungus that could end humanity.', angle: 'Play up the horror-comedy buddy dynamic between the two leads.' },
    { title: 'Exit 8', window: '2026', hook: 'A man is trapped in an endless subway corridor, forced to spot what’s different each time he loops back.', angle: 'Recap it as a "spot the difference" puzzle — very shareable premise.' },
  ],
  romance: [
    { title: 'Materialists', window: 'Summer 2025', hook: 'A New York matchmaker who treats love like a transaction gets torn between the perfect match and her imperfect ex.', angle: 'Recap the love triangle through what each man represents to her, not just who she picks.' },
    { title: 'Regretting You', window: 'Fall 2025', hook: 'A mother and daughter are forced to confront a devastating family secret that rewrites everything they thought they knew about love.', angle: 'Save the betrayal reveal for your recap’s emotional climax.' },
    { title: 'People We Meet on Vacation', window: 'Winter 2026', hook: 'Best friends who take one trip together every year finally face the feelings they’ve been avoiding for a decade.', angle: 'Structure it chronologically through the trips — it’s a slow-burn built for a recap format.' },
    { title: 'Reminders of Him', window: '2026', hook: 'A woman fresh out of prison tries to reconnect with the daughter she lost custody of, while falling for a local bar owner who doesn’t know her past.', angle: 'Center the recap on her redemption arc, not only the romance.' },
    { title: 'The Drama', window: '2026', hook: 'A couple about to get married is upended by a revelation that makes them question their whole relationship.', angle: 'Keep your hook mysterious — the premise is deliberately vague on purpose.' },
    { title: 'The Love Hypothesis', window: 'Fall 2026', hook: 'A PhD student and a stern professor fake a relationship to solve their own love-life problems, and it obviously backfires.', angle: 'Classic fake-dating trope — lean hard into the tension before the reveal.' },
    { title: 'One Night Only', window: '2026', hook: 'Two strangers try to find real love on the one night a year the usual rules of romance don’t apply.', angle: 'Recap this like a rom-com case study: hook, complication, payoff.' },
    { title: 'Your Fault: London', window: '2026', hook: 'The steamy on-again-off-again romance from the "My Fault" franchise continues in a new city.', angle: 'Open with a 20-second franchise refresher before jumping into the new story.' },
    { title: 'Voicemails for Isabelle', window: '2026', hook: 'A grief-tinged romance that unfolds through messages left behind by someone no longer there.', angle: 'Use the voicemail structure as your recap’s own narrative device.' },
  ],
  mystery: [
    { title: 'Wake Up Dead Man: A Knives Out Mystery', window: 'Winter 2025', hook: 'Detective Benoit Blanc investigates an impossible murder inside a small-town church run by a controlling priest.', angle: 'Reveal the clues in the exact order Blanc finds them, and save the whodunit for last.' },
    { title: 'The Thursday Murder Club', window: '2025', hook: 'Four retirees who solve cold cases for fun stumble into a real, present-day murder investigation.', angle: 'Lean into the cozy-mystery charm — recap it like a fun ensemble caper.' },
    { title: 'A Private Life', window: '2025', hook: 'A renowned psychiatrist becomes convinced one of her patients was murdered and launches her own quiet investigation.', angle: 'Play it as a slow-burn psychological mystery, not an action thriller.' },
    { title: 'Remain', window: '2026', hook: 'A quiet, unsettling mystery built around a slow-burn twist from a director known for withholding the truth until the last minute.', angle: 'Don’t spoil the twist in your title or thumbnail — tease it instead.' },
    { title: 'The Sheep Detectives', window: '2026', hook: 'A flock of sheep set off to uncover the mystery behind their shepherd’s death.', angle: 'A lighter, family-friendly pick — good for a change-of-pace upload between darker weeks.' },
  ],
};

const SHORTS_LIBRARY = [
  { title: 'Anyone But You', type: 'romantic', note: 'kept going viral through 2024 on the strength of its boat scene and soundtrack moments — a proven well for cutouts.' },
  { title: 'It Ends With Us', type: 'romantic', note: 'rooftop and courtship-montage beats.' },
  { title: 'The Idea of You', type: 'romantic', note: 'hotel balcony and festival scenes.' },
  { title: 'Twisters', type: 'romantic', note: 'truck-bed and dance-floor tension beats.' },
  { title: 'Wicked', type: 'romantic', note: '"Dancing Through Life" tension between the leads.' },
  { title: 'Materialists', type: 'romantic', note: 'rooftop confession and restaurant tension scenes.' },
  { title: 'Regretting You', type: 'romantic', note: 'young-romance flashback beats.' },
  { title: 'Bridget Jones: Mad About the Boy', type: 'romantic', note: 'age-gap flirting scenes.' },
  { title: 'Wicked: For Good', type: 'romantic', note: 'the emotional payoff scenes between the two leads.' },
  { title: 'People We Meet on Vacation', type: 'romantic', note: 'rooftop confession scene.' },
  { title: 'Heart Eyes', type: 'romantic', note: 'near-death "bonding under pressure" beats — romance wrapped in horror-comedy.' },
  { title: 'Deadpool & Wolverine', type: 'funny', note: 'bickering banter and fourth-wall gags.' },
  { title: 'Bridget Jones: Mad About the Boy', type: 'funny', note: 'her chaotic-parenting comedic beats.' },
  { title: 'The Naked Gun', type: 'funny', note: 'deadpan slapstick gags — built for cutouts.' },
  { title: 'A Simple Favor 2', type: 'funny', note: 'Stephanie’s awkward one-liners.' },
  { title: 'Freakier Friday', type: 'funny', note: 'body-swap physical comedy.' },
  { title: 'Caught Stealing', type: 'funny', note: 'the lead’s fish-out-of-water reactions.' },
  { title: 'Heart Eyes', type: 'funny', note: 'the leads’ banter under pressure.' },
  { title: 'The Thursday Murder Club', type: 'funny', note: 'the retirees’ deadpan one-liners.' },
];

const PHASES = [
  {
    id: 1, reel: 'Reel One', title: 'Foundation & Launch', dayStart: 1, dayEnd: 28, weekLabel: 'Weeks 1–4',
    blurb: 'Get both channels live, branded, and posting on rhythm before you worry about growth.',
    milestones: {
      longform: [
        'Lock the channel name, logo, and banner',
        'Write and pin a 30-45s channel trailer',
        'Build one repeatable thumbnail template',
        'Publish the first 6 recaps (2/week)',
        'Link the shorts channel in every video description',
      ],
      shorts: [
        'Lock the channel name, logo, and banner',
        'Build a caption + color template you’ll reuse every video',
        'Publish the first 18 shorts',
        'Test both romantic and funny cuts, note which retains better',
        'Link the long-form channel in every short’s description',
      ],
    },
  },
  {
    id: 2, reel: 'Reel Two', title: 'Growth & Consistency', dayStart: 29, dayEnd: 63, weekLabel: 'Weeks 5–9',
    blurb: 'Hold the posting rhythm, then let the data tell you what to double down on.',
    milestones: {
      longform: [
        'Hold a steady 2 recaps/week pace',
        'Study retention graphs weekly, trim wherever drop-off spikes',
        'A/B test at least 3 thumbnail styles',
        'Reply to every comment in the first 48 hours after upload',
        'Reach 500 subscribers',
      ],
      shorts: [
        'Hold a steady 6 shorts/week pace',
        'Double down on whichever scene type is outperforming',
        'Start using trending audio strategically',
        'Cut teaser versions of your long-form recaps as bonus shorts',
        'Reach 500 subscribers',
      ],
    },
  },
  {
    id: 3, reel: 'Reel Three', title: 'The Monetization Push', dayStart: 64, dayEnd: 90, weekLabel: 'Weeks 10–13',
    blurb: 'Close the gap on whichever YPP thresholds you’re closest to, then apply.',
    milestones: {
      longform: [
        '500+ subs, 3+ uploads in 90 days, 3,000+ watch hours → apply for YPP Tier 1',
        'Push toward 1,000 subs + 4,000 watch hours for full monetization',
        'Set up and link an AdSense account',
        'Enable 2-Step Verification on your Google account',
      ],
      shorts: [
        'Track progress toward 10M Shorts views in a rolling 90-day window (the Shorts fast-track)',
        'Apply for YPP once thresholds are met',
        'Set up and link an AdSense account',
        'Enable 2-Step Verification on your Google account',
      ],
    },
  },
];

const EDITING_TIPS = {
  longform: [
    { title: 'Rough Cut — CapCut Pro', tips: [
      'Import your narration first and treat it as the timeline anchor — drop clips underneath it, not the other way around.',
      'Keep each clip 3–6 seconds unless it’s a key story beat.',
      'Use Auto Cut only as a starting point, then trim every cut by ear against the voiceover.',
    ]},
    { title: 'Pacing & Retention — CapCut Pro', tips: [
      'Add a jump-cut on every sentence break to keep energy up.',
      'Apply a subtle 100→108% keyframe zoom on any static shot held longer than 4 seconds.',
      'Put your strongest, least spoiler-heavy moment in the first 8 seconds, before the title card.',
    ]},
    { title: 'Captions — CapCut Pro', tips: [
      'Run Auto Captions, then proofread line by line — names and titles get flagged most often.',
      'Use a bold sans-serif style with a soft drop shadow.',
      'Reserve one highlight color for "twist / reveal" beats so viewers learn to watch for it.',
    ]},
    { title: 'Color Grade — Lightroom', tips: [
      'Pull 8–10 key frames into Lightroom and build one preset per genre.',
      'Thriller / mystery: cooler, slightly desaturated shadows. Horror: deep teal shadows, warmer skin tones. Romance: warm, lifted highlights.',
      'Save each as a Lightroom preset so every video in that genre matches instantly.',
    ]},
    { title: 'Thumbnail — Lightroom + CapCut', tips: [
      'Pick the single most emotionally loaded frame, not the busiest one.',
      'In Lightroom, push contrast and clarity, then use selective color so the subject pops off the background.',
      'Add title text back in CapCut — 4–5 words max, heavy condensed font.',
    ]},
    { title: 'Audio & Export', tips: [
      'Duck background music under narration by about 8–10 dB.',
      'Export at 1080p60 where your source allows — recaps read as more premium at higher frame rates.',
    ]},
  ],
  shorts: [
    { title: 'Selecting the Clip', tips: [
      'Pick a moment with a clear emotional spike — a kiss, a punchline, a gasp — inside a 15–45 second window.',
      'If the moment needs setup, trim in right before the payoff and let the caption carry the missing context.',
    ]},
    { title: 'Reframe — CapCut Pro', tips: [
      'Use Auto Reframe to convert to 9:16, then manually nudge the crop so faces stay centered through fast movement.',
    ]},
    { title: 'The Hook — First 1–2 Seconds', tips: [
      'Start on the peak expression or line, never on the wind-up.',
      'If the scene’s real first line isn’t the hook, cut straight to the line that is.',
    ]},
    { title: 'Captions — CapCut Pro', tips: [
      'Use karaoke-style word-by-word captions, large and bold, placed above the like/comment buttons.',
      'For funny cutouts, time the caption a beat behind the punchline so viewers hear it land first.',
    ]},
    { title: 'Sound', tips: [
      'Romantic scenes: keep original dialogue/score, add trending audio very quietly underneath.',
      'Funny scenes: let the original audio carry the joke — muted trending audio kills the timing.',
    ]},
    { title: 'Color — Lightroom', tips: [
      'Batch-apply one warm, slightly saturated preset across every romantic cutout, and one punchier high-contrast preset across every funny cutout — so the two formats are recognizable at a glance in someone’s feed.',
    ]},
    { title: 'Loop & End Card', tips: [
      'End on a beat that could loop back into frame one, or drop a one-line "part 2 in the comments" hook.',
    ]},
  ],
};

const REFERENCE_NOTES = [
  { name: 'Movie Recaps-style channels', note: 'study pacing, hook placement in the first 8 seconds, and thumbnail language for long-form recap style.' },
  { name: 'WatchMojo-style channels', note: 'study how clip curation + on-screen text keeps a list moving — useful for shorts energy.' },
  { name: '"[Movie] edit" / "scenepack" search terms', note: 'searching a movie title + "edit" or "scenepack" surfaces the fan-edit community’s take on the same scenes — good for gauging which moments already resonate.' },
];

/* ============================== HELPERS ============================== */

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function isoDate(d) {
  return d.toISOString().slice(0, 10);
}
function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
function phaseForDay(dayNumber) {
  return PHASES.find(p => dayNumber >= p.dayStart && dayNumber <= p.dayEnd) || PHASES[PHASES.length - 1];
}

function generateSchedule(startDateISO, totalDays = 90) {
  const start = new Date(startDateISO + 'T00:00:00');
  const genreOrder = ['thriller', 'horror', 'romance', 'mystery'];
  let lfCounter = 0;
  let shortsCounter = 0;
  const days = [];
  for (let i = 0; i < totalDays; i++) {
    const date = addDays(start, i);
    const dow = date.getDay();
    const dayNumber = i + 1;
    const posts = [];
    if (dow === 2 || dow === 5) {
      const genre = genreOrder[lfCounter % 4];
      const list = LONGFORM_LIBRARY[genre];
      const movie = list[Math.floor(lfCounter / 4) % list.length];
      posts.push({ channel: 'longform', genre, movie, searchQuery: `${movie.title} movie recap breakdown` });
      lfCounter++;
    }
    if (dow !== 0) {
      const type = shortsCounter % 2 === 0 ? 'romantic' : 'funny';
      const list = SHORTS_LIBRARY.filter(m => m.type === type);
      const movie = list[Math.floor(shortsCounter / 2) % list.length];
      const searchQuery = type === 'romantic' ? `${movie.title} kiss scene edit` : `${movie.title} funniest moments`;
      posts.push({ channel: 'shorts', type, movie, searchQuery });
      shortsCounter++;
    }
    days.push({ dayNumber, date, posts, phase: phaseForDay(dayNumber) });
  }
  return days;
}

const STORAGE_KEY = 'ninety-day-roadmap-state-v1';
function defaultState() {
  return {
    startDateISO: isoDate(new Date()),
    checklist: {},
    stats: { lfSubs: 0, lfHours: 0, shSubs: 0, shViews: 0 },
  };
}
function usePersistentState() {
  const [state, setStateRaw] = useState(defaultState());
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const stateRef = useRef(state);
  const skipNextWrite = useRef(true); // don't write back the value we just loaded
  const debounceRef = useRef(null);   // pending "wait for a pause in typing" timer
  const inFlightRef = useRef(false);  // is a write currently in progress?
  const pendingRef = useRef(false);   // did state change again while a write was in flight?

  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (window.storage) {
          const res = await window.storage.get(STORAGE_KEY, false);
          if (!cancelled && res && res.value) {
            const parsed = JSON.parse(res.value);
            setStateRaw({ ...defaultState(), ...parsed });
          }
        }
      } catch (e) {
        /* nothing saved yet, or storage unavailable — fall back to defaults */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Always writes the LATEST value (via ref). If a write is already in
  // flight when another change comes in, we don't fire a second overlapping
  // request — we just flag it as pending and re-run once the first finishes.
  // This is what stops rapid typing/clicking from flooding storage with
  // near-simultaneous writes and tripping the rate limit.
  const writeToStorage = useCallback((attempt = 0) => {
    if (inFlightRef.current) { pendingRef.current = true; return; }
    inFlightRef.current = true;
    setSaveStatus('saving');
    const valueToSave = stateRef.current;

    (async () => {
      try {
        if (!window.storage) throw new Error('storage unavailable');
        await window.storage.set(STORAGE_KEY, JSON.stringify(valueToSave), false);
        inFlightRef.current = false;
        setSaveStatus('saved');
        if (pendingRef.current) {
          pendingRef.current = false;
          writeToStorage(0);
        }
      } catch (e) {
        inFlightRef.current = false;
        if (attempt < 3) {
          setTimeout(() => writeToStorage(attempt + 1), 600 * (attempt + 1));
        } else {
          setSaveStatus('error');
        }
      }
    })();
  }, []);

  // Persist any time state actually changes, after the initial load has settled.
  // Debounced: typing a number or dragging quickly won't fire a write per
  // keystroke — it waits for a short pause, then saves the latest value once.
  useEffect(() => {
    if (!ready) return;
    if (skipNextWrite.current) { skipNextWrite.current = false; return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => writeToStorage(0), 600);
    return () => clearTimeout(debounceRef.current);
  }, [state, ready, writeToStorage]);

  // Accepts either a value or an updater function `(prevState) => nextState`,
  // exactly like React's setState, so every caller always builds off the
  // freshest state instead of a possibly-stale prop/closure.
  const setState = useCallback((updater) => {
    setStateRaw(prev => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  return [state, setState, ready, saveStatus];
}

/* ============================== SMALL UI PIECES ============================== */

function CountdownRing({ percent, dayNumber, totalDays }) {
  const [animated, setAnimated] = useState(false);
  const [displayDay, setDisplayDay] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => {
    let raf;
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayDay(Math.round(eased * dayNumber));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dayNumber]);
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = animated ? c - (Math.min(percent, 100) / 100) * c : c;
  const ticks = Array.from({ length: 24 });
  return (
    <div className="relative w-36 h-36 shrink-0">
      <div className="absolute inset-0 rounded-full animate-glow" />
      <svg viewBox="0 0 120 120" className="w-36 h-36 -rotate-90 relative">
        {ticks.map((_, i) => {
          const angle = (i / 24) * 360;
          return (
            <line key={i} x1="60" y1="6" x2="60" y2={i % 6 === 0 ? '13' : '10'}
              stroke="#334155" strokeWidth={i % 6 === 0 ? 1.5 : 1}
              transform={`rotate(${angle} 60 60)`}
              style={{ transition: 'stroke .3s ease', animation: animated ? undefined : undefined }} />
          );
        })}
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1e293b" strokeWidth="7" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="7"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.16,1,.3,1)' }} />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
        <span className="text-[10px] tracking-widest text-slate-400 uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Day</span>
        <span className="text-3xl text-slate-50 leading-none tabular-nums" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{String(displayDay).padStart(3, '0')}</span>
        <span className="text-[10px] text-slate-500" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>/ {totalDays}</span>
      </div>
    </div>
  );
}

function MarqueeTitle({ text }) {
  return (
    <div className="relative inline-block overflow-hidden">
      <h1 className="text-4xl sm:text-5xl tracking-wide relative" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
        {text.split('').map((ch, i) => (
          <span key={i} className="inline-block" style={{
            animation: 'flicker 1.4s ease-out both',
            animationDelay: `${i * 0.035}s`,
            color: i % 7 === 3 ? '#f59e0b' : '#f8fafc',
          }}>{ch === ' ' ? ' ' : ch}</span>
        ))}
      </h1>
      <div className="pointer-events-none absolute inset-y-0 w-1/3" style={{
        background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.5), transparent)',
        animation: 'shimmerSweep 4.5s ease-in-out 2.2s infinite',
      }} />
    </div>
  );
}

function SaveIndicator({ status }) {
  const map = {
    idle: { label: 'Not saved yet', color: 'text-slate-500', dot: 'bg-slate-600' },
    saving: { label: 'Saving…', color: 'text-amber-400', dot: 'bg-amber-400 animate-pulse' },
    saved: { label: 'Saved', color: 'text-teal-400', dot: 'bg-teal-400' },
    error: { label: 'Couldn’t save — will retry on your next change', color: 'text-rose-400', dot: 'bg-rose-400' },
  };
  const m = map[status] || map.idle;
  return (
    <span className={`inline-flex items-center gap-1.5 transition-colors duration-300 ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

function ChannelToggle({ channel, setChannel }) {
  const isShorts = channel === 'shorts';
  return (
    <div className="relative inline-flex w-64 rounded-full border border-slate-700 bg-slate-900/60 p-1 overflow-hidden">
      <div
        className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full"
        style={{
          background: isShorts ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : 'linear-gradient(135deg,#2dd4bf,#0d9488)',
          transform: isShorts ? 'translateX(calc(100% + 4px))' : 'translateX(0)',
          transition: 'transform .35s cubic-bezier(.16,1,.3,1), background .35s ease',
          boxShadow: isShorts ? '0 4px 16px -4px rgba(245,158,11,.5)' : '0 4px 16px -4px rgba(45,212,191,.5)',
        }}
      />
      <button onClick={() => setChannel('longform')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-sm transition-colors duration-300 ${!isShorts ? 'text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}>
        <Film size={15} className={!isShorts ? 'animate-float' : ''} /> Long-Form
      </button>
      <button onClick={() => setChannel('shorts')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-sm transition-colors duration-300 ${isShorts ? 'text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}>
        <Scissors size={15} className={isShorts ? 'animate-float' : ''} /> Shorts
      </button>
    </div>
  );
}

function Card({ children, className = '', delay = 0, noAnim = false }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-5 hover-lift ${noAnim ? '' : 'animate-cardin'} ${className}`}
      style={noAnim ? undefined : { animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value, max, accent = '#2dd4bf' }) {
  const [grown, setGrown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGrown(true), 60); return () => clearTimeout(t); }, []);
  const pct = Math.max(0, Math.min(100, (value / max) * 100 || 0));
  return (
    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
      <div className="relative h-full rounded-full overflow-hidden" style={{ width: grown ? `${pct}%` : '0%', background: accent, transition: 'width 1s cubic-bezier(.16,1,.3,1)' }}>
        {pct > 0 && pct < 100 && <div className="absolute inset-0 progress-shimmer" />}
      </div>
    </div>
  );
}

function ChecklistItem({ label, checked, onToggle }) {
  return (
    <button onClick={onToggle} className="flex items-start gap-2.5 w-full text-left group py-1.5 px-1 -mx-1 rounded-lg active:scale-[0.98] hover:bg-slate-800/40 transition-all">
      <span key={checked ? 'on' : 'off'} className="mt-0.5 shrink-0 animate-pop">
        {checked
          ? <CheckCircle2 size={18} className="text-teal-400" />
          : <Circle size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />}
      </span>
      <span className={`text-sm leading-snug transition-all duration-300 ${checked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{label}</span>
    </button>
  );
}

/* ============================== VIEWS ============================== */

function DashboardView({ schedule, phase, stats }) {
  const today = schedule[0];
  const dayNumber = today.dayNumber;
  const percent = (dayNumber / 90) * 100;
  const lfDone = schedule.filter(d => d.dayNumber <= dayNumber - 1).flatMap(d => d.posts).filter(p => p.channel === 'longform').length;
  const shDone = schedule.filter(d => d.dayNumber <= dayNumber - 1).flatMap(d => d.posts).filter(p => p.channel === 'shorts').length;

  return (
    <div className="space-y-6">
      <Card className="flex flex-col sm:flex-row items-center gap-6 overflow-hidden relative" delay={0}>
        <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-teal-500/10 blur-3xl" style={{ animation: 'ambientPulse 5s ease-in-out infinite' }} />
        <CountdownRing percent={percent} dayNumber={dayNumber} totalDays={90} />
        <div className="flex-1 text-center sm:text-left relative">
          <p className="text-xs uppercase tracking-widest text-amber-400 mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{phase.reel} — {phase.weekLabel}</p>
          <h3 className="text-xl font-semibold text-slate-50">{phase.title}</h3>
          <p className="text-sm text-slate-400 mt-1">{phase.blurb}</p>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card delay={90}>
          <div className="flex items-center gap-2 mb-3"><Film size={16} className="text-teal-400 animate-float" /><h4 className="font-semibold text-slate-100">Long-Form</h4></div>
          <p className="text-3xl text-slate-50 tabular-nums" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{lfDone}</p>
          <p className="text-xs text-slate-500 mb-3">recaps published so far</p>
          <ProgressBar value={stats.lfSubs} max={1000} accent="#2dd4bf" />
          <p className="text-xs text-slate-500 mt-1">{stats.lfSubs}/1,000 subs toward full monetization</p>
        </Card>
        <Card delay={150}>
          <div className="flex items-center gap-2 mb-3"><Scissors size={16} className="text-amber-400 animate-float" /><h4 className="font-semibold text-slate-100">Shorts</h4></div>
          <p className="text-3xl text-slate-50 tabular-nums" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{shDone}</p>
          <p className="text-xs text-slate-500 mb-3">cutouts published so far</p>
          <ProgressBar value={stats.shViews} max={10000000} accent="#f59e0b" />
          <p className="text-xs text-slate-500 mt-1">{stats.shViews.toLocaleString()}/10,000,000 Shorts views (90-day)</p>
        </Card>
      </div>

      <Card delay={210}>
        <div className="flex items-center gap-2 mb-2"><Info size={15} className="text-slate-400" /><h4 className="font-semibold text-slate-100 text-sm">Today’s posts</h4></div>
        {today.posts.length === 0 && <p className="text-sm text-slate-500">Rest day — nothing scheduled. Good day to batch-research next week’s titles.</p>}
        {today.posts.map((p, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5 text-sm animate-cardin hover:translate-x-1 transition-transform" style={{ animationDelay: `${260 + i * 60}ms` }}>
            {p.channel === 'longform' ? <Film size={14} className="text-teal-400 shrink-0" /> : <Scissors size={14} className="text-amber-400 shrink-0" />}
            <span className="text-slate-300">{p.movie.title}</span>
            <span className="text-slate-600">—</span>
            <span className="text-slate-500 capitalize">{p.genre || p.type}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function RoadmapView({ channel, state, setState }) {
  const toggle = (phaseId, idx) => {
    const key = `${phaseId}-${channel}-${idx}`;
    setState(prev => ({ ...prev, checklist: { ...prev.checklist, [key]: !prev.checklist[key] } }));
  };
  return (
    <div className="space-y-5">
      {PHASES.map((phase, pIdx) => {
        const items = phase.milestones[channel];
        const doneCount = items.filter((_, i) => state.checklist[`${phase.id}-${channel}-${i}`]).length;
        const complete = doneCount === items.length;
        return (
          <Card key={phase.id} delay={pIdx * 90} className={complete ? 'ring-1 ring-teal-500/30' : ''}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-400" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{phase.reel} · {phase.weekLabel} · Days {phase.dayStart}–{phase.dayEnd}</p>
                <h3 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
                  {phase.title}
                  {complete && <span key="badge" className="animate-pop text-teal-400"><Award size={16} /></span>}
                </h3>
              </div>
              <span key={doneCount} className="text-xs text-slate-400 shrink-0 animate-pop" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{doneCount}/{items.length}</span>
            </div>
            <p className="text-sm text-slate-400 mb-2">{phase.blurb}</p>
            <div className="mb-3"><ProgressBar value={doneCount} max={items.length} accent={complete ? '#2dd4bf' : '#475569'} /></div>
            <div className="divide-y divide-slate-800/60">
              {items.map((label, i) => (
                <ChecklistItem key={i} label={label} checked={!!state.checklist[`${phase.id}-${channel}-${i}`]} onToggle={() => toggle(phase.id, i)} />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function ScheduleView({ schedule, channel }) {
  const [openWeek, setOpenWeek] = useState(1);
  const weeks = useMemo(() => {
    const w = {};
    schedule.forEach(d => {
      const wk = Math.floor((d.dayNumber - 1) / 7) + 1;
      if (!w[wk]) w[wk] = [];
      w[wk].push(d);
    });
    return w;
  }, [schedule]);

  return (
    <div className="space-y-3 animate-fadein">
      <Card className="!py-3">
        <p className="text-xs text-slate-400 flex items-center gap-1.5"><Info size={13} /> Titles cycle through the content library below. Once a title repeats, cut a different scene or angle from it — or swap in whatever just released.</p>
      </Card>
      {Object.entries(weeks).map(([wk, days], wIdx) => {
        const relevant = days.filter(d => d.posts.some(p => p.channel === channel));
        const isOpen = Number(wk) === openWeek;
        return (
          <Card key={wk} className="!p-0 overflow-hidden" delay={wIdx * 40}>
            <button onClick={() => setOpenWeek(isOpen ? 0 : Number(wk))} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/30 transition-colors">
              <span className="font-semibold text-slate-100 text-sm">Week {wk}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{relevant.reduce((n, d) => n + d.posts.filter(p => p.channel === channel).length, 0)} posts</span>
                <ChevronDown size={16} className="text-slate-400 chevron-rotate" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
              </div>
            </button>
            <div className="accordion-body" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
              <div>
                <div className="px-5 pb-4 space-y-2 border-t border-slate-800">
                  {days.map((d, dIdx) => {
                    const post = d.posts.find(p => p.channel === channel);
                    if (!post) return (
                      <div key={d.dayNumber} className="flex items-center gap-3 py-1.5 opacity-40 text-xs">
                        <span className="w-20 shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatDate(d.date)}</span>
                        <span>— no post</span>
                      </div>
                    );
                    const meta = channel === 'longform' ? GENRE_META[post.genre] : null;
                    return (
                      <div key={d.dayNumber} className="flex flex-col gap-1 py-2 border-b border-slate-800/50 last:border-0 animate-cardin" style={{ animationDelay: isOpen ? `${dIdx * 35}ms` : '0ms' }}>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{formatDate(d.date)}</span>
                          <span className="text-slate-700">·</span>
                          <span className="capitalize" style={{ color: channel === 'longform' ? meta.color : (post.type === 'romantic' ? '#f472b6' : '#f59e0b') }}>{channel === 'longform' ? post.genre : post.type}</span>
                        </div>
                        <p className="text-sm text-slate-100 font-medium">{post.movie.title}</p>
                        <p className="text-xs text-slate-500">{post.movie.hook || post.movie.note}</p>
                        <p className="text-xs text-teal-400/80">Reference search: "{post.searchQuery}"</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function LibraryView({ channel }) {
  const [genreFilter, setGenreFilter] = useState('all');
  return (
    <div className="space-y-4">
      <Card className="!py-3" delay={0}>
        <p className="text-xs text-slate-400 flex items-start gap-1.5"><Info size={13} className="mt-0.5 shrink-0" /> Keep every recap and cutout transformative — your own commentary/narration, short clip lengths relative to runtime, and original editing. That is also what YouTube’s 2026 "inauthentic content" policy expects from reused footage.</p>
      </Card>

      {channel === 'longform' ? (
        <>
          <div className="flex gap-2 flex-wrap animate-cardin" style={{ animationDelay: '60ms' }}>
            {['all', 'thriller', 'horror', 'romance', 'mystery'].map(g => (
              <button key={g} onClick={() => setGenreFilter(g)}
                className={`px-3 py-1 rounded-full text-xs capitalize border active:scale-90 ${genreFilter === g ? 'bg-teal-500 border-teal-500 text-slate-950 font-semibold scale-105 shadow-lg shadow-teal-500/20' : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 hover:scale-105'}`}>
                {g}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(LONGFORM_LIBRARY).filter(([g]) => genreFilter === 'all' || g === genreFilter).flatMap(([genre, list]) =>
              list.map((m, i) => {
                const meta = GENRE_META[genre];
                const Icon = meta.icon;
                return (
                  <Card key={genre + i} className="!p-4 group" delay={Math.min(i, 12) * 45}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Icon size={13} style={{ color: meta.color }} className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
                      <span className="text-[11px] uppercase tracking-wide" style={{ color: meta.color }}>{meta.label} · {m.window}</span>
                    </div>
                    <h4 className="font-semibold text-slate-100 mb-1">{m.title}</h4>
                    <p className="text-xs text-slate-400 mb-2">{m.hook}</p>
                    <p className="text-xs text-teal-400/90">🎬 {m.angle}</p>
                  </Card>
                );
              })
            )}
          </div>
        </>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {SHORTS_LIBRARY.map((m, i) => (
            <Card key={i} className="!p-4 group" delay={Math.min(i, 12) * 45}>
              <div className="flex items-center gap-1.5 mb-1.5">
                {m.type === 'romantic'
                  ? <Heart size={13} className="text-pink-400 transition-transform duration-300 group-hover:scale-125" />
                  : <Laugh size={13} className="text-amber-400 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />}
                <span className={`text-[11px] uppercase tracking-wide ${m.type === 'romantic' ? 'text-pink-400' : 'text-amber-400'}`}>{m.type}</span>
              </div>
              <h4 className="font-semibold text-slate-100 mb-1">{m.title}</h4>
              <p className="text-xs text-slate-400">{m.note}</p>
            </Card>
          ))}
        </div>
      )}

      <Card delay={100}>
        <h4 className="font-semibold text-slate-100 text-sm mb-2 flex items-center gap-1.5"><Search size={14} /> Reference & inspiration</h4>
        <div className="space-y-1.5">
          {REFERENCE_NOTES.map((r, i) => (
            <p key={i} className="text-xs text-slate-400"><span className="text-slate-200 font-medium">{r.name}:</span> {r.note}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}

function EditingView({ channel }) {
  const [openIdx, setOpenIdx] = useState(0);
  const sections = EDITING_TIPS[channel];
  return (
    <div className="space-y-3 animate-fadein">
      {sections.map((s, i) => {
        const isOpen = openIdx === i;
        return (
          <Card key={i} className="!p-0 overflow-hidden" delay={i * 45}>
            <button onClick={() => setOpenIdx(isOpen ? -1 : i)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/30 transition-colors group">
              <span className="flex items-center gap-2 font-semibold text-slate-100 text-sm">
                <Wand2 size={15} className={`text-amber-400 transition-transform duration-300 ${isOpen ? '-rotate-12 scale-110' : 'group-hover:rotate-6'}`} /> {s.title}
              </span>
              <ChevronDown size={16} className="text-slate-400 chevron-rotate" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
            </button>
            <div className="accordion-body" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
              <div>
                <ul className="px-5 pb-4 space-y-2 border-t border-slate-800 pt-3">
                  {s.tips.map((t, j) => (
                    <li key={j} className="text-sm text-slate-300 flex gap-2 animate-cardin" style={{ animationDelay: isOpen ? `${j * 60}ms` : '0ms' }}>
                      <span className="text-teal-400 shrink-0">•</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function MonetizationView({ stats, updateStats }) {
  const Row = ({ label, value, onChange, suffix }) => (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="flex items-center gap-1">
        <input type="number" value={value} onChange={e => onChange(Number(e.target.value) || 0)}
          className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-right text-slate-100 focus:outline-none focus:border-teal-400" />
        <span className="text-xs text-slate-500">{suffix}</span>
      </span>
    </label>
  );

  return (
    <div className="space-y-5">
      <Card delay={0}>
        <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2"><DollarSign size={16} className="text-amber-400 animate-float" /> Your current numbers</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-teal-400">Long-form</p>
            <Row label="Subscribers" value={stats.lfSubs} onChange={v => updateStats({ lfSubs: v })} suffix="" />
            <Row label="Watch hours (12mo)" value={stats.lfHours} onChange={v => updateStats({ lfHours: v })} suffix="hrs" />
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-amber-400">Shorts</p>
            <Row label="Subscribers" value={stats.shSubs} onChange={v => updateStats({ shSubs: v })} suffix="" />
            <Row label="Views (90-day)" value={stats.shViews} onChange={v => updateStats({ shViews: v })} suffix="views" />
          </div>
        </div>
      </Card>

      {[
        { title: 'Tier 1 — Early Access (fan funding, Shopping)', subs: 500, hours: 3000, views: 3000000, uploads: '3 public uploads in 90 days' },
        { title: 'Tier 2 — Full Monetization (ad revenue)', subs: 1000, hours: 4000, views: 10000000, uploads: null },
      ].map((tier, i) => {
        const lfSubsPct = Math.min(100, (stats.lfSubs / tier.subs) * 100);
        const lfHoursPct = Math.min(100, (stats.lfHours / tier.hours) * 100);
        const shSubsPct = Math.min(100, (stats.shSubs / tier.subs) * 100);
        const shViewsPct = Math.min(100, (stats.shViews / tier.views) * 100);
        const lfEligible = lfSubsPct >= 100 && lfHoursPct >= 100;
        const shEligible = shSubsPct >= 100 && shViewsPct >= 100;
        const eligible = lfEligible || shEligible;
        return (
          <Card key={i} delay={120 + i * 90} className={eligible ? 'ring-1 ring-teal-500/40' : ''}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-100 text-sm">{tier.title}</h4>
              {eligible && (
                <span key="eligible-badge" className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pop">
                  <Award size={12} className="animate-float" /> Eligible
                </span>
              )}
            </div>
            {tier.uploads && <p className="text-xs text-slate-500 mb-3">Also requires: {tier.uploads}.</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Long-form: {stats.lfSubs}/{tier.subs} subs</p>
                <ProgressBar value={stats.lfSubs} max={tier.subs} accent="#2dd4bf" />
                <p className="text-xs text-slate-400 mt-2 mb-1">{stats.lfHours}/{tier.hours} watch hrs</p>
                <ProgressBar value={stats.lfHours} max={tier.hours} accent="#2dd4bf" />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Shorts: {stats.shSubs}/{tier.subs} subs</p>
                <ProgressBar value={stats.shSubs} max={tier.subs} accent="#f59e0b" />
                <p className="text-xs text-slate-400 mt-2 mb-1">{stats.shViews.toLocaleString()}/{tier.views.toLocaleString()} views</p>
                <ProgressBar value={stats.shViews} max={tier.views} accent="#f59e0b" />
              </div>
            </div>
          </Card>
        );
      })}
      <Card className="!py-3" delay={320}>
        <p className="text-xs text-slate-500">Either path (watch hours OR Shorts views) qualifies a channel independently — you don’t need both. Numbers reflect YPP requirements as of 2026; always confirm current thresholds in YouTube Studio before applying.</p>
      </Card>
    </div>
  );
}

/* ============================== APP ROOT ============================== */

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, channelAware: false },
  { id: 'roadmap', label: 'Roadmap', icon: Target, channelAware: true },
  { id: 'schedule', label: 'Schedule', icon: Calendar, channelAware: true },
  { id: 'library', label: 'Library', icon: LibraryIcon, channelAware: true },
  { id: 'editing', label: 'Editing', icon: Wand2, channelAware: true },
  { id: 'monetize', label: 'Monetize', icon: TrendingUp, channelAware: false },
];

export default function App() {
  const [state, setState, ready, saveStatus] = usePersistentState();
  const [tab, setTab] = useState('dashboard');
  const [channel, setChannel] = useState('longform');
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const schedule = useMemo(() => generateSchedule(state.startDateISO || isoDate(new Date())), [state.startDateISO]);
  const currentPhase = schedule[0] ? schedule[0].phase : PHASES[0];

  const updateStats = (partial) => setState(prev => ({ ...prev, stats: { ...prev.stats, ...partial } }));
  const updateStart = (val) => setState(prev => ({ ...prev, startDateISO: val }));

  useEffect(() => {
    const el = tabRefs.current[tab];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  }, [tab, ready]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-sm">
        <span className="inline-block w-4 h-4 mr-2 rounded-full border-2 border-slate-700 border-t-teal-400 animate-spin-slow" style={{ animationDuration: '.8s' }} />
        Loading roadmap…
      </div>
    );
  }

  const activeTabMeta = TABS.find(t => t.id === tab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        @keyframes flicker { 0%{opacity:0;} 8%{opacity:1;} 14%{opacity:.25;} 20%{opacity:1;} 100%{opacity:1;} }
        @keyframes fadeInUp { from{opacity:0; transform:translateY(10px) scale(.98);} to{opacity:1; transform:translateY(0) scale(1);} }
        @keyframes cardIn { from{opacity:0; transform:translateY(14px);} to{opacity:1; transform:translateY(0);} }
        @keyframes popCheck { 0%{transform:scale(.4) rotate(-15deg); opacity:0;} 60%{transform:scale(1.25) rotate(4deg); opacity:1;} 100%{transform:scale(1) rotate(0);} }
        @keyframes glowPulse { 0%,100%{ filter: drop-shadow(0 0 2px rgba(45,212,191,.35)); } 50%{ filter: drop-shadow(0 0 9px rgba(245,158,11,.55)); } }
        @keyframes shimmerSweep { 0%{ transform: translateX(-120%) skewX(-15deg); } 100%{ transform: translateX(220%) skewX(-15deg); } }
        @keyframes barShimmer { 0%{ background-position: 0% 0; } 100%{ background-position: 200% 0; } }
        @keyframes floatSlow { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-4px); } }
        @keyframes spinSlow { from{ transform: rotate(0deg);} to{ transform: rotate(360deg);} }
        @keyframes ambientPulse { 0%,100%{ opacity:.35; transform: scale(1);} 50%{ opacity:.6; transform: scale(1.08);} }

        .animate-fadein { animation: fadeInUp .45s cubic-bezier(.16,1,.3,1) both; }
        .animate-cardin { animation: cardIn .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-pop { animation: popCheck .38s cubic-bezier(.34,1.56,.64,1) both; }
        .animate-glow { animation: glowPulse 3.2s ease-in-out infinite; }
        .animate-float { animation: floatSlow 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spinSlow 12s linear infinite; }

        .hover-lift { transition: transform .28s cubic-bezier(.16,1,.3,1), box-shadow .28s ease, border-color .28s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 30px -12px rgba(45,212,191,.25); }

        .accordion-body { display: grid; overflow: hidden; transition: grid-template-rows .38s cubic-bezier(.16,1,.3,1); }
        .accordion-body > div { min-height: 0; overflow: hidden; }
        .chevron-rotate { transition: transform .3s cubic-bezier(.16,1,.3,1); }

        .progress-shimmer { background-image: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%); background-size: 200% 100%; animation: barShimmer 1.8s linear infinite; }

        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
        input, button { transition: border-color .2s ease, background-color .2s ease, transform .15s ease; }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-500/[0.06] blur-3xl" style={{ animation: 'ambientPulse 8s ease-in-out infinite' }} />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/[0.06] blur-3xl" style={{ animation: 'ambientPulse 9s ease-in-out infinite 1.5s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-6 animate-cardin">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-amber-400 animate-float" />
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>90-day launch tracker</span>
          </div>
          <MarqueeTitle text="THE 90-DAY CUT" />
          <p className="text-slate-400 text-sm mt-1">Two faceless channels, one shared runway to monetization.</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <Clock size={13} />
            <span>Launch date:</span>
            <input type="date" value={state.startDateISO} onChange={e => updateStart(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-teal-400 focus:scale-105" />
            <span className="text-slate-700 mx-1">·</span>
            <SaveIndicator status={saveStatus} />
          </div>
        </header>

        <nav className="relative flex gap-1 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
          <div
            className="absolute top-0 bottom-2 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/60 shadow-inner pointer-events-none"
            style={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity, transition: 'left .4s cubic-bezier(.16,1,.3,1), width .4s cubic-bezier(.16,1,.3,1), opacity .25s ease' }}
          />
          {TABS.map(t => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button key={t.id} ref={el => { tabRefs.current[t.id] = el; }} onClick={() => setTab(t.id)}
                className={`relative z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm whitespace-nowrap transition-colors duration-200 shrink-0 active:scale-95 ${isActive ? 'text-slate-50' : 'text-slate-500 hover:text-slate-300'}`}>
                <Icon size={15} className={`transition-all duration-300 ${isActive ? 'text-teal-400 scale-110' : ''}`} /> {t.label}
              </button>
            );
          })}
        </nav>

        {activeTabMeta.channelAware && (
          <div className="mb-5 animate-cardin" key={`toggle-${tab}`}>
            <ChannelToggle channel={channel} setChannel={setChannel} />
          </div>
        )}

        <main key={tab + channel} className="animate-fadein">
          {tab === 'dashboard' && <DashboardView schedule={schedule} phase={currentPhase} stats={state.stats} />}
          {tab === 'roadmap' && <RoadmapView channel={channel} state={state} setState={setState} />}
          {tab === 'schedule' && <ScheduleView schedule={schedule} channel={channel} />}
          {tab === 'library' && <LibraryView channel={channel} />}
          {tab === 'editing' && <EditingView channel={channel} />}
          {tab === 'monetize' && <MonetizationView stats={state.stats} updateStats={updateStats} />}
        </main>

        <footer className="mt-10 pt-5 border-t border-slate-800 text-center animate-cardin">
          <p className="text-xs text-slate-600">
            {saveStatus === 'error'
              ? 'Having trouble saving right now — your changes are kept while this tab stays open, and will keep retrying in the background.'
              : 'Progress and checklists save automatically on this device.'}
          </p>
        </footer>
      </div>
    </div>
  );
}
