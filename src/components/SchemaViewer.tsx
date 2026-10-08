import React, { useState } from 'react';
import { Database, Copy, Check, Download, Layers, ShieldCheck, Key, ListTree, Search } from 'lucide-react';

interface SchemaViewerProps {
  rawPrismaSchema: string;
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({ rawPrismaSchema }) => {
  const [copied, setCopied] = useState(false);
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const domains = [
    { id: 'ALL', name: 'Semua Model (18)', count: 18 },
    { id: 'USERS', name: '1. Users & Roles', count: 3, models: ['User', 'UserProfile', 'PengawasAssignment'] },
    { id: 'SCHOOLS', name: '2. Schools & Regional Heatmap', count: 2, models: ['School', 'RegionalHeatmapData'] },
    { id: 'DOCS', name: '3. Documents & Versioning', count: 4, models: ['Document', 'DocumentVersion', 'DocumentComment', 'DocumentAuditTrail'] },
    { id: 'REFLECTIONS', name: '4. Reflections (Jurnal)', count: 1, models: ['ReflectionJournal'] },
    { id: 'OBSERVATIONS', name: '5. Observations & Rubrics', count: 5, models: ['Observation', 'RubricTemplate', 'RubricDomain', 'RubricIndicator', 'ObservationScore'] },
    { id: 'CLINIC', name: '6. Virtual Clinic Bookings', count: 1, models: ['VirtualClinicBooking'] },
    { id: 'INTEGRATIONS', name: '7. Integrations Sync Logs', count: 3, models: ['IntegrationSyncLog', 'SchoolRaporPendidikan', 'TeacherPmmProgress'] },
  ];

  const modelDefinitions = [
    {
      name: 'User',
      domain: 'USERS',
      description: 'Entitas identitas inti pengawas, kepala sekolah, guru, dan staf dinas.',
      table: 'users',
      fields: 13,
      primaryKey: 'id (UUID)',
      foreignKeys: ['schoolId -> School.id'],
      relations: ['assignedSchools', 'uploadedDocuments', 'reviewedDocuments', 'authoredReflections', 'conductedObservations', 'requestedClinics'],
    },
    {
      name: 'UserProfile',
      domain: 'USERS',
      description: 'Detail pangkat/golongan, jabatan fungsional, spesialisasi, dan tanda tangan digital.',
      table: 'user_profiles',
      fields: 11,
      primaryKey: 'id (UUID)',
      foreignKeys: ['userId -> User.id (1:1 CASCADE)'],
      relations: ['user'],
    },
    {
      name: 'PengawasAssignment',
      domain: 'USERS',
      description: 'Surat Keputusan (SK) penugasan pengawas pembina ke sekolah binaan per tahun ajaran.',
      table: 'pengawas_assignments',
      fields: 11,
      primaryKey: 'id (UUID)',
      foreignKeys: ['pengawasId -> User.id', 'schoolId -> School.id'],
      relations: ['pengawas', 'school'],
    },
    {
      name: 'School',
      domain: 'SCHOOLS',
      description: 'Data profil satuan pendidikan, NPSN, akreditasi, koordinat GPS, dan status Kurikulum Merdeka.',
      table: 'schools',
      fields: 24,
      primaryKey: 'id (UUID)',
      foreignKeys: [],
      relations: ['users', 'pengawasAssignments', 'documents', 'reflections', 'observations', 'clinicBookings', 'raporPendidikanList'],
    },
    {
      name: 'RegionalHeatmapData',
      domain: 'SCHOOLS',
      description: 'Agregasi mutu spasial tingkat kecamatan/kabupaten untuk visualisasi peta risiko & kepatuhan.',
      table: 'regional_heatmap_data',
      fields: 16,
      primaryKey: 'id (UUID)',
      foreignKeys: [],
      relations: [],
    },
    {
      name: 'Document',
      domain: 'DOCS',
      description: 'Master dokumen kurikulum (KOSP, RKAS, Modul Ajar) dengan siklus review dan persetujuan.',
      table: 'documents',
      fields: 15,
      primaryKey: 'id (UUID)',
      foreignKeys: ['schoolId -> School.id', 'uploadedById -> User.id', 'reviewedById -> User.id'],
      relations: ['school', 'uploadedBy', 'reviewedBy', 'versions', 'comments', 'auditTrails'],
    },
    {
      name: 'DocumentVersion',
      domain: 'DOCS',
      description: 'Rekam jejak riwayat revisi berkas (v1, v2, ...), SHA-256 checksum, dan ringkasan perubahan.',
      table: 'document_versions',
      fields: 12,
      primaryKey: 'id (UUID)',
      foreignKeys: ['documentId -> Document.id (CASCADE)', 'uploadedById -> User.id'],
      relations: ['document', 'uploadedBy'],
    },
    {
      name: 'DocumentComment',
      domain: 'DOCS',
      description: 'Catatan telaah pengawas secara kontekstual per halaman / per bab dokumen beserta reply thread.',
      table: 'document_comments',
      fields: 12,
      primaryKey: 'id (UUID)',
      foreignKeys: ['documentId -> Document.id (CASCADE)', 'authorId -> User.id', 'parentCommentId -> DocumentComment.id'],
      relations: ['document', 'author', 'parentComment', 'replies'],
    },
    {
      name: 'DocumentAuditTrail',
      domain: 'DOCS',
      description: 'Jejak audit immutable untuk kepatuhan hukum dan transparansi alur verifikasi berkas.',
      table: 'document_audit_trails',
      fields: 10,
      primaryKey: 'id (UUID)',
      foreignKeys: ['documentId -> Document.id (CASCADE)', 'actorId -> User.id'],
      relations: ['document', 'actor'],
    },
    {
      name: 'ReflectionJournal',
      domain: 'REFLECTIONS',
      description: 'Jurnal refleksi mandiri guru dan kepala sekolah beserta umpan balik apresiatif pengawas.',
      table: 'reflection_journals',
      fields: 17,
      primaryKey: 'id (UUID)',
      foreignKeys: ['authorId -> User.id', 'reviewerId -> User.id', 'schoolId -> School.id'],
      relations: ['author', 'reviewer', 'school'],
    },
    {
      name: 'Observation',
      domain: 'OBSERVATIONS',
      description: 'Supervisi observasi kelas, rekaman audio voice note pengawas, hasil speech-to-text, dan skor akhir.',
      table: 'observations',
      fields: 22,
      primaryKey: 'id (UUID)',
      foreignKeys: ['observerId -> User.id', 'targetTeacherId -> User.id', 'schoolId -> School.id', 'rubricTemplateId -> RubricTemplate.id'],
      relations: ['observer', 'targetTeacher', 'school', 'rubricTemplate', 'itemScores'],
    },
    {
      name: 'RubricTemplate',
      domain: 'OBSERVATIONS',
      description: 'Katalog instrumen rubrik penilaian standar Kemendikbudristek untuk observasi kelas/manajerial.',
      table: 'rubric_templates',
      fields: 7,
      primaryKey: 'id (UUID)',
      foreignKeys: [],
      relations: ['domains', 'observations'],
    },
    {
      name: 'RubricDomain',
      domain: 'OBSERVATIONS',
      description: 'Domain kompetensi utama (misal: Perencanaan, Pembelajaran Berpusat pada Murid, Asesmen).',
      table: 'rubric_domains',
      fields: 7,
      primaryKey: 'id (UUID)',
      foreignKeys: ['rubricTemplateId -> RubricTemplate.id (CASCADE)'],
      relations: ['rubricTemplate', 'indicators'],
    },
    {
      name: 'RubricIndicator',
      domain: 'OBSERVATIONS',
      description: 'Indikator perilaku konkret dengan panduan rubrik 4 level (Kurang, Cukup, Baik, Sangat Baik).',
      table: 'rubric_indicators',
      fields: 10,
      primaryKey: 'id (UUID)',
      foreignKeys: ['domainId -> RubricDomain.id (CASCADE)'],
      relations: ['domain', 'observationScores'],
    },
    {
      name: 'ObservationScore',
      domain: 'OBSERVATIONS',
      description: 'Skor penilaian riil per butir indikator disertai bukti perilaku teramati dan saran perbaikan.',
      table: 'observation_scores',
      fields: 7,
      primaryKey: 'id (UUID)',
      foreignKeys: ['observationId -> Observation.id (CASCADE)', 'indicatorId -> RubricIndicator.id'],
      relations: ['observation', 'indicator'],
    },
    {
      name: 'VirtualClinicBooking',
      domain: 'CLINIC',
      description: 'Pemesanan sesi bimbingan klinis 1-on-1 dengan pengawas pembina lengkap dengan link Google Meet.',
      table: 'virtual_clinic_bookings',
      fields: 18,
      primaryKey: 'id (UUID)',
      foreignKeys: ['requesterId -> User.id', 'pengawasId -> User.id', 'schoolId -> School.id'],
      relations: ['requester', 'pengawas', 'school'],
    },
    {
      name: 'IntegrationSyncLog',
      domain: 'INTEGRATIONS',
      description: 'Log audit riwayat sinkronisasi data dari sistem Dapodik, Platform Merdeka Mengajar (PMM), dan Rapor Pendidikan.',
      table: 'integration_sync_logs',
      fields: 14,
      primaryKey: 'id (UUID)',
      foreignKeys: ['triggeredById -> User.id'],
      relations: ['triggeredBy'],
    },
    {
      name: 'SchoolRaporPendidikan',
      domain: 'INTEGRATIONS',
      description: 'Nilai indikator literasi, numerasi, iklim keamanan, kebinekaan, dan prioritas rekomendasi pembenahan.',
      table: 'school_rapor_pendidikan',
      fields: 14,
      primaryKey: 'id (UUID)',
      foreignKeys: ['schoolId -> School.id (CASCADE)'],
      relations: ['school'],
    },
    {
      name: 'TeacherPmmProgress',
      domain: 'INTEGRATIONS',
      description: 'Kemajuan penyelesaian topik pelatihan mandiri dan aksi nyata guru di platform PMM.',
      table: 'teacher_pmm_progress',
      fields: 11,
      primaryKey: 'id (UUID)',
      foreignKeys: ['userId -> User.id (CASCADE)', 'schoolId -> School.id (CASCADE)'],
      relations: ['user', 'school'],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(rawPrismaSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([rawPrismaSchema], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema.prisma';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredModels = modelDefinitions.filter((m) => {
    const matchesDomain = activeDomainFilter === 'ALL' || m.domain === activeDomainFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.table.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Database className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Prisma Database Schema (`schema.prisma`)
                </h1>
                <p className="text-sm text-slate-400">
                  Definisi Database Enterprise PostgreSQL SiWasPro — 100% Utuh & Terstruktur
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors shadow-sm"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin schema.prisma'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors shadow-lg shadow-cyan-600/20"
            >
              <Download className="h-4 w-4" />
              <span>Unduh .prisma</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-slate-400 text-xs font-medium">Model Entitas</div>
            <div className="text-2xl font-extrabold text-cyan-400 mt-0.5">18 Tabel</div>
            <div className="text-[11px] text-slate-500">Mencakup 7 Domain Inti</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-slate-400 text-xs font-medium">Enums Terdefinisi</div>
            <div className="text-2xl font-extrabold text-purple-400 mt-0.5">17 Enums</div>
            <div className="text-[11px] text-slate-500">Kategori, Peran & Status</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-slate-400 text-xs font-medium">Relasi Foreign Key</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">24 Relasi</div>
            <div className="text-[11px] text-slate-500">Cascade & Restrict Rules</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-slate-400 text-xs font-medium">Indeks Database</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-0.5">32 Indeks</div>
            <div className="text-[11px] text-slate-500">Optimasi Query Spasial & Filter</div>
          </div>
        </div>
      </div>

      {/* Model Entity Catalog */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Katalog Entitas Data & Arsitektur Relasi
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari model, tabel, field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {domains.map((dom) => (
            <button
              key={dom.id}
              onClick={() => setActiveDomainFilter(dom.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeDomainFilter === dom.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {dom.name}
            </button>
          ))}
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => (
            <div
              key={model.name}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      @{model.table}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5 font-mono">
                      model {model.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-800 text-slate-300">
                    {model.fields} fields
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {model.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Key className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span className="font-mono text-slate-300">{model.primaryKey}</span>
                </div>

                {model.foreignKeys.length > 0 && (
                  <div className="flex items-start gap-1.5 text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="font-mono text-emerald-300/90 truncate">
                      {model.foreignKeys.join(', ')}
                    </div>
                  </div>
                )}

                {model.relations.length > 0 && (
                  <div className="flex items-start gap-1.5 text-slate-400">
                    <ListTree className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="font-mono text-slate-400 truncate">
                      Relasi: {model.relations.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Schema Code Viewer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-mono text-xs font-semibold text-slate-300 ml-2">
              prisma/schema.prisma (100% Utuh)
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="p-4 overflow-x-auto max-h-[550px] font-mono text-xs leading-relaxed text-slate-300 selection:bg-cyan-900/60 selection:text-white">
          <pre className="whitespace-pre">
            {rawPrismaSchema}
          </pre>
        </div>
      </div>
    </div>
  );
};
