import { useState, useEffect } from 'react'
import {
  ClockIcon,
  ArrowPathIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/outline'

interface HeaderProps {
  onRefresh: () => void
  loading: boolean
  onOpenWrfModal: () => void
}

export default function Header({ onRefresh, loading, onOpenWrfModal }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      setCurrentTime(`${timeStr} IST`)
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="h-16 bg-[#081023] border-b border-[#1e2d54] flex items-center justify-between px-6 sticky top-0 z-30 shadow-md">
      {/* Status Badges Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1c3a] border border-[#1b3464] text-[11px] font-mono text-[#38bdf8] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="text-[#94a3b8]">OpenAQ:</span>
          <span className="font-bold text-[#10b981]">LIVE</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1c3a] border border-[#1b3464] text-[11px] font-mono text-[#38bdf8] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          <span className="text-[#94a3b8]">Open-Meteo:</span>
          <span className="font-bold text-[#38bdf8]">CONNECTED</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1c3a] border border-[#1b3464] text-[11px] font-mono text-[#38bdf8] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          <span className="text-[#94a3b8]">NASA FIRMS:</span>
          <span className="font-bold text-[#10b981]">LIVE</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1c3a] border border-[#1b3464] text-[11px] font-mono text-[#38bdf8] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          <span className="text-[#94a3b8]">XGBoost Models:</span>
          <span className="font-bold text-[#38bdf8]">CONNECTED</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1c3a] border border-[#1b3464] text-[11px] font-mono text-[#38bdf8] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          <span className="text-[#94a3b8]">FastAPI Backend:</span>
          <span className="font-bold text-[#38bdf8]">CONNECTED</span>
        </div>
      </div>

      {/* Right Tools Bar */}
      <div className="flex items-center gap-3 shrink-0 pl-4">
        {/* Live IST Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1c3a] border border-[#1b3464] text-[12px] font-mono text-[#f8fafc]">
          <ClockIcon className="w-4 h-4 text-[#38bdf8]" />
          <span>{currentTime || '22:35:18 IST'}</span>
        </div>

        {/* WRF-Chem Stub Modal Button */}
        <button
          onClick={onOpenWrfModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0d1c3a] hover:bg-[#152a56] border border-[#1b3464] hover:border-[#38bdf8] text-[12px] font-medium text-[#f8fafc] transition-all shadow-sm group"
        >
          <Square3Stack3DIcon className="w-4 h-4 text-[#38bdf8] group-hover:rotate-12 transition-transform" />
          <span>WRF-Chem Stub</span>
        </button>

        {/* Glowing Cyan Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#00d2fe] hover:bg-[#38bdf8] active:scale-95 text-[#060c1a] font-bold text-[12px] transition-all shadow-[0_0_15px_rgba(0,210,254,0.4)] disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
          <span>{loading ? 'Updating...' : 'Refresh'}</span>
        </button>
      </div>
    </header>
  )
}
