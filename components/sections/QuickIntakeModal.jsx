'use client'

import { useState } from 'react'
import { CalendarDays, Coffee, CreditCard, DollarSign, Footprints, Gem, PersonStanding, Sparkles, Trophy, Users } from 'lucide-react'

const BUDGETS = [
  { value: 'Budget', Icon: DollarSign, iconClass: 'text-green-700', bgClass: 'bg-green-50', desc: 'Hostels & street food' },
  { value: 'Mid-range', Icon: CreditCard, iconClass: 'text-blue-700', bgClass: 'bg-blue-50', desc: 'Comfortable hotels' },
  { value: 'Luxury', Icon: Gem, iconClass: 'text-amber-700', bgClass: 'bg-amber-50', desc: 'Fine dining & resorts' },
]

const PACES = [
  { value: 'Relaxed', Icon: Coffee, iconClass: 'text-amber-800', bgClass: 'bg-amber-50', desc: '1-2 activities/day' },
  { value: 'Balanced', Icon: Footprints, iconClass: 'text-blue-700', bgClass: 'bg-blue-50', desc: '3-4 activities/day' },
  { value: 'Packed', Icon: Trophy, iconClass: 'text-red-700', bgClass: 'bg-red-50', desc: '5+ activities/day' },
]

const GROUPS = [
  { value: 'Solo', Icon: PersonStanding, iconClass: 'text-stone-700', bgClass: 'bg-stone-100' },
  { value: 'Couple', Icon: Users, iconClass: 'text-pink-700', bgClass: 'bg-pink-50' },
  { value: 'Small Group', Icon: Users, iconClass: 'text-indigo-700', bgClass: 'bg-indigo-50' },
  { value: 'Large Group', Icon: Users, iconClass: 'text-purple-700', bgClass: 'bg-purple-50' },
]

export default function QuickIntakeModal({ city, onSubmit }) {
  const [dates, setDates] = useState({ start: '', end: '' })
  const [budget, setBudget] = useState('Mid-range')
  const [pace, setPace] = useState('Balanced')
  const [groupSize, setGroupSize] = useState('Solo')

  const today = new Date().toISOString().split('T')[0]

  const isValid = dates.start && dates.end && dates.end >= dates.start

  const handleDone = () => {
    if (!isValid) return
    
    // Calculate days
    const d1 = new Date(dates.start)
    const d2 = new Date(dates.end)
    const days = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1

    onSubmit({
      trip_days: days,
      budget: budget,
      travel_date_start: dates.start,
      travel_date_end: dates.end,
      group_size: groupSize,
      pace: pace,
    })
  }

  return (
    <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber/10 text-amber text-[10px] font-bold px-3 py-1 rounded-full border border-amber/20 mb-3 uppercase tracking-widest">
            Quick Setup
          </div>
          <h2 className="text-2xl font-extrabold font-display text-charcoal">
            Planning your trip to <span className="text-amber">{city}</span>
          </h2>
          <p className="text-sm font-body text-secondary mt-1">
            Just a few details to help the AI craft your perfect itinerary.
          </p>
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* Dates Row */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-disabled mb-3">When are you going?</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber" aria-hidden="true" />
                <input
                  type="date"
                  min={today}
                  value={dates.start}
                  onChange={e => setDates(p => ({ ...p, start: e.target.value }))}
                  className="w-full bg-subtle border border-border rounded-xl py-3 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-amber transition-colors"
                />
              </div>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber" aria-hidden="true" />
                <input
                  type="date"
                  min={dates.start || today}
                  value={dates.end}
                  onChange={e => setDates(p => ({ ...p, end: e.target.value }))}
                  className="w-full bg-subtle border border-border rounded-xl py-3 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-amber transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pace */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-disabled mb-3">Trip Pace</label>
              <div className="grid grid-cols-3 gap-2">
                {PACES.map(p => {
                  const Icon = p.Icon
                  return (
                  <button
                    key={p.value}
                    onClick={() => setPace(p.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                      pace === p.value ? 'bg-amber/5 border-amber shadow-sm ring-1 ring-amber/20' : 'bg-white border-border hover:border-amber/30'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.bgClass}`}>
                      <Icon className={`w-[18px] h-[18px] ${p.iconClass}`} aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-bold text-charcoal">{p.value}</span>
                  </button>
                  )
                })}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-disabled mb-3">Budget Level</label>
              <div className="grid grid-cols-3 gap-2">
                {BUDGETS.map(b => {
                  const Icon = b.Icon
                  return (
                  <button
                    key={b.value}
                    onClick={() => setBudget(b.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                      budget === b.value ? 'bg-amber/5 border-amber shadow-sm ring-1 ring-amber/20' : 'bg-white border-border hover:border-amber/30'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${b.bgClass}`}>
                      <Icon className={`w-[18px] h-[18px] ${b.iconClass}`} aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-bold text-charcoal">{b.value}</span>
                  </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Group Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-disabled mb-3">Who are you travelling with?</label>
            <div className="grid grid-cols-4 gap-2">
              {GROUPS.map(g => {
                const Icon = g.Icon
                return (
                <button
                  key={g.value}
                  onClick={() => setGroupSize(g.value)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                    groupSize === g.value ? 'bg-amber/5 border-amber shadow-sm ring-1 ring-amber/20' : 'bg-white border-border hover:border-amber/30'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${g.bgClass}`}>
                    <Icon className={`w-[18px] h-[18px] ${g.iconClass}`} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold text-charcoal">{g.value}</span>
                </button>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleDone}
            disabled={!isValid}
            className="w-full bg-charcoal text-warmwhite font-bold py-4 rounded-2xl hover:bg-amber transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mt-4 shadow-lg"
          >
            <span className="inline-flex items-center justify-center gap-2">
              Start Planning My Trip
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
