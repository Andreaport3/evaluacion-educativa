CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADMIN');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING_REVIEW', 'PUBLISHED', 'HIDDEN', 'DELETED');
CREATE TYPE "EvaluationCriterion" AS ENUM ('CLASS_QUALITY', 'ATTITUDE', 'PUNCTUALITY', 'SUBJECT_MASTERY');

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "universities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "location" VARCHAR(255),
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "professors" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "universityId" TEXT NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "professors_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "universityId" TEXT NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "professor_courses" (
    "professorId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "professor_courses_pkey" PRIMARY KEY ("professorId", "courseId")
);

CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "professorId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "comment" VARCHAR(300),
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "evaluation_ratings" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "criterion" "EvaluationCriterion" NOT NULL,
    "score" INTEGER NOT NULL,
    CONSTRAINT "evaluation_ratings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "evaluation_ratings_score_check" CHECK ("score" BETWEEN 1 AND 5)
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "universities_name_key" ON "universities"("name");
CREATE UNIQUE INDEX "professors_universityId_name_key" ON "professors"("universityId", "name");
CREATE INDEX "professors_name_idx" ON "professors"("name");
CREATE UNIQUE INDEX "courses_universityId_name_key" ON "courses"("universityId", "name");
CREATE UNIQUE INDEX "evaluations_userId_professorId_courseId_key" ON "evaluations"("userId", "professorId", "courseId");
CREATE INDEX "evaluations_professorId_courseId_status_idx" ON "evaluations"("professorId", "courseId", "status");
CREATE UNIQUE INDEX "evaluation_ratings_evaluationId_criterion_key" ON "evaluation_ratings"("evaluationId", "criterion");

ALTER TABLE "professors" ADD CONSTRAINT "professors_universityId_fkey"
    FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "courses" ADD CONSTRAINT "courses_universityId_fkey"
    FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "professor_courses" ADD CONSTRAINT "professor_courses_professorId_fkey"
    FOREIGN KEY ("professorId") REFERENCES "professors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "professor_courses" ADD CONSTRAINT "professor_courses_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_professorId_courseId_fkey"
    FOREIGN KEY ("professorId", "courseId") REFERENCES "professor_courses"("professorId", "courseId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "evaluation_ratings" ADD CONSTRAINT "evaluation_ratings_evaluationId_fkey"
    FOREIGN KEY ("evaluationId") REFERENCES "evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
