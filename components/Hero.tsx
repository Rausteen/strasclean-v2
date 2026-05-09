import { SITE } from "@/lib/site";
import {
  WhatsAppIcon,
  PhoneIcon,
  MapPinIcon,
  CarIcon,
  SparklesIcon,
  CheckIcon,
  BoltIcon,
  ClockIcon,
} from "./Icon";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      </div>

      <div className="container-x pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div className="animate-fade-up">
            <span className="chip">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              Nettoyage auto à domicile à Strasbourg
            </span>

            <h1 className="h-display mt-5 text-balance text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Votre voiture propre comme neuve,{" "}
              <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent">
                sans vous déplacer.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-white/70 sm:text-lg">
              StrasClean se déplace chez vous pour nettoyer votre véhicule en
              profondeur, avec des formules adaptées à votre besoin&nbsp;:
              entretien rapide, rénovation intérieure ou detailing complet.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa h-12 px-6 text-base"
              >
                <WhatsAppIcon size={20} />
                Réserver sur WhatsApp
              </a>
              <a href={SITE.phoneHref} className="btn-ghost h-12 px-6 text-base">
                <PhoneIcon size={18} />
                Appeler maintenant
              </a>
            </div>

            {/* Trust */}
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
              {[
                { icon: <HomeChip />, label: "Intervention à domicile" },
                { icon: <MapPinIcon size={16} className="text-brand-400" />, label: "Strasbourg & alentours" },
                { icon: <BoltIcon size={16} className="text-brand-400" />, label: "Réservation rapide" },
                { icon: <CarIcon size={16} className="text-brand-400" />, label: "Intérieur / extérieur" },
                { icon: <CheckIcon size={16} className="text-brand-400" />, label: "Paiement simple" },
              ].map((t) => (
                <li key={t.label} className="inline-flex items-center gap-2">
                  {t.icon}
                  {t.label}
                </li>
              ))}
            </ul>

            {/* Availability strip */}
            <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-sm text-brand-200">
              <ClockIcon size={16} className="text-brand-300" />
              Créneaux disponibles cette semaine sur Strasbourg
            </div>
          </div>

          {/* Visual */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HomeChip() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-md bg-brand-500/15 text-brand-400">
      <SparklesIcon size={12} />
    </span>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
      {/* Main car card */}
      <div className="relative animate-fade-up [animation-delay:120ms]">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-6 shadow-card">
          {/* Mock photo */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.18),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.07),transparent_55%)]" />
            <CarMock />
            <span className="absolute left-4 top-4 chip !bg-black/40">
              <SparklesIcon size={12} className="text-brand-400" />
              Avant / Après
            </span>
            <span className="absolute right-4 top-4 chip !bg-black/40 !text-brand-200">
              ★★★★★
            </span>
          </div>

          {/* Booking row */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-whatsapp/15 text-whatsapp">
              <WhatsAppIcon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Réservation en 10 secondes</p>
              <p className="text-xs text-white/60">Envoyez quelques photos, on confirme votre créneau</p>
            </div>
            <a
              href="#formules"
              className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 sm:inline-flex"
            >
              Voir les formules
            </a>
          </div>
        </div>

        {/* Floating sticker - left */}
        <div className="absolute -left-4 top-6 hidden rotate-[-6deg] animate-float rounded-2xl border border-white/10 bg-ink-900/90 p-3 shadow-card backdrop-blur sm:block">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/15 text-brand-400">
              <BoltIcon size={16} />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">Intervention rapide</p>
              <p className="text-[11px] text-white/60">Dès 1h30 sur place</p>
            </div>
          </div>
        </div>

        {/* Floating sticker - right */}
        <div className="absolute -right-4 -bottom-5 hidden rotate-[4deg] animate-float [animation-delay:1s] rounded-2xl border border-white/10 bg-ink-900/90 p-3 shadow-card backdrop-blur sm:block">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/15 text-brand-400">
              <MapPinIcon size={16} />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">Strasbourg & alentours</p>
              <p className="text-[11px] text-white/60">12 communes desservies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarMock() {
  // Inline SVG mock — clean, premium, no heavy assets
  return (
    <svg
      viewBox="0 0 600 420"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="floor" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0b1220" />
          <stop offset="1" stopColor="#05070A" />
        </linearGradient>
        <linearGradient id="body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="shine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#10B981" stopOpacity="0" />
          <stop offset=".5" stopColor="#10B981" stopOpacity=".55" />
          <stop offset="1" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="600" height="420" fill="url(#floor)" />
      {/* shadow under car */}
      <ellipse cx="300" cy="320" rx="220" ry="20" fill="#000" opacity="0.5" />
      {/* car body */}
      <path
        d="M90 290 Q120 200 230 190 L380 190 Q470 200 510 270 Q520 290 510 305 L90 305 Q80 300 90 290 Z"
        fill="url(#body)"
        stroke="rgba(255,255,255,0.06)"
      />
      {/* roof */}
      <path
        d="M210 200 Q260 150 320 150 L370 150 Q420 155 450 200 Z"
        fill="#0f172a"
        stroke="rgba(255,255,255,0.05)"
      />
      {/* window */}
      <path
        d="M225 200 Q265 165 320 165 L365 165 Q410 170 435 200 Z"
        fill="#0b1220"
      />
      {/* window highlight */}
      <path d="M260 175 Q300 168 340 172" stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" />
      {/* door line */}
      <path d="M310 200 L310 295" stroke="rgba(255,255,255,0.06)" />
      {/* wheel arches */}
      <circle cx="180" cy="305" r="38" fill="#05070A" />
      <circle cx="430" cy="305" r="38" fill="#05070A" />
      <circle cx="180" cy="305" r="26" fill="#0b1220" stroke="rgba(255,255,255,0.08)" />
      <circle cx="430" cy="305" r="26" fill="#0b1220" stroke="rgba(255,255,255,0.08)" />
      <circle cx="180" cy="305" r="6" fill="#10B981" />
      <circle cx="430" cy="305" r="6" fill="#10B981" />
      {/* shine sweep */}
      <rect x="80" y="180" width="440" height="20" fill="url(#shine)">
        <animate attributeName="x" from="-440" to="600" dur="5s" repeatCount="indefinite" />
      </rect>
      {/* sparkles */}
      <g fill="#10B981">
        <circle cx="500" cy="110" r="2.5" />
        <circle cx="120" cy="90" r="1.8" />
        <circle cx="540" cy="200" r="1.6" />
        <circle cx="80" cy="240" r="1.4" />
      </g>
    </svg>
  );
}
