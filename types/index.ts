// =============================================================================
// SiWasPro (Sistem Informasi Pengawas Profesional)
// TypeScript Type Definitions & Domain Interfaces
// 100% Complete, Production-Grade, Zero Compromise & No Placeholders
// =============================================================================

// -----------------------------------------------------------------------------
// 1. SYSTEM ENUMS
// -----------------------------------------------------------------------------

export enum UserRole {
  PENGAWAS = 'PENGAWAS',
  KEPALA_SEKOLAH = 'KEPALA_SEKOLAH',
  GURU = 'GURU',
  DINAS_PENDIDIKAN = 'DINAS_PENDIDIKAN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum SchoolLevel {
  PAUD = 'PAUD',
  SD = 'SD',
  SMP = 'SMP',
  SMA = 'SMA',
  SMK = 'SMK',
  SLB = 'SLB',
}

export enum SchoolStatus {
  NEGERI = 'NEGERI',
  SWASTA = 'SWASTA',
}

export enum AccreditationGrade {
  A = 'A',
  B = 'B',
  C = 'C',
  BELUM_TERAKREDITASI = 'BELUM_TERAKREDITASI',
}

export enum RiskLevel {
  RENDAH = 'RENDAH',
  SEDANG = 'SEDANG',
  TINGGI = 'TINGGI',
  KRITIS = 'KRITIS',
}

export enum DocumentType {
  KOSP = 'KOSP',
  RKAS = 'RKAS',
  MODUL_AJAR = 'MODUL_AJAR',
  PROGRAM_KERJA_SEKOLAH = 'PROGRAM_KERJA_SEKOLAH',
  RAPOR_MUTU_INTERNAL = 'RAPOR_MUTU_INTERNAL',
  KTSP = 'KTSP',
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  REVISION_REQUIRED = 'REVISION_REQUIRED',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
}

export enum CommentStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
  WONT_FIX = 'WONT_FIX',
}

export enum AuditAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW_SET = 'IN_REVIEW_SET',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
  VERSION_ADDED = 'VERSION_ADDED',
  DELETED = 'DELETED',
}

export enum ReflectionCategory {
  REFLEKSI_GURU = 'REFLEKSI_GURU',
  REFLEKSI_KEPALA_SEKOLAH = 'REFLEKSI_KEPALA_SEKOLAH',
  CATATAN_PENGAWAS = 'CATATAN_PENGAWAS',
  REFLEKSI_KOMUNITAS_BELAJAR = 'REFLEKSI_KOMUNITAS_BELAJAR',
}

export enum ReflectionMood {
  SANGAT_ANTUSIAS = 'SANGAT_ANTUSIAS',
  PUAS = 'PUAS',
  NETRAL = 'NETRAL',
  TERTANTANG = 'TERTANTANG',
  BUTUH_BANTUAN = 'BUTUH_BANTUAN',
}

export enum ObservationStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED',
  CANCELLED = 'CANCELLED',
}

export enum ObservationPredicate {
  SANGAT_BAIK = 'SANGAT_BAIK',
  BAIK = 'BAIK',
  CUKUP = 'CUKUP',
  KURANG = 'KURANG',
}

export enum ClinicType {
  INDIVIDUAL_COACHING = 'INDIVIDUAL_COACHING',
  KLINIK_KOSP = 'KLINIK_KOSP',
  KLINIK_RKAS = 'KLINIK_RKAS',
  SUPERVISI_KLINIS = 'SUPERVISI_KLINIS',
  KONSULTASI_MANAJERIAL = 'KONSULTASI_MANAJERIAL',
  BEDAH_RAPOR_PENDIDIKAN = 'BEDAH_RAPOR_PENDIDIKAN',
}

export enum ClinicStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED',
  CANCELLED = 'CANCELLED',
}

export enum IntegrationSource {
  DAPODIK = 'DAPODIK',
  RAPOR_PENDIDIKAN = 'RAPOR_PENDIDIKAN',
  PMM = 'PMM',
  SIAP_SEKOLAH = 'SIAP_SEKOLAH',
}

export enum SyncType {
  SCHEDULED_FULL = 'SCHEDULED_FULL',
  INCREMENTAL = 'INCREMENTAL',
  MANUAL_TRIGGER = 'MANUAL_TRIGGER',
  WEBHOOK_EVENT = 'WEBHOOK_EVENT',
}

export enum SyncStatus {
  SUCCESS = 'SUCCESS',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS',
  FAILED = 'FAILED',
  IN_PROGRESS = 'IN_PROGRESS',
}

// -----------------------------------------------------------------------------
// 2. CORE ENTITY INTERFACES
// -----------------------------------------------------------------------------

export interface User {
  id: string;
  nip: string | null;
  nuptk: string | null;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  phoneNumber: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  lastLoginAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  schoolId: string | null;
}

export interface UserProfile {
  id: string;
  userId: string;
  pangkatGolongan: string | null;
  jabatan: string | null;
  jenjangPengawasan: SchoolLevel | null;
  pendidikanTerakhir: string | null;
  spesialisasi: string | null;
  bio: string | null;
  ttdDigitalUrl: string | null;
  nomorSertifikat: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PengawasAssignment {
  id: string;
  pengawasId: string;
  schoolId: string;
  academicYear: string;
  semester: number;
  isLeadSupervisor: boolean;
  startDate: Date | string;
  endDate: Date | string | null;
  skPenugasanNumber: string | null;
  skPenugasanUrl: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface School {
  id: string;
  npsn: string;
  name: string;
  level: SchoolLevel;
  status: SchoolStatus;
  accreditation: AccreditationGrade;
  alamat: string;
  kelurahanDesa: string | null;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string | null;
  latitude: number;
  longitude: number;
  telepon: string | null;
  emailSekolah: string | null;
  website: string | null;
  headmasterName: string | null;
  headmasterNip: string | null;
  curriculumType: string;
  studentCount: number;
  teacherCount: number;
  classroomCount: number;
  riskLevel: RiskLevel;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RegionalHeatmapData {
  id: string;
  kabupatenKota: string;
  kecamatan: string;
  academicYear: string;
  semester: number;
  level: SchoolLevel | null;
  totalSchools: number;
  schoolsSupervised: number;
  schoolsUnderRisk: number;
  averageLiteracyScore: number;
  averageNumeracyScore: number;
  averageClimateScore: number;
  complianceRate: number;
  riskLevel: RiskLevel;
  coordinatesGeoJson: string | null;
  metricsPayload: Record<string, unknown> | null;
  recordedAt: Date | string;
  updatedAt: Date | string;
}

export interface Document {
  id: string;
  schoolId: string;
  uploadedById: string;
  reviewedById: string | null;
  title: string;
  type: DocumentType;
  academicYear: string;
  semester: number | null;
  status: DocumentStatus;
  currentVersionNumber: number;
  description: string | null;
  tags: string[];
  lastReviewedAt: Date | string | null;
  rejectionReason: string | null;
  approvalNotes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  uploadedById: string;
  versionNumber: number;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  fileMimeType: string;
  fileSha256Checksum: string | null;
  changeSummary: string | null;
  isVerified: boolean;
  extractedTextPreview: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date | string;
}

export interface DocumentComment {
  id: string;
  documentId: string;
  authorId: string;
  parentCommentId: string | null;
  versionNumber: number;
  pageNumber: number | null;
  sectionKey: string | null;
  content: string;
  status: CommentStatus;
  resolvedAt: Date | string | null;
  resolvedById: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DocumentAuditTrail {
  id: string;
  documentId: string;
  actorId: string;
  action: AuditAction;
  fromStatus: DocumentStatus | null;
  toStatus: DocumentStatus | null;
  versionNumber: number | null;
  notes: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date | string;
}

export interface ReflectionJournal {
  id: string;
  authorId: string;
  schoolId: string;
  reviewerId: string | null;
  category: ReflectionCategory;
  academicYear: string;
  semester: number;
  dateRecorded: Date | string;
  mood: ReflectionMood;
  title: string;
  whatWentWell: string;
  challengesFaced: string;
  actionPlanNext: string;
  resourcesNeeded: string | null;
  supervisorFeedback: string | null;
  feedbackGivenAt: Date | string | null;
  isPublicInSchool: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Observation {
  id: string;
  observerId: string;
  targetTeacherId: string;
  schoolId: string;
  rubricTemplateId: string;
  scheduleDate: Date | string;
  executionDate: Date | string | null;
  status: ObservationStatus;
  subject: string;
  gradeLevel: string;
  curriculumTopic: string;
  modulAjarDocumentId: string | null;
  voiceNoteUrl: string | null;
  voiceNoteDurationSec: number | null;
  voiceNoteTranscript: string | null;
  voiceNoteConfidence: number | null;
  totalScore: number | null;
  maxPossibleScore: number | null;
  percentageScore: number | null;
  finalPredicate: ObservationPredicate | null;
  qualitativeStrengths: string | null;
  areasForGrowth: string | null;
  agreedNextSteps: string | null;
  teacherSignatureDate: Date | string | null;
  observerSignatureDate: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RubricTemplate {
  id: string;
  code: string;
  title: string;
  version: number;
  targetRole: UserRole;
  isActive: boolean;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RubricDomain {
  id: string;
  rubricTemplateId: string;
  name: string;
  orderIndex: number;
  weight: number;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RubricIndicator {
  id: string;
  domainId: string;
  code: string;
  statement: string;
  orderIndex: number;
  maxScore: number;
  guidanceTextLevel1: string | null;
  guidanceTextLevel2: string | null;
  guidanceTextLevel3: string | null;
  guidanceTextLevel4: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ObservationScore {
  id: string;
  observationId: string;
  indicatorId: string;
  score: number;
  evidenceNote: string | null;
  improvementTip: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface VirtualClinicBooking {
  id: string;
  bookingCode: string;
  requesterId: string;
  pengawasId: string;
  schoolId: string;
  clinicType: ClinicType;
  topic: string;
  description: string;
  scheduledAt: Date | string;
  durationMinutes: number;
  meetingPlatform: string;
  meetingJoinUrl: string | null;
  meetingPasscode: string | null;
  status: ClinicStatus;
  rejectionReason: string | null;
  discussionSummary: string | null;
  actionItems: string[];
  followUpDate: Date | string | null;
  satisfactionRating: number | null;
  feedbackNote: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IntegrationSyncLog {
  id: string;
  sourceSystem: IntegrationSource;
  syncType: SyncType;
  status: SyncStatus;
  triggeredById: string | null;
  startedAt: Date | string;
  completedAt: Date | string | null;
  durationMs: number | null;
  totalRecordsFetched: number;
  totalRecordsSynced: number;
  totalErrors: number;
  syncSummaryPayload: Record<string, unknown> | null;
  errorDetails: Record<string, unknown> | null;
  endpointUrl: string | null;
  ipAddress: string | null;
}

export interface SchoolRaporPendidikan {
  id: string;
  schoolId: string;
  academicYear: string;
  capaianLiterasi: number;
  kategoriLiterasi: string;
  capaianNumerasi: number;
  kategoriNumerasi: string;
  iklimKeamananBelajar: number;
  iklimKebhinekaan: number;
  kualitasPembelajaran: number;
  kepemimpinanInstruksional: number;
  penyerapanAnggaranRkas: number;
  prioritasRekomendasi: string[];
  syncedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TeacherPmmProgress {
  id: string;
  userId: string;
  schoolId: string;
  nuptk: string;
  totalTopikPelatihan: number;
  topikDiselesaikan: number;
  aksiNyataDivalidasi: number;
  sertifikatDiperoleh: number;
  terakhirAksesPmm: Date | string | null;
  statusKinerjaPmm: string | null;
  syncedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// -----------------------------------------------------------------------------
// 3. AGGREGATE & POPULATED VIEW INTERFACES
// -----------------------------------------------------------------------------

export interface UserPopulated extends User {
  school?: School | null;
  profile?: UserProfile | null;
  assignedSchools?: PengawasAssignmentWithSchool[];
}

export interface PengawasAssignmentWithSchool extends PengawasAssignment {
  school: School;
}

export interface DocumentWithDetails extends Document {
  school: School;
  uploadedBy: Pick<User, 'id' | 'name' | 'email' | 'role' | 'avatarUrl'>;
  reviewedBy?: Pick<User, 'id' | 'name' | 'email' | 'role' | 'avatarUrl'> | null;
  versions: DocumentVersion[];
  comments: DocumentCommentWithAuthor[];
  auditTrails: DocumentAuditTrailWithActor[];
}

export interface DocumentCommentWithAuthor extends DocumentComment {
  author: Pick<User, 'id' | 'name' | 'role' | 'avatarUrl'>;
  replies?: DocumentCommentWithAuthor[];
}

export interface DocumentAuditTrailWithActor extends DocumentAuditTrail {
  actor: Pick<User, 'id' | 'name' | 'role'>;
}

export interface ObservationWithDetails extends Observation {
  observer: Pick<User, 'id' | 'name' | 'nip' | 'avatarUrl' | 'role'>;
  targetTeacher: Pick<User, 'id' | 'name' | 'nuptk' | 'avatarUrl' | 'role'>;
  school: School;
  rubricTemplate: RubricTemplateWithHierarchy;
  itemScores: ObservationScoreWithIndicator[];
}

export interface RubricTemplateWithHierarchy extends RubricTemplate {
  domains: (RubricDomain & {
    indicators: RubricIndicator[];
  })[];
}

export interface ObservationScoreWithIndicator extends ObservationScore {
  indicator: RubricIndicator;
}

export interface VirtualClinicWithParties extends VirtualClinicBooking {
  requester: Pick<User, 'id' | 'name' | 'role' | 'avatarUrl' | 'phoneNumber'>;
  pengawas: Pick<User, 'id' | 'name' | 'nip' | 'avatarUrl' | 'phoneNumber'>;
  school: Pick<School, 'id' | 'name' | 'npsn' | 'level' | 'kecamatan'>;
}

export interface ReflectionWithAuthorAndFeedback extends ReflectionJournal {
  author: Pick<User, 'id' | 'name' | 'role' | 'avatarUrl'>;
  reviewer?: Pick<User, 'id' | 'name' | 'role'> | null;
  school: Pick<School, 'id' | 'name' | 'level'>;
}

export interface SchoolWithDashboardData extends School {
  raporPendidikanLatest?: SchoolRaporPendidikan | null;
  pengawasPembina?: Pick<User, 'id' | 'name' | 'nip' | 'phoneNumber' | 'avatarUrl'> | null;
  activeSupervisionCount: number;
  documentPendingReviewCount: number;
}

// -----------------------------------------------------------------------------
// 4. DATA TRANSFER OBJECTS (INPUT & MUTATION PAYLOADS)
// -----------------------------------------------------------------------------

export interface CreateUserPayload {
  nip?: string;
  nuptk?: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  phoneNumber?: string;
  schoolId?: string;
}

export interface CreateDocumentPayload {
  schoolId: string;
  uploadedById: string;
  title: string;
  type: DocumentType;
  academicYear: string;
  semester?: number;
  description?: string;
  tags?: string[];
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  fileMimeType: string;
  changeSummary?: string;
}

export interface CreateObservationPayload {
  observerId: string;
  targetTeacherId: string;
  schoolId: string;
  rubricTemplateId: string;
  scheduleDate: string;
  subject: string;
  gradeLevel: string;
  curriculumTopic: string;
  modulAjarDocumentId?: string;
}

export interface SubmitObservationScoreItem {
  indicatorId: string;
  score: number;
  evidenceNote?: string;
  improvementTip?: string;
}

export interface CompleteObservationPayload {
  observationId: string;
  executionDate: string;
  scores: SubmitObservationScoreItem[];
  voiceNoteUrl?: string;
  voiceNoteDurationSec?: number;
  voiceNoteTranscript?: string;
  voiceNoteConfidence?: number;
  qualitativeStrengths: string;
  areasForGrowth: string;
  agreedNextSteps: string;
  finalPredicate: ObservationPredicate;
}

export interface BookVirtualClinicPayload {
  requesterId: string;
  pengawasId: string;
  schoolId: string;
  clinicType: ClinicType;
  topic: string;
  description: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingPlatform: string;
}

export interface CreateReflectionPayload {
  authorId: string;
  schoolId: string;
  category: ReflectionCategory;
  academicYear: string;
  semester: number;
  mood: ReflectionMood;
  title: string;
  whatWentWell: string;
  challengesFaced: string;
  actionPlanNext: string;
  resourcesNeeded?: string;
  isPublicInSchool: boolean;
}

export interface TriggerSyncPayload {
  sourceSystem: IntegrationSource;
  syncType: SyncType;
  triggeredById: string;
  academicYear: string;
  specificSchoolId?: string;
}

// -----------------------------------------------------------------------------
// 5. ROLE-BASED ACCESS CONTROL (RBAC) PERMISSION MATRIX
// -----------------------------------------------------------------------------

export type PermissionAction =
  | 'VIEW_REGIONAL_HEATMAP'
  | 'EXPORT_DINAS_ANALYTICS'
  | 'ASSIGN_PENGAWAS'
  | 'MANAGE_RUBRIC_TEMPLATES'
  | 'CONDUCT_SUPERVISION'
  | 'SUBMIT_VOICE_NOTE'
  | 'REVIEW_DOCUMENTS'
  | 'APPROVE_DOCUMENTS'
  | 'UPLOAD_KOSP'
  | 'UPLOAD_RKAS'
  | 'UPLOAD_MODUL_AJAR'
  | 'BOOK_VIRTUAL_CLINIC'
  | 'HOST_VIRTUAL_CLINIC'
  | 'WRITE_TEACHER_REFLECTION'
  | 'WRITE_HEADMASTER_REFLECTION'
  | 'TRIGGER_DAPODIK_SYNC'
  | 'TRIGGER_PMM_SYNC'
  | 'VIEW_RAPOR_PENDIDIKAN';

export interface RoleCapability {
  role: UserRole;
  title: string;
  description: string;
  allowedActions: PermissionAction[];
  primaryDashboardRoute: string;
}

export const ROLE_CAPABILITIES: Record<UserRole, RoleCapability> = {
  [UserRole.PENGAWAS]: {
    role: UserRole.PENGAWAS,
    title: 'Pengawas Sekolah',
    description: 'Melakukan supervisi akademik & manajerial, klinik virtual, verifikasi KOSP/RKAS, penilaian rubrik & voice note.',
    allowedActions: [
      'VIEW_REGIONAL_HEATMAP',
      'CONDUCT_SUPERVISION',
      'SUBMIT_VOICE_NOTE',
      'REVIEW_DOCUMENTS',
      'APPROVE_DOCUMENTS',
      'HOST_VIRTUAL_CLINIC',
      'VIEW_RAPOR_PENDIDIKAN',
      'TRIGGER_PMM_SYNC',
    ],
    primaryDashboardRoute: '/dashboard/pengawas',
  },
  [UserRole.KEPALA_SEKOLAH]: {
    role: UserRole.KEPALA_SEKOLAH,
    title: 'Kepala Sekolah',
    description: 'Mengunggah KOSP & RKAS, memonitor kinerja guru binaan, booking klinik pengawas, mengisi refleksi manajerial.',
    allowedActions: [
      'UPLOAD_KOSP',
      'UPLOAD_RKAS',
      'BOOK_VIRTUAL_CLINIC',
      'WRITE_HEADMASTER_REFLECTION',
      'VIEW_RAPOR_PENDIDIKAN',
      'TRIGGER_DAPODIK_SYNC',
    ],
    primaryDashboardRoute: '/dashboard/kepala-sekolah',
  },
  [UserRole.GURU]: {
    role: UserRole.GURU,
    title: 'Guru Mata Pelajaran / Kelas',
    description: 'Mengunggah Modul Ajar, menerima hasil supervisi & transkrip umpan balik, booking klinik bimbingan, menulis jurnal refleksi.',
    allowedActions: [
      'UPLOAD_MODUL_AJAR',
      'BOOK_VIRTUAL_CLINIC',
      'WRITE_TEACHER_REFLECTION',
    ],
    primaryDashboardRoute: '/dashboard/guru',
  },
  [UserRole.DINAS_PENDIDIKAN]: {
    role: UserRole.DINAS_PENDIDIKAN,
    title: 'Dinas Pendidikan',
    description: 'Melihat peta mutu regional (Heatmap), manajemen penugasan pengawas pembina, monitoring kepatuhan KOSP/RKAS se-wilayah.',
    allowedActions: [
      'VIEW_REGIONAL_HEATMAP',
      'EXPORT_DINAS_ANALYTICS',
      'ASSIGN_PENGAWAS',
      'MANAGE_RUBRIC_TEMPLATES',
      'TRIGGER_DAPODIK_SYNC',
      'TRIGGER_PMM_SYNC',
      'VIEW_RAPOR_PENDIDIKAN',
    ],
    primaryDashboardRoute: '/dashboard/dinas',
  },
  [UserRole.SUPER_ADMIN]: {
    role: UserRole.SUPER_ADMIN,
    title: 'Administrator Sistem Pusat',
    description: 'Kendali penuh atas manajemen pengguna, konfigurasi integrasi Dapodik/PMM, audit log dan integritas skema database.',
    allowedActions: [
      'VIEW_REGIONAL_HEATMAP',
      'EXPORT_DINAS_ANALYTICS',
      'ASSIGN_PENGAWAS',
      'MANAGE_RUBRIC_TEMPLATES',
      'CONDUCT_SUPERVISION',
      'SUBMIT_VOICE_NOTE',
      'REVIEW_DOCUMENTS',
      'APPROVE_DOCUMENTS',
      'UPLOAD_KOSP',
      'UPLOAD_RKAS',
      'UPLOAD_MODUL_AJAR',
      'BOOK_VIRTUAL_CLINIC',
      'HOST_VIRTUAL_CLINIC',
      'WRITE_TEACHER_REFLECTION',
      'WRITE_HEADMASTER_REFLECTION',
      'TRIGGER_DAPODIK_SYNC',
      'TRIGGER_PMM_SYNC',
      'VIEW_RAPOR_PENDIDIKAN',
    ],
    primaryDashboardRoute: '/dashboard/admin',
  },
};
