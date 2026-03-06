"use client";

const TESTIMONIALS = [
  {
    text: "SaneBar is really quite stable and I'm not sure what else I could wish for. I love that it's actively maintained.",
    author: "DrOatmeal",
    source: "GitHub",
  },
  {
    text: "SaneBar is the first Bartender replacement that feels like it'll actually surpass the original. The speed with which you reply to issue reports and implement new features is phenomenal.",
    author: "HealsCodes",
    source: "GitHub",
  },
  {
    text: "For Maximum Privacy & Security: SaneBar is the unequivocal winner. Its architecture prevents data exfiltration by design. In an era of surveillance capitalism, SaneBar's silence is its loudest feature.",
    author: "u/Kevin_Cossaboon",
    source: "Reddit",
  },
  {
    text: "Great app, I just switched from Ice. I really like its minimalism and simplicity. It just works and very well.",
    author: "u/nxnayx",
    source: "Reddit",
  },
  {
    text: "Thank you so much for the update and transparency! Stable is definitely better.",
    author: "vurtomatic",
    source: "GitHub",
  },
  {
    text: "You already have 'Reveal when I scroll up in the menu bar' — exactly how I use Ice. I like it very much!",
    author: "u/Kin_KC",
    source: "Reddit",
  },
  {
    text: "I am using it now and there are no shadow clicks as seen in other menu bar managers.",
    author: "u/Elegant_Mobile4311",
    source: "Reddit",
  },
  {
    text: "I've been keeping an eye on this type of software since upgrading to macOS 26, and I'm ready to give it a try!",
    author: "u/Depth_Special",
    source: "Reddit",
  },
  {
    text: "Damn! This looks great. I have been desperately looking for a FOSS alternative.",
    author: "u/JustABro_2321",
    source: "Reddit",
  },
  {
    text: "Best free pick. If you prefer free/100% Transparent Code, SaneBar is a very strong runner-up with thoughtful features — power search, auto-hide triggers, hotkeys, and Touch ID locking.",
    author: "Mac Nerd Newsletter",
    source: "Press",
  },
];

// Duplicate for seamless infinite loop
const LOOP_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

export function Testimonials() {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] overflow-hidden py-[34px]">
      <div className="mx-auto max-w-3xl px-[21px] mb-[34px]">
        <h2 className="text-center font-display font-semibold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)" }}>
          What people are saying
        </h2>
      </div>

      {/* Scrolling track with edge fade */}
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <div className="testimonial-track flex gap-[21px] hover:[animation-play-state:paused]">
          {LOOP_ITEMS.map((item, i) => (
            <div
              key={i}
              className="group relative shrink-0 rounded-2xl p-[21px] pl-[28px] text-left transition-all duration-300 hover:-translate-y-0.5"
              style={{
                minWidth: "min(340px, 85vw)",
                maxWidth: "min(340px, 85vw)",
                background: "linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                border: "1px solid rgba(92, 232, 255, 0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.4)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(6, 182, 212, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(92, 232, 255, 0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Opening quote mark */}
              <span
                className="absolute top-[13px] left-[16px] font-serif text-5xl leading-none text-[#06B6D4] opacity-30 select-none"
                aria-hidden="true"
              >
                {"\u201C"}
              </span>

              <p className="mb-[13px] pl-[8px] text-sm italic leading-relaxed text-white">
                &ldquo;{item.text}&rdquo;
              </p>

              <div className="flex items-center gap-[8px] text-sm font-medium text-[#06B6D4]">
                <span className="block h-[2px] w-[16px] bg-[#06B6D4] opacity-50" />
                {item.author} ({item.source})
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
