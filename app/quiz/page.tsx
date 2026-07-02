'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Coffee,
  CreditCard,
  DollarSign,
  Footprints,
  Gem,
  Landmark,
  Leaf,
  Moon,
  Mountain,
  PersonStanding,
  Snowflake,
  Sparkles,
  Sun,
  Sunrise,
  Trees,
  Trophy,
  Umbrella,
  Users,
  Utensils,
  Waves,
} from 'lucide-react'
import type { ComponentType } from 'react'

// ── Types ────────────────────────────────────────────────────
type StyleOption =
  | 'Adventure' | 'Culture' | 'Beach & Relax' | 'Nature'
  | 'Food & Cuisine' | 'Nightlife' | 'Wellness' | 'Urban' | 'Seclusion'

type Budget = 'Budget' | 'Mid-range' | 'Luxury'
type Climate = 'Tropical' | 'Warm' | 'Mild' | 'Cold/Snow'
type GroupSize = 'Solo' | 'Couple' | 'Small Group' | 'Large Group'
type Pace = 'Relaxed' | 'Balanced' | 'Packed'

interface Preferences {
  styles: StyleOption[]
  regions: string[]
  budget: Budget | ''
  climate: Climate | ''
  pace: Pace | ''
  groupSize: GroupSize | ''
  travelDateStart: string
  travelDateEnd: string
}

// ── Static data ──────────────────────────────────────────────
type QuizIcon = ComponentType<{ className?: string }>
type IconTone = { icon: string; bg: string; selectedBg: string }

const STYLES: { value: StyleOption; Icon: QuizIcon; desc: string; tone: IconTone }[] = [
  { value: 'Adventure', Icon: Mountain, desc: 'Hiking, climbing, thrills', tone: { icon: 'text-emerald-700', bg: 'bg-emerald-50', selectedBg: 'bg-emerald-100' } },
  { value: 'Culture', Icon: Landmark, desc: 'History, art, heritage', tone: { icon: 'text-amber-700', bg: 'bg-amber-50', selectedBg: 'bg-amber-100' } },
  { value: 'Beach & Relax', Icon: Waves, desc: 'Sun, sand, chill vibes', tone: { icon: 'text-sky-700', bg: 'bg-sky-50', selectedBg: 'bg-sky-100' } },
  { value: 'Nature', Icon: Leaf, desc: 'Wildlife, forests, parks', tone: { icon: 'text-green-700', bg: 'bg-green-50', selectedBg: 'bg-green-100' } },
  { value: 'Food & Cuisine', Icon: Utensils, desc: 'Local flavours, markets', tone: { icon: 'text-orange-700', bg: 'bg-orange-50', selectedBg: 'bg-orange-100' } },
  { value: 'Nightlife', Icon: Moon, desc: 'Bars, clubs, live music', tone: { icon: 'text-violet-700', bg: 'bg-violet-50', selectedBg: 'bg-violet-100' } },
  { value: 'Wellness', Icon: Trees, desc: 'Spas, retreats, yoga', tone: { icon: 'text-teal-700', bg: 'bg-teal-50', selectedBg: 'bg-teal-100' } },
  { value: 'Urban', Icon: Landmark, desc: 'City life, architecture', tone: { icon: 'text-slate-700', bg: 'bg-slate-100', selectedBg: 'bg-slate-200' } },
  { value: 'Seclusion', Icon: Sunrise, desc: 'Off-the-beaten-path', tone: { icon: 'text-rose-700', bg: 'bg-rose-50', selectedBg: 'bg-rose-100' } },
]

const BUDGETS: { value: Budget; Icon: QuizIcon; desc: string; tone: IconTone }[] = [
  { value: 'Budget', Icon: DollarSign, desc: 'Hostels, street food, local transport', tone: { icon: 'text-green-700', bg: 'bg-green-50', selectedBg: 'bg-green-100' } },
  { value: 'Mid-range', Icon: CreditCard, desc: 'Comfortable hotels, mix of dining', tone: { icon: 'text-blue-700', bg: 'bg-blue-50', selectedBg: 'bg-blue-100' } },
  { value: 'Luxury', Icon: Gem, desc: 'Resorts, fine dining, private transfers', tone: { icon: 'text-amber-700', bg: 'bg-amber-50', selectedBg: 'bg-amber-100' } },
]

const CLIMATES: { value: Climate; Icon: QuizIcon; range: string; tone: IconTone }[] = [
  { value: 'Tropical', Icon: Sun, range: 'Above 28°C', tone: { icon: 'text-orange-700', bg: 'bg-orange-50', selectedBg: 'bg-orange-100' } },
  { value: 'Warm', Icon: Umbrella, range: '22–28°C', tone: { icon: 'text-yellow-700', bg: 'bg-yellow-50', selectedBg: 'bg-yellow-100' } },
  { value: 'Mild', Icon: Leaf, range: '15–22°C', tone: { icon: 'text-lime-700', bg: 'bg-lime-50', selectedBg: 'bg-lime-100' } },
  { value: 'Cold/Snow', Icon: Snowflake, range: 'Below 15°C', tone: { icon: 'text-cyan-700', bg: 'bg-cyan-50', selectedBg: 'bg-cyan-100' } },
]

const GROUP_SIZES: { value: GroupSize; Icon: QuizIcon; tone: IconTone }[] = [
  { value: 'Solo', Icon: PersonStanding, tone: { icon: 'text-stone-700', bg: 'bg-stone-100', selectedBg: 'bg-stone-200' } },
  { value: 'Couple', Icon: Users, tone: { icon: 'text-pink-700', bg: 'bg-pink-50', selectedBg: 'bg-pink-100' } },
  { value: 'Small Group', Icon: Users, tone: { icon: 'text-indigo-700', bg: 'bg-indigo-50', selectedBg: 'bg-indigo-100' } },
  { value: 'Large Group', Icon: Users, tone: { icon: 'text-purple-700', bg: 'bg-purple-50', selectedBg: 'bg-purple-100' } },
]

const PACES: { value: Pace; Icon: QuizIcon; desc: string; tone: IconTone }[] = [
  { value: 'Relaxed', Icon: Coffee, desc: '1–2 activities max, slow mornings', tone: { icon: 'text-amber-800', bg: 'bg-amber-50', selectedBg: 'bg-amber-100' } },
  { value: 'Balanced', Icon: Footprints, desc: 'Good mix of touring and downtime', tone: { icon: 'text-blue-700', bg: 'bg-blue-50', selectedBg: 'bg-blue-100' } },
  { value: 'Packed', Icon: Trophy, desc: 'Action-packed, see as much as possible', tone: { icon: 'text-red-700', bg: 'bg-red-50', selectedBg: 'bg-red-100' } },
]

const REGIONS = [
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'middle_east', label: 'Middle East' },
  { value: 'north_america', label: 'North America' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'south_america', label: 'South America' },
]

// ── Step indicator ───────────────────────────────────────────
const STEPS = ['Travel Style', 'Region', 'Budget', 'Climate', 'Pace', 'Group & Dates']

// ── Page ─────────────────────────────────────────────────────
export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [prefs, setPrefs] = useState<Preferences>({
    styles: [],
    regions: [], // Start with none selected
    budget: '',
    climate: '',
    pace: '',
    groupSize: '',
    travelDateStart: '',
    travelDateEnd: '',
  })

  // ── Helpers ─────────────────────────────────────────────────
  const toggleStyle = (s: StyleOption) =>
    setPrefs(p => ({
      ...p,
      styles: p.styles.includes(s)
        ? p.styles.filter(x => x !== s)
        : [...p.styles, s],
    }))

  const toggleRegion = (r: string) =>
    setPrefs(p => ({
      ...p,
      regions: p.regions.includes(r)
        ? p.regions.filter(x => x !== r)
        : [...p.regions, r],
    }))

  const toggleAllRegions = () =>
    setPrefs(p => ({
      ...p,
      regions: p.regions.length === REGIONS.length ? [] : REGIONS.map(r => r.value),
    }))

  const canAdvance = () => {
    if (step === 0) return prefs.styles.length > 0
    if (step === 1) return prefs.regions.length > 0
    if (step === 2) return prefs.budget !== ''
    if (step === 3) return prefs.climate !== ''
    if (step === 4) return prefs.pace !== ''
    if (step === 5) return (
      prefs.groupSize !== '' &&
      prefs.travelDateStart !== '' &&
      prefs.travelDateEnd !== '' &&
      prefs.travelDateEnd > prefs.travelDateStart
    )
    return false
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: prefs }),
      })
      if (!res.ok) throw new Error('Recommendation request failed')
      const data = await res.json()

      // Store results in sessionStorage so the destinations page can read them
      sessionStorage.setItem('quiz_results', JSON.stringify(data.destinations))
      sessionStorage.setItem('quiz_trip_meta', JSON.stringify(data.trip_meta))
      sessionStorage.setItem('quiz_prefs', JSON.stringify(prefs))

      router.push('/destinations?from=quiz')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // today's date string for min attribute
  const today = new Date().toISOString().split('T')[0]

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col items-center justify-start -mt-7 md:-mt-6 p-4 sm:p-6 pb-20">
      <section className="max-w-4xl mx-auto w-full bg-white rounded-[32px] shadow-md border border-border/50 overflow-hidden flex flex-col max-h-[95vh] md:max-h-[90vh]">
        
        {/* Header Area: Progress */}
        <div className="px-8 pt-8 md:px-16 md:pt-10 pb-0">
          <div className="w-full mb-6">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/itineraries" className="text-secondary hover:text-charcoal transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber">
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {STEPS.map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-3 flex-1">
                  <div className={`w-full h-1.5 rounded-full transition-colors ${i <= step ? 'bg-amber' : 'bg-muted'}`} />
                  <span className={`text-[11px] font-bold uppercase tracking-[0.1em] text-center hidden sm:block ${i <= step ? 'text-charcoal font-bold' : 'text-disabled font-medium'}`}>
                    {i + 1}. {label}
                  </span>
                  <span className={`text-[11px] font-bold uppercase tracking-[0.1em] text-center block sm:hidden ${i === step ? 'text-charcoal' : 'hidden'}`}>
                    {i + 1}. {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-8 md:px-16 min-h-0">
          <div className="flex flex-col items-center pt-2 pb-6">
            <div className="w-full max-w-2xl">

          {/* ── Step 0: Travel Style ── */}
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-extrabold font-display text-charcoal mb-1">
                What kind of traveller are you?
              </h1>
              <p className="text-sm font-body text-secondary mb-3">
                Select all styles that excite you — the more you pick, the better your matches.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {STYLES.map(s => {
                  const selected = prefs.styles.includes(s.value)
                  const Icon = s.Icon
                  return (
                    <button
                      key={s.value}
                      onClick={() => toggleStyle(s.value)}
                      className={`flex flex-col gap-1 py-3 px-4 rounded-2xl border text-left transition-all duration-300 ${
                        selected
                          ? 'border-amber bg-amber/5 shadow-sm ring-1 ring-amber/20'
                          : 'border-border bg-white hover:border-amber/40 hover:bg-subtle/30'
                      }`}
                    >
                      <span className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1 ${selected ? s.tone.selectedBg : s.tone.bg}`}>
                        <Icon className={`w-6 h-6 ${s.tone.icon}`} aria-hidden="true" />
                      </span>
                      <span className="text-sm font-bold font-body text-charcoal leading-tight">{s.value}</span>
                      <span className="text-xs font-body text-secondary leading-tight line-clamp-1">{s.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Step 1: Region ── */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-extrabold font-display text-charcoal mb-1">
                Where do you want to go?
              </h1>
              <p className="text-sm font-body text-secondary mb-3">
                Limit your search to specific continents or explore the world.
              </p>

                  <button
                    onClick={toggleAllRegions}
                    className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl border border-border bg-white hover:border-amber/50 transition-all w-full sm:w-max group"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${prefs.regions.length === REGIONS.length ? 'bg-amber border-amber' : 'border-border group-hover:border-amber/50'
                      }`}>
                      {prefs.regions.length === REGIONS.length && <Check className="w-3 h-3 text-white" aria-hidden="true" />}
                    </div>
                    <span className="text-sm font-bold font-body text-charcoal">
                      {prefs.regions.length === REGIONS.length ? 'Deselect All' : '(Select All)'}
                    </span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {REGIONS.map(r => {
                      const selected = prefs.regions.includes(r.value)
                      return (
                        <button
                          key={r.value}
                          onClick={() => toggleRegion(r.value)}
                          className={`flex items-center gap-4 p-5 rounded-xl border text-left transition-all ${selected
                              ? 'border-amber bg-amber/10 shadow-sm'
                              : 'border-border bg-white hover:border-amber/50'
                            }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selected ? 'bg-amber border-amber' : 'border-border'
                            }`}>
                            {selected && <Check className="w-3 h-3 text-white" aria-hidden="true" />}
                          </div>
                          <span className="text-sm font-semibold font-body text-charcoal">{r.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

          {/* ── Step 2: Budget ── */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-extrabold font-display text-charcoal mb-1">
                What&apos;s your budget style?
              </h1>
              <p className="text-sm font-body text-secondary mb-3">
                This helps us recommend destinations that match your spending comfort.
              </p>
                  <div className="flex flex-col gap-4">
                    {BUDGETS.map(b => {
                      const selected = prefs.budget === b.value
                      const Icon = b.Icon
                      return (
                        <button
                          key={b.value}
                          onClick={() => setPrefs(p => ({ ...p, budget: b.value }))}
                          className={`flex items-center gap-4 p-5 rounded-xl border text-left transition-all ${selected
                              ? 'border-amber bg-amber/10 shadow-sm'
                              : 'border-border bg-white hover:border-amber/50'
                            }`}
                        >
                          <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${selected ? b.tone.selectedBg : b.tone.bg}`}>
                            <Icon className={`w-6 h-6 ${b.tone.icon}`} aria-hidden="true" />
                          </span>
                          <div>
                            <p className="text-base font-semibold font-body text-charcoal">{b.value}</p>
                            <p className="text-sm font-body text-secondary">{b.desc}</p>
                          </div>
                          {selected && <Check className="ml-auto w-5 h-5 text-amber shrink-0" aria-hidden="true" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

          {/* ── Step 3: Climate ── */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-extrabold font-display text-charcoal mb-1">
                What weather do you prefer?
              </h1>
              <p className="text-sm font-body text-secondary mb-3">
                We score destinations against actual monthly temperature data for your travel dates.
              </p>
                  <div className="grid grid-cols-2 gap-4">
                    {CLIMATES.map(c => {
                      const selected = prefs.climate === c.value
                      const Icon = c.Icon
                      return (
                        <button
                          key={c.value}
                          onClick={() => setPrefs(p => ({ ...p, climate: c.value }))}
                          className={`flex flex-col items-center gap-2 p-6 rounded-xl border transition-all ${selected
                              ? 'border-amber bg-amber/10 shadow-sm'
                              : 'border-border bg-white hover:border-amber/50'
                            }`}
                        >
                          <span className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selected ? c.tone.selectedBg : c.tone.bg}`}>
                            <Icon className={`w-7 h-7 ${c.tone.icon}`} aria-hidden="true" />
                          </span>
                          <span className="text-sm font-semibold font-body text-charcoal">{c.value}</span>
                          <span className="text-xs font-body text-secondary">{c.range}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

          {/* ── Step 4: Pace ── */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-extrabold font-display text-charcoal mb-1">
                What pace suits you?
              </h1>
              <p className="text-sm font-body text-secondary mb-3">
                This helps the AI plan realistic daily schedules for your itinerary.
              </p>
                  <div className="flex flex-col gap-4">
                    {PACES.map(p => {
                      const selected = prefs.pace === p.value
                      const Icon = p.Icon
                      return (
                        <button
                          key={p.value}
                          onClick={() => setPrefs(prev => ({ ...prev, pace: p.value }))}
                          className={`flex items-center gap-4 p-5 rounded-xl border text-left transition-all ${selected
                              ? 'border-amber bg-amber/10 shadow-sm'
                              : 'border-border bg-white hover:border-amber/50'
                            }`}
                        >
                          <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${selected ? p.tone.selectedBg : p.tone.bg}`}>
                            <Icon className={`w-6 h-6 ${p.tone.icon}`} aria-hidden="true" />
                          </span>
                          <div>
                            <p className="text-base font-semibold font-body text-charcoal">{p.value}</p>
                            <p className="text-sm font-body text-secondary">{p.desc}</p>
                          </div>
                          {selected && <Check className="ml-auto w-5 h-5 text-amber shrink-0" aria-hidden="true" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

          {/* ── Step 5: Group & Dates ── */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-extrabold font-display text-charcoal mb-1">
                Who&apos;s going, and when?
              </h1>
              <p className="text-sm font-body text-secondary mb-3">
                Trip duration is calculated from your dates — we use it to fine-tune your matches.
              </p>

                  {/* Group size */}
                  <p className="text-sm font-semibold font-body text-charcoal mb-3">Group size</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {GROUP_SIZES.map(g => {
                      const selected = prefs.groupSize === g.value
                      const Icon = g.Icon
                      return (
                        <button
                          key={g.value}
                          onClick={() => setPrefs(p => ({ ...p, groupSize: g.value }))}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${selected
                              ? 'border-amber bg-amber/10 shadow-sm'
                              : 'border-border bg-white hover:border-amber/50'
                            }`}
                        >
                          <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${selected ? g.tone.selectedBg : g.tone.bg}`}>
                            <Icon className={`w-6 h-6 ${g.tone.icon}`} aria-hidden="true" />
                          </span>
                          <span className="text-xs font-semibold font-body text-charcoal">{g.value}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold font-body text-charcoal mb-2">
                        Departure date
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={prefs.travelDateStart}
                        onChange={e => setPrefs(p => ({ ...p, travelDateStart: e.target.value }))}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-body text-charcoal mb-2">
                        Return date
                      </label>
                      <input
                        type="date"
                        min={prefs.travelDateStart || today}
                        value={prefs.travelDateEnd}
                        onChange={e => setPrefs(p => ({ ...p, travelDateEnd: e.target.value }))}
                        className="input-base"
                      />
                    </div>
                  </div>

                  {/* Duration preview */}
                  {prefs.travelDateStart && prefs.travelDateEnd && prefs.travelDateEnd > prefs.travelDateStart && (
                    <div className="mt-4 p-3 rounded-lg bg-muted flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-secondary" aria-hidden="true" />
                      <span className="text-sm font-body text-charcoal">
                        {Math.round(
                          (new Date(prefs.travelDateEnd).getTime() - new Date(prefs.travelDateStart).getTime())
                          / (1000 * 60 * 60 * 24)
                        ) + 1} day trip
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Footer Area: Navigation */}
        <div className="px-8 pb-4 md:px-16 md:pb-6 pt-2 bg-white border-t border-border/30">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              {error && (
                <p className="mb-4 text-sm font-body text-error text-center">{error}</p>
              )}
              <div className="flex justify-between items-center">
                {step > 0 ? (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="text-sm font-semibold font-body text-secondary hover:text-charcoal transition-colors px-4 py-2 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Back</span>
                  </button>
                ) : (
                  <span />
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    disabled={!canAdvance()}
                    className="bg-charcoal text-warmwhite font-semibold font-body text-sm py-3.5 px-10 rounded-xl hover:bg-amber transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canAdvance() || loading}
                    className="bg-amber text-warmwhite font-semibold font-body text-sm py-3.5 px-10 rounded-xl hover:bg-amberdark transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-warmwhite/40 border-t-warmwhite rounded-full animate-spin" />
                        Finding matches…
                      </>
                    ) : (
                      <>
                        <span>Find My Destinations</span>
                        <Sparkles className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
