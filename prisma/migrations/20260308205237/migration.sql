-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "password" TEXT,
    "image" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "bio" TEXT,
    "hourlyRate" REAL,
    "availability" TEXT,
    "skills" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "companyId" TEXT,
    CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "document" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BACKLOG',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "platform" TEXT,
    "startDate" DATETIME,
    "deadline" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "targetAudience" TEXT,
    "expectedUsers" TEXT,
    "designPreference" TEXT,
    "references" TEXT,
    "urgency" TEXT,
    "additionalInfo" TEXT,
    "hasExistingSystem" BOOLEAN NOT NULL DEFAULT false,
    "existingSystemDetails" TEXT,
    "clientId" TEXT NOT NULL,
    "companyId" TEXT,
    "developerId" TEXT,
    CONSTRAINT "projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "projects_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "projects_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_features" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_features_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "projectType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedDeadline" TEXT,
    "estimatedBudget" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "order" INTEGER NOT NULL DEFAULT 0,
    "dueDate" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectId" TEXT NOT NULL,
    "assignee" TEXT,
    CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "comments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    CONSTRAINT "project_files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "activity_logs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "companyName" TEXT NOT NULL DEFAULT 'Minha Empresa',
    "companyEmail" TEXT,
    "companyPhone" TEXT,
    "companyAddress" TEXT,
    "companyWebsite" TEXT,
    "maxFileSize" INTEGER NOT NULL DEFAULT 52428800,
    "allowedFileTypes" TEXT,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "requireTwoFactor" BOOLEAN NOT NULL DEFAULT false,
    "sessionTimeout" INTEGER NOT NULL DEFAULT 30,
    "pixEnabled" BOOLEAN NOT NULL DEFAULT true,
    "pixKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "companies_document_key" ON "companies"("document");
