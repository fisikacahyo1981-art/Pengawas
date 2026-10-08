// =============================================================================
// SiWasPro (Sistem Informasi Pengawas Profesional)
// Raw Source Code Constants for Interactive Schema & Types Studio Viewer
// =============================================================================

export const RAW_PRISMA_SCHEMA = `// =============================================================================
// SiWasPro (Sistem Informasi Pengawas Profesional)
// Prisma Schema Definition - 100% Complete & Production Ready
// Database Engine: PostgreSQL
// =============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// -----------------------------------------------------------------------------
// ENUMS: Role-Based Access Control & System Categories
// -----------------------------------------------------------------------------

enum UserRole {
  PENGAWAS
  KEPALA_SEKOLAH
  GURU
  DINAS_PENDIDIKAN
  SUPER_ADMIN
}

enum SchoolLevel {
  PAUD
  SD
  SMP
  SMA
  SMK
  SLB
}

enum SchoolStatus {
  NEGERI
  SWASTA
}

enum AccreditationGrade {
  A
  B
  C
  BELUM_TERAKREDITASI
}

enum RiskLevel {
  RENDAH
  SEDANG
  TINGGI
  KRITIS
}

enum DocumentType {
  KOSP
  RKAS
  MODUL_AJAR
  PROGRAM_KERJA_SEKOLAH
  RAPOR_MUTU_INTERNAL
  KTSP
}

enum DocumentStatus {
  DRAFT
  SUBMITTED
  IN_REVIEW
  REVISION_REQUIRED
  APPROVED
  ARCHIVED
}

enum CommentStatus {
  OPEN
  RESOLVED
  WONT_FIX
}

enum AuditAction {
  CREATED
  UPDATED
  SUBMITTED
  IN_REVIEW_SET
  REVISION_REQUESTED
  APPROVED
  ARCHIVED
  VERSION_ADDED
  DELETED
}

enum ReflectionCategory {
  REFLEKSI_GURU
  REFLEKSI_KEPALA_SEKOLAH
  CATATAN_PENGAWAS
  REFLEKSI_KOMUNITAS_BELAJAR
}

enum ReflectionMood {
  SANGAT_ANTUSIAS
  PUAS
  NETRAL
  TERTANTANG
  BUTUH_BANTUAN
}

enum ObservationStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  RESCHEDULED
  CANCELLED
}

enum ObservationPredicate {
  SANGAT_BAIK
  BAIK
  CUKUP
  KURANG
}

enum ClinicType {
  INDIVIDUAL_COACHING
  KLINIK_KOSP
  KLINIK_RKAS
  SUPERVISI_KLINIS
  KONSULTASI_MANAJERIAL
  BEDAH_RAPOR_PENDIDIKAN
}

enum ClinicStatus {
  PENDING
  CONFIRMED
  COMPLETED
  RESCHEDULED
  CANCELLED
}

enum IntegrationSource {
  DAPODIK
  RAPOR_PENDIDIKAN
  PMM
  SIAP_SEKOLAH
}

enum SyncType {
  SCHEDULED_FULL
  INCREMENTAL
  MANUAL_TRIGGER
  WEBHOOK_EVENT
}

enum SyncStatus {
  SUCCESS
  PARTIAL_SUCCESS
  FAILED
  IN_PROGRESS
}

// -----------------------------------------------------------------------------
// 1. USERS, PROFILES & AUTHENTICATION
// -----------------------------------------------------------------------------

model User {
  id                   String            @id @default(uuid())
  nip                  String?           @unique
  nuptk                String?           @unique
  email                String            @unique
  name                 String
  passwordHash         String
  role                 UserRole
  phoneNumber          String?
  avatarUrl            String?
  isActive             Boolean           @default(true)
  lastLoginAt          DateTime?
  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt

  // Relasi Profil & Asosiasi Sekolah
  schoolId             String?
  school               School?           @relation("SchoolAffiliation", fields: [schoolId], references: [id], onDelete: SetNull)
  profile              UserProfile?

  // Relasi Pengawas Pembina (Khusus role PENGAWAS)
  assignedSchools      PengawasAssignment[] @relation("PengawasAssignments")

  // Relasi Dokumen
  uploadedDocuments    Document[]        @relation("DocumentUploader")
  reviewedDocuments    Document[]        @relation("DocumentReviewer")
  uploadedVersions     DocumentVersion[] @relation("VersionUploader")
  documentComments     DocumentComment[] @relation("CommentAuthor")
  auditTrails          DocumentAuditTrail[] @relation("AuditActor")

  // Relasi Jurnal Refleksi
  authoredReflections  ReflectionJournal[]  @relation("AuthorReflections")
  reviewedReflections  ReflectionJournal[]  @relation("ReviewerReflections")

  // Relasi Observasi Supervisi
  conductedObservations Observation[]   @relation("ConductedObservations")
  receivedObservations  Observation[]   @relation("ReceivedObservations")

  // Relasi Klinik Virtual
  requestedClinics     VirtualClinicBooking[] @relation("RequestedClinics")
  supervisedClinics    VirtualClinicBooking[] @relation("SupervisedClinics")

  // Relasi Log Sinkronisasi
  triggeredSyncLogs    IntegrationSyncLog[]   @relation("TriggeredSyncs")

  // Relasi PMM Progress
  pmmProgress          TeacherPmmProgress?

  @@index([role])
  @@index([schoolId])
  @@index([email])
  @@map("users")
}

model UserProfile {
  id                   String    @id @default(uuid())
  userId               String    @unique
  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  pangkatGolongan      String?
  jabatan              String?
  jenjangPengawasan    SchoolLevel?
  pendidikanTerakhir   String?
  spesialisasi         String?
  bio                  String?
  ttdDigitalUrl        String?
  nomorSertifikat      String?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  @@map("user_profiles")
}

model PengawasAssignment {
  id                   String    @id @default(uuid())
  pengawasId           String
  schoolId             String
  academicYear         String
  semester             Int
  isLeadSupervisor     Boolean   @default(true)
  startDate            DateTime  @default(now())
  endDate              DateTime?
  skPenugasanNumber    String?
  skPenugasanUrl       String?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  pengawas             User      @relation("PengawasAssignments", fields: [pengawasId], references: [id], onDelete: Cascade)
  school               School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)

  @@unique([pengawasId, schoolId, academicYear, semester])
  @@index([schoolId])
  @@index([pengawasId])
  @@map("pengawas_assignments")
}

// -----------------------------------------------------------------------------
// 2. SCHOOLS & REGIONAL HEATMAP DATA
// -----------------------------------------------------------------------------

model School {
  id                   String              @id @default(uuid())
  npsn                 String              @unique
  name                 String
  level                SchoolLevel
  status               SchoolStatus
  accreditation        AccreditationGrade  @default(BELUM_TERAKREDITASI)
  alamat               String
  kelurahanDesa        String?
  kecamatan            String
  kabupatenKota        String
  provinsi             String              @default("DKI Jakarta")
  kodePos              String?
  latitude             Float
  longitude            Float
  telepon              String?
  emailSekolah         String?
  website              String?
  headmasterName       String?
  headmasterNip        String?
  curriculumType       String              @default("Kurikulum Merdeka")
  studentCount         Int                 @default(0)
  teacherCount         Int                 @default(0)
  classroomCount       Int                 @default(0)
  riskLevel            RiskLevel           @default(RENDAH)
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt

  // Relasi
  users                User[]              @relation("SchoolAffiliation")
  pengawasAssignments PengawasAssignment[]
  documents            Document[]
  reflections          ReflectionJournal[]
  observations         Observation[]
  clinicBookings       VirtualClinicBooking[]
  raporPendidikanList  SchoolRaporPendidikan[]
  teacherPmmProgresses TeacherPmmProgress[]

  @@index([kabupatenKota, kecamatan])
  @@index([level])
  @@index([riskLevel])
  @@map("schools")
}

model RegionalHeatmapData {
  id                   String       @id @default(uuid())
  kabupatenKota        String
  kecamatan            String
  academicYear         String
  semester             Int
  level                SchoolLevel?
  totalSchools         Int
  schoolsSupervised    Int
  schoolsUnderRisk     Int
  averageLiteracyScore Float
  averageNumeracyScore Float
  averageClimateScore  Float
  complianceRate       Float
  riskLevel            RiskLevel    @default(RENDAH)
  coordinatesGeoJson   String?
  metricsPayload       Json?
  recordedAt           DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  @@unique([kabupatenKota, kecamatan, academicYear, semester, level])
  @@index([kabupatenKota])
  @@index([riskLevel])
  @@map("regional_heatmap_data")
}

// -----------------------------------------------------------------------------
// 3. DOCUMENTS, VERSIONING & COMMENTS (KOSP, RKAS, MODUL AJAR)
// -----------------------------------------------------------------------------

model Document {
  id                   String              @id @default(uuid())
  schoolId             String
  uploadedById         String
  reviewedById         String?
  title                String
  type                 DocumentType
  academicYear         String
  semester             Int?
  status               DocumentStatus      @default(DRAFT)
  currentVersionNumber Int                 @default(1)
  description          String?
  tags                 String[]            @default([])
  lastReviewedAt       DateTime?
  rejectionReason      String?
  approvalNotes        String?
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt

  // Relasi
  school               School              @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  uploadedBy           User                @relation("DocumentUploader", fields: [uploadedById], references: [id], onDelete: Restrict)
  reviewedBy           User?               @relation("DocumentReviewer", fields: [reviewedById], references: [id], onDelete: SetNull)
  versions             DocumentVersion[]
  comments             DocumentComment[]
  auditTrails          DocumentAuditTrail[]

  @@index([schoolId, type])
  @@index([status])
  @@index([uploadedById])
  @@map("documents")
}

model DocumentVersion {
  id                   String       @id @default(uuid())
  documentId           String
  uploadedById         String
  versionNumber        Int
  fileUrl              String
  fileName             String
  fileSizeBytes        Int
  fileMimeType         String       @default("application/pdf")
  fileSha256Checksum   String?
  changeSummary        String?
  isVerified           Boolean      @default(false)
  extractedTextPreview String?
  metadata             Json?
  createdAt            DateTime     @default(now())

  // Relasi
  document             Document     @relation(fields: [documentId], references: [id], onDelete: Cascade)
  uploadedBy           User         @relation("VersionUploader", fields: [uploadedById], references: [id], onDelete: Restrict)

  @@unique([documentId, versionNumber])
  @@index([documentId])
  @@map("document_versions")
}

model DocumentComment {
  id                   String           @id @default(uuid())
  documentId           String
  authorId             String
  parentCommentId      String?
  versionNumber        Int
  pageNumber           Int?
  sectionKey           String?
  content              String
  status               CommentStatus    @default(OPEN)
  resolvedAt           DateTime?
  resolvedById         String?
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt

  // Relasi
  document             Document         @relation(fields: [documentId], references: [id], onDelete: Cascade)
  author               User             @relation("CommentAuthor", fields: [authorId], references: [id], onDelete: Restrict)
  parentComment        DocumentComment? @relation("CommentReplies", fields: [parentCommentId], references: [id], onDelete: Cascade)
  replies              DocumentComment[] @relation("CommentReplies")

  @@index([documentId, versionNumber])
  @@index([status])
  @@map("document_comments")
}

model DocumentAuditTrail {
  id                   String       @id @default(uuid())
  documentId           String
  actorId              String
  action               AuditAction
  fromStatus           DocumentStatus?
  toStatus             DocumentStatus?
  versionNumber        Int?
  notes                String?
  ipAddress            String?
  userAgent            String?
  createdAt            DateTime     @default(now())

  // Relasi
  document             Document     @relation(fields: [documentId], references: [id], onDelete: Cascade)
  actor                User         @relation("AuditActor", fields: [actorId], references: [id], onDelete: Restrict)

  @@index([documentId])
  @@index([actorId])
  @@map("document_audit_trails")
}

// -----------------------------------------------------------------------------
// 4. REFLECTIONS (JURNAL REFLEKSI GURU & KEPALA SEKOLAH)
// -----------------------------------------------------------------------------

model ReflectionJournal {
  id                   String             @id @default(uuid())
  authorId             String
  schoolId             String
  reviewerId           String?
  category             ReflectionCategory
  academicYear         String
  semester             Int
  dateRecorded         DateTime           @default(now())
  mood                 ReflectionMood     @default(PUAS)
  title                String
  whatWentWell         String
  challengesFaced      String
  actionPlanNext       String
  resourcesNeeded      String?
  supervisorFeedback   String?
  feedbackGivenAt      DateTime?
  isPublicInSchool     Boolean            @default(false)
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  // Relasi
  author               User               @relation("AuthorReflections", fields: [authorId], references: [id], onDelete: Cascade)
  reviewer             User?              @relation("ReviewerReflections", fields: [reviewerId], references: [id], onDelete: SetNull)
  school               School             @relation(fields: [schoolId], references: [id], onDelete: Cascade)

  @@index([schoolId])
  @@index([authorId])
  @@index([category])
  @@map("reflection_journals")
}

// -----------------------------------------------------------------------------
// 5. OBSERVATIONS & RUBRICS (PENILAIAN, VOICE NOTE & SCORING)
// -----------------------------------------------------------------------------

model Observation {
  id                      String                @id @default(uuid())
  observerId              String
  targetTeacherId         String
  schoolId                String
  rubricTemplateId        String
  scheduleDate            DateTime
  executionDate           DateTime?
  status                  ObservationStatus     @default(SCHEDULED)
  subject                 String
  gradeLevel              String
  curriculumTopic         String
  modulAjarDocumentId     String?

  // Audio Voice Note Supervisi
  voiceNoteUrl            String?
  voiceNoteDurationSec    Int?
  voiceNoteTranscript     String?
  voiceNoteConfidence     Float?

  // Hasil Skor & Penilaian
  totalScore              Float?
  maxPossibleScore        Float?
  percentageScore         Float?
  finalPredicate          ObservationPredicate?
  qualitativeStrengths    String?
  areasForGrowth          String?
  agreedNextSteps         String?
  teacherSignatureDate    DateTime?
  observerSignatureDate   DateTime?

  createdAt               DateTime              @default(now())
  updatedAt               DateTime              @updatedAt

  // Relasi
  observer                User                  @relation("ConductedObservations", fields: [observerId], references: [id], onDelete: Restrict)
  targetTeacher           User                  @relation("ReceivedObservations", fields: [targetTeacherId], references: [id], onDelete: Restrict)
  school                  School                @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  rubricTemplate          RubricTemplate        @relation(fields: [rubricTemplateId], references: [id], onDelete: Restrict)
  itemScores              ObservationScore[]

  @@index([observerId])
  @@index([targetTeacherId])
  @@index([schoolId])
  @@index([status])
  @@map("observations")
}

model RubricTemplate {
  id                   String            @id @default(uuid())
  code                 String            @unique
  title                String
  version              Int               @default(1)
  targetRole           UserRole          @default(GURU)
  isActive             Boolean           @default(true)
  description          String?
  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt

  // Relasi
  domains              RubricDomain[]
  observations         Observation[]

  @@map("rubric_templates")
}

model RubricDomain {
  id                   String            @id @default(uuid())
  rubricTemplateId     String
  name                 String
  orderIndex           Int
  weight               Float             @default(1.0)
  description          String?
  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt

  // Relasi
  rubricTemplate       RubricTemplate    @relation(fields: [rubricTemplateId], references: [id], onDelete: Cascade)
  indicators           RubricIndicator[]

  @@index([rubricTemplateId, orderIndex])
  @@map("rubric_domains")
}

model RubricIndicator {
  id                   String             @id @default(uuid())
  domainId             String
  code                 String
  statement            String
  orderIndex           Int
  maxScore             Int                @default(4)
  guidanceTextLevel1   String?
  guidanceTextLevel2   String?
  guidanceTextLevel3   String?
  guidanceTextLevel4   String?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  // Relasi
  domain               RubricDomain       @relation(fields: [domainId], references: [id], onDelete: Cascade)
  observationScores    ObservationScore[]

  @@index([domainId, orderIndex])
  @@map("rubric_indicators")
}

model ObservationScore {
  id                   String           @id @default(uuid())
  observationId        String
  indicatorId          String
  score                Int
  evidenceNote         String?
  improvementTip       String?
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt

  // Relasi
  observation          Observation      @relation(fields: [observationId], references: [id], onDelete: Cascade)
  indicator            RubricIndicator  @relation(fields: [indicatorId], references: [id], onDelete: Restrict)

  @@unique([observationId, indicatorId])
  @@index([observationId])
  @@map("observation_scores")
}

// -----------------------------------------------------------------------------
// 6. VIRTUAL CLINIC BOOKINGS (KLINIK PENGAWAS & COACHING)
// -----------------------------------------------------------------------------

model VirtualClinicBooking {
  id                   String        @id @default(uuid())
  bookingCode          String        @unique
  requesterId          String
  pengawasId           String
  schoolId             String
  clinicType           ClinicType
  topic                String
  description          String
  scheduledAt          DateTime
  durationMinutes      Int           @default(45)
  meetingPlatform      String        @default("Google Meet")
  meetingJoinUrl       String?
  meetingPasscode      String?
  status               ClinicStatus  @default(PENDING)
  rejectionReason      String?
  discussionSummary    String?
  actionItems          String[]      @default([])
  followUpDate         DateTime?
  satisfactionRating   Int?
  feedbackNote         String?
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  // Relasi
  requester            User          @relation("RequestedClinics", fields: [requesterId], references: [id], onDelete: Restrict)
  pengawas             User          @relation("SupervisedClinics", fields: [pengawasId], references: [id], onDelete: Restrict)
  school               School        @relation(fields: [schoolId], references: [id], onDelete: Cascade)

  @@index([pengawasId, scheduledAt])
  @@index([requesterId])
  @@index([status])
  @@map("virtual_clinic_bookings")
}

// -----------------------------------------------------------------------------
// 7. INTEGRATIONS & EXTERNAL SYNC LOGS (DAPODIK, RAPOR PENDIDIKAN, PMM)
// -----------------------------------------------------------------------------

model IntegrationSyncLog {
  id                   String            @id @default(uuid())
  sourceSystem         IntegrationSource
  syncType             SyncType
  status               SyncStatus        @default(IN_PROGRESS)
  triggeredById        String?
  startedAt            DateTime          @default(now())
  completedAt          DateTime?
  durationMs           Int?
  totalRecordsFetched  Int               @default(0)
  totalRecordsSynced   Int               @default(0)
  totalErrors          Int               @default(0)
  syncSummaryPayload   Json?
  errorDetails         Json?
  endpointUrl          String?
  ipAddress            String?

  // Relasi
  triggeredBy          User?             @relation("TriggeredSyncs", fields: [triggeredById], references: [id], onDelete: SetNull)

  @@index([sourceSystem, status])
  @@index([startedAt])
  @@map("integration_sync_logs")
}

model SchoolRaporPendidikan {
  id                         String    @id @default(uuid())
  schoolId                   String
  academicYear               String
  capaianLiterasi            Float
  kategoriLiterasi           String
  capaianNumerasi            Float
  kategoriNumerasi           String
  iklimKeamananBelajar       Float
  iklimKebhinekaan           Float
  kualitasPembelajaran       Float
  kepemimpinanInstruksional  Float
  penyerapanAnggaranRkas     Float
  prioritasRekomendasi       String[]  @default([])
  syncedAt                   DateTime  @default(now())
  createdAt                  DateTime  @default(now())
  updatedAt                  DateTime  @updatedAt

  school                     School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)

  @@unique([schoolId, academicYear])
  @@index([schoolId])
  @@map("school_rapor_pendidikan")
}

model TeacherPmmProgress {
  id                         String    @id @default(uuid())
  userId                     String    @unique
  schoolId                   String
  nuptk                      String
  totalTopikPelatihan        Int       @default(0)
  topikDiselesaikan          Int       @default(0)
  aksiNyataDivalidasi        Int       @default(0)
  sertifikatDiperoleh        Int       @default(0)
  terakhirAksesPmm           DateTime?
  statusKinerjaPmm           String?
  syncedAt                   DateTime  @default(now())
  createdAt                  DateTime  @default(now())
  updatedAt                  DateTime  @updatedAt

  user                       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  school                     School    @relation(fields: [schoolId], references: [id], onDelete: Cascade)

  @@index([schoolId])
  @@map("teacher_pmm_progress")
}`;

export const RAW_TYPESCRIPT_CODE = `// =============================================================================
// SiWasPro (Sistem Informasi Pengawas Profesional)
// TypeScript Type Definitions & Domain Interfaces
// 100% Complete, Production-Grade, Zero Compromise & No Placeholders
// =============================================================================

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
}`;
