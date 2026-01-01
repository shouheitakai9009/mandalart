-- CreateEnum
CREATE TYPE "MandalartStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DELETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mandalart" (
    "id" TEXT NOT NULL,
    "mainGoal" TEXT NOT NULL,
    "status" "MandalartStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mandalart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MandalartSnapshot" (
    "id" TEXT NOT NULL,
    "mandalartId" TEXT NOT NULL,
    "mainGoal" TEXT NOT NULL,
    "snapshotData" JSONB NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "weekEndDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MandalartSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "mandalartId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "targetCount" INTEGER NOT NULL,
    "targetUnit" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "goalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Mandalart_userId_status_idx" ON "Mandalart"("userId", "status");

-- CreateIndex
CREATE INDEX "Mandalart_userId_deletedAt_idx" ON "Mandalart"("userId", "deletedAt");

-- CreateIndex
CREATE INDEX "MandalartSnapshot_mandalartId_weekStartDate_idx" ON "MandalartSnapshot"("mandalartId", "weekStartDate");

-- CreateIndex
CREATE INDEX "MandalartSnapshot_mandalartId_createdAt_idx" ON "MandalartSnapshot"("mandalartId", "createdAt");

-- CreateIndex
CREATE INDEX "Goal_mandalartId_idx" ON "Goal"("mandalartId");

-- CreateIndex
CREATE UNIQUE INDEX "Goal_mandalartId_position_key" ON "Goal"("mandalartId", "position");

-- CreateIndex
CREATE INDEX "Task_goalId_idx" ON "Task"("goalId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_goalId_position_key" ON "Task"("goalId", "position");

-- AddForeignKey
ALTER TABLE "Mandalart" ADD CONSTRAINT "Mandalart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MandalartSnapshot" ADD CONSTRAINT "MandalartSnapshot_mandalartId_fkey" FOREIGN KEY ("mandalartId") REFERENCES "Mandalart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_mandalartId_fkey" FOREIGN KEY ("mandalartId") REFERENCES "Mandalart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
