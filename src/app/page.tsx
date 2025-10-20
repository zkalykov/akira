export default function Akira() {
  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
        {/* LEFT: Chat (1/3) */}
        <aside className="h-full p-3 md:p-5 overflow-hidden">
          <div className="relative h-full rounded-[28px] border border-white/12 bg-white/5 overflow-hidden flex flex-col">
            {/* header */}
            <div className="flex items-center gap-2 px-4 pt-4">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm font-bold tracking-widest uppercase text-zinc-300">
                akira
              </span>
            </div>

            {/* messages (scroll only inside messages, not whole page) */}
            <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4">
              <div className="max-w-[85%] mr-auto rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-zinc-200">
                Hi! Describe the site you want.
              </div>
              <div className="max-w-[85%] ml-auto rounded-2xl border border-white/30 bg-white/10 px-3 py-2 text-sm">
                Make a landing page for an AI tool.
              </div>
            </div>

            {/* input (fixed bottom) */}
            <form className="border-t border-white/10 px-4 py-4 flex items-center gap-2">
              <input
                className="flex-1 rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-500"
                placeholder="Type a message…"
              />
              <button
                type="button"
                className="rounded-lg border border-white/30 px-3 py-1.5 text-sm hover:border-white/50 transition"
              >
                Send
              </button>
            </form>
          </div>
        </aside>

        {/* RIGHT: Preview (2/3) */}
        <section className="lg:col-span-2 h-full p-3 md:p-5 overflow-hidden">
          <div className="relative h-full rounded-[28px] border border-white/12 bg-white/5 overflow-hidden">
            {/* gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(80% 60% at 50% 65%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0) 70%)",
              }}
            />

            {/* grid */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />

            {/* ✅ ONLY THIS PART SCROLLS */}
            <div className="relative z-10 h-full overflow-y-auto p-6">
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
                Build and deploy on the AI Cloud.
              </h1>
              <p className="mt-3 max-w-2xl text-zinc-300">
                Clean developer tooling and fast previews. Minimal black & white
                design.
              </p>

              {/* lots of content to test scroll */}
              <div className="mt-10 space-y-8">
                {Array.from({ length: 30 }).map((_, i) => (
                  <p key={i} className="text-zinc-400">
                    Scroll preview line {i + 1} — (only inside preview scrolls).
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
