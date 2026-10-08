import React from 'react';
import { UserRole, ROLE_CAPABILITIES } from '../types';
import { Shield, School, GraduationCap, Building2, UserCheck, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const roleDetails = [
    {
      role: UserRole.PENGAWAS,
      label: 'Pengawas Sekolah',
      subtext: 'Drs. H. Suryadi, M.Pd.',
      icon: Shield,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      badge: 'Supervisi & Verifikasi',
    },
    {
      role: UserRole.KEPALA_SEKOLAH,
      label: 'Kepala Sekolah',
      subtext: 'Dr. Hj. Siti Rahmawati, S.Pd.',
      icon: School,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      badge: 'Manajerial SMAN 1',
    },
    {
      role: UserRole.GURU,
      label: 'Guru Mata Pelajaran',
      subtext: 'Ahmad Fauzi, S.Pd., Gr.',
      icon: GraduationCap,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badge: 'Fisika & Kombel',
    },
    {
      role: UserRole.DINAS_PENDIDIKAN,
      label: 'Dinas Pendidikan',
      subtext: 'Drs. Hendra Kusuma, M.M.',
      icon: Building2,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      badge: 'Peta Wilayah & Kebijakan',
    },
  ];

  const currentRoleInfo = roleDetails.find((r) => r.role === currentRole)!;
  const capability = ROLE_CAPABILITIES[currentRole];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Peran' },
    { id: 'portal', label: '💼 Portal Guru & Kepsek (Tahap 5)' },
    { id: 'observasi-lapangan', label: '📝 Observasi Lapangan (Tahap 4)' },
    { id: 'api-explorer', label: '⚡ Backend API (Tahap 2)' },
    { id: 'prisma-schema', label: 'Prisma Schema' },
    { id: 'typescript-types', label: 'TypeScript Types' },
    { id: 'documents', label: 'Dokumen & KOSP' },
    { id: 'observations', label: 'Observasi & Voice Note' },
    { id: 'virtual-clinic', label: 'Klinik Virtual' },
    { id: 'integrations', label: 'Integrasi Dapodik/PMM' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-xl tracking-wider">
              SW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  SiWas<span className="text-cyan-400">Pro</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Tahap 1 Architecture
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sistem Informasi Pengawas Profesional • Next.js & PostgreSQL (Prisma ORM)
              </p>
            </div>
          </div>

          {/* Role Switcher & User Profile */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border text-left transition-all duration-150 ${currentRoleInfo.color} hover:opacity-90`}
              >
                <currentRoleInfo.icon className="h-5 w-5 shrink-0" />
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200">
                      Peran Aktif:
                    </span>
                    <span className="text-xs font-bold text-white">
                      {currentRoleInfo.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 block">
                    {currentRoleInfo.subtext}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      Pilih Simulasi Peran (RBAC)
                    </span>
                  </div>
                  {roleDetails.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        onRoleChange(item.role);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-800/80 transition-colors text-left ${
                        currentRole === item.role ? 'bg-slate-800/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 text-cyan-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.subtext}
                          </div>
                        </div>
                      </div>
                      {currentRole === item.role && (
                        <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="px-3 pt-2 mt-1 border-t border-slate-800 text-[11px] text-slate-500">
                    Hak akses UI akan menyesuaikan izin peran terpilih.
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>{capability.allowedActions.length} Izin Akses Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
