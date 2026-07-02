'use client'

import { BedDouble, Check, Star, Target, Utensils } from 'lucide-react'
import { useState, useEffect } from 'react'

const TYPE_LABEL = {
  hotel:      'Hotel',
  restaurant: 'Restaurant',
  attraction: 'Attraction',
}

const TYPE_COLOUR = {
  hotel:      'bg-amber/10 text-amber border-amber/20',
  restaurant: 'bg-red-50 text-red-600 border-red-100',
  attraction: 'bg-blue-50 text-blue-600 border-blue-100',
}

const TYPE_ICON = {
  hotel: BedDouble,
  restaurant: Utensils,
  attraction: Target,
}

const TYPE_ICON_COLOUR = {
  hotel: 'text-amber',
  restaurant: 'text-red-500',
  attraction: 'text-blue-500',
}

// Renders filled and empty star icons from a numeric rating.
function StarRating({ rating }) {
  if (!rating) return null
  const full  = Math.floor(rating)
  const half  = rating - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half

  return (
    <span className="inline-flex items-center gap-0.5 text-amber text-xs tracking-tight" aria-label={`${rating} out of 5`}>
      {Array.from({ length: full }).map((_, idx) => (
        <Star key={`full-${idx}`} className="w-3 h-3 fill-current" aria-hidden="true" />
      ))}
      {half ? <span className="text-[10px] font-bold">1/2</span> : null}
      {Array.from({ length: empty }).map((_, idx) => (
        <Star key={`empty-${idx}`} className="w-3 h-3 text-border" aria-hidden="true" />
      ))}
      <span className="ml-1 text-secondary">{rating.toFixed(1)}</span>
    </span>
  )
}

export default function OptionsPanel({ options = [], selectedNames = new Set(), onSelect, onDone, city }) {
  const [quizContext, setQuizContext] = useState({ start: '', end: '', adults: 2 })

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('quiz_prefs')
      if (raw) {
        const quiz = JSON.parse(raw)
        let adults = 2
        if (quiz.groupSize === 'Solo') adults = 1
        else if (quiz.groupSize === 'Couple') adults = 2
        else if (quiz.groupSize === 'Small Group') adults = 4
        else if (quiz.groupSize === 'Large Group') adults = 8
        setQuizContext({ start: quiz.travelDateStart, end: quiz.travelDateEnd, adults })
      }
    } catch { /* ignore */ }
  }, [])
  if (options.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-3 px-4">
        <BedDouble className="w-10 h-10 text-amber" aria-hidden="true" />
        <p className="text-sm font-body text-secondary">
          Options will appear here when the AI suggests alternatives.
        </p>
        <p className="text-xs text-tertiary">
          Try asking: &quot;Find me a halal restaurant near the hotel.&quot;
        </p>
      </div>
    )
  }

  const addedCount = [...selectedNames].filter(n => options.some(o => o.name === n)).length

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-white shrink-0">
        <p className="text-xs text-secondary font-body">
          {options.length} option{options.length > 1 ? 's' : ''}
          {addedCount > 0 && (
            <span className="ml-1.5 text-success font-semibold">· {addedCount} added</span>
          )}
        </p>
        {addedCount > 0 && (
          <button
            onClick={onDone}
            className="text-xs font-semibold font-body bg-charcoal text-warmwhite px-3 py-1 rounded-md hover:bg-amber transition-colors"
          >
            <span className="inline-flex items-center gap-1">
              <span>Done</span>
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-8">
        {options.map((option, i) => (
          <OptionCard
            key={i}
            option={option}
            index={i + 1}
            isAdded={selectedNames.has(option.name)}
            onSelect={onSelect}
            quizContext={quizContext}
            city={city}
          />
        ))}

        {/* Global Booking.com link at the bottom if there are hotels */}
        {city && options.some(o => o.type === 'hotel') && quizContext.start && quizContext.end && (
          <div className="pt-4 border-t border-border mt-4">
            <a
              href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&checkin=${quizContext.start}&checkout=${quizContext.end}&group_adults=${quizContext.adults}&no_rooms=1&group_children=0`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-border rounded-xl text-sm font-semibold font-body text-secondary hover:text-amber hover:border-amber transition-colors shadow-sm"
            >
              <BedDouble className="w-4 h-4 text-amber" aria-hidden="true" />
              Search all hotels on Booking.com
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Option Card ──────────────────────────────────────────────

function OptionCard({ option, index, isAdded, onSelect, quizContext, city }) {
  const typeLabel  = TYPE_LABEL[option.type]  ?? option.type
  const typeColour = TYPE_COLOUR[option.type] ?? 'bg-muted text-charcoal'
  const Icon = TYPE_ICON[option.type] ?? Target
  const iconColor = TYPE_ICON_COLOUR[option.type] ?? 'text-secondary'

  // Construct booking.com specific deep link for hotels
  let specificBookingUrl = option.booking_url
  if (option.type === 'hotel' && city && quizContext?.start && quizContext?.end) {
    specificBookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(option.name + ' ' + city)}&checkin=${quizContext.start}&checkout=${quizContext.end}&group_adults=${quizContext.adults}&no_rooms=1&group_children=0`
  }

  return (
    <div className={`border rounded-xl overflow-hidden bg-white transition-colors
      ${isAdded ? 'border-success' : 'border-border hover:border-amber'}`}>

      {/* Image */}
      <div className="relative w-full h-36 bg-muted">
        {option.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={option.image_url}
            alt={option.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className="flex items-center justify-center h-full"
          style={{ display: option.image_url ? 'none' : 'flex' }}
        >
          <Icon className={`w-10 h-10 ${iconColor}`} aria-hidden="true" />
        </div>

        {/* Type badge overlaid on image */}
        <span className={`absolute top-2 left-2 text-xs font-semibold font-body px-2 py-0.5 rounded-md border inline-flex items-center gap-1 ${typeColour}`}>
          <Icon className={`w-3 h-3 ${iconColor}`} aria-hidden="true" />
          {typeLabel}
        </span>

        {/* Option number */}
        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-charcoal text-warmwhite text-xs font-bold flex items-center justify-center">
          {index}
        </span>
      </div>

      {/* Details */}
      <div className="p-3 space-y-1">
        <h4 className="text-sm font-semibold font-body text-charcoal leading-snug">
          {option.name}
        </h4>

        <div className="flex items-center justify-between gap-2">
          {option.rating && <StarRating rating={option.rating} />}
          {(option.price ?? option.price_estimate) && (
            <span className="text-xs font-semibold text-amber">
              {option.price ?? option.price_estimate}
            </span>
          )}
        </div>

        {option.notes && (
          <p className="text-xs text-tertiary leading-snug">{option.notes}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onSelect(option)}
            className={`flex-1 text-xs font-semibold font-body py-2 rounded-lg transition-colors
              ${isAdded
                ? 'bg-success-bg text-success cursor-default'
                : 'bg-amber text-warmwhite hover:bg-amberdark'}`}
          >
            {isAdded ? <span className="inline-flex items-center justify-center gap-1"><span>Added</span><Check className="w-3.5 h-3.5" aria-hidden="true" /></span> : 'Select'}
          </button>
          {(specificBookingUrl || option.booking_url) && (
            <a
              href={specificBookingUrl || option.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-border rounded-lg text-xs font-semibold text-secondary hover:border-amber hover:text-amber transition-colors flex items-center justify-center text-center"
            >
              {option.type === 'hotel' ? 'Book\u00A0Hotel' : 'Google Maps'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
