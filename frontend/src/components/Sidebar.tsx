import { NavLink } from 'react-router-dom'
import {
  Squares2X2Icon,
  ChartBarIcon,
  MapIcon,
  CloudIcon,
  FireIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

const navItems = [
  { path: '/', label: 'Overview', icon: Squares2X2Icon },
  { path: '/forecast', label: '72H Forecast', icon: ChartBarIcon },
  { path: '/map', label: 'NCR Air Map', icon: MapIcon },
  { path: '/atmosphere', label: 'Atmospheric Intel', icon: CloudIcon },
  { path: '/stubble', label: 'Stubble & Smoke', icon: FireIcon },
  { path: '/explainability', label: 'Explainable AI', icon: CpuChipIcon },
  { path: '/alerts', label: 'Alerts Centre', icon: ExclamationTriangleIcon },
  { path: '/validation', label: 'Model Validation', icon: BeakerIcon }
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#081023] border-r border-[#1e2d54] flex flex-col shrink-0 h-screen sticky top-0 z-20 shadow-xl">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-[#1e2d54]/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d2fe]/20 to-[#0066cc]/30 border border-[#00d2fe]/40 flex items-center justify-center text-[#00d2fe] shadow-[0_0_12px_rgba(0,210,254,0.2)]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15h18M5 9h14M9 19h6" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[16px] font-extrabold tracking-tight text-[#f8fafc] truncate">AeroCast NCR</h1>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#00d2fe]/20 text-[#00d2fe] border border-[#00d2fe]/40">SIH</span>
          </div>
          <p className="text-[11px] font-medium text-[#94a3b8] truncate mt-0.5">Weather–Pollution Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="overflow-y-auto px-3 py-4 flex-1 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium tracking-tight transition-all group ${
                  isActive
                    ? 'bg-[#0e2246] border border-[#00d2fe]/80 text-[#00d2fe] font-bold shadow-[0_0_12px_rgba(0,210,254,0.15)]'
                    : 'border border-transparent text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0d1c3a]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" strokeWidth={1.8} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          )
        })}
      </div>

      {/* Footer Benchmark Card */}
      <div className="p-4 border-t border-[#1e2d54]/60">
        <div className="p-3 rounded-xl bg-[#0d1c3a] border border-[#1b3464] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#f8fafc]">IITM/IMD Benchmark</span>
            <InformationCircleIcon className="w-4 h-4 text-[#38bdf8]" />
          </div>
          <p className="text-[10px] text-[#94a3b8]">400m WRF-Chem Inspired Prototype</p>
          <div className="pt-2 border-t border-[#1b3464]/60 text-[9px] font-mono text-[#64748b]">
            SIH26082 · MoES / NCMRWF
          </div>
        </div>
      </div>
    </aside>
  )
}
