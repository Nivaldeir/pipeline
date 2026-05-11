-- project_phases: adicionar description e assignedToId (+ FK)
ALTER TABLE "project_phases" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "project_phases" ADD COLUMN IF NOT EXISTS "assignedToId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'project_phases_assignedToId_fkey'
      AND table_name = 'project_phases'
  ) THEN
    ALTER TABLE "project_phases"
      ADD CONSTRAINT "project_phases_assignedToId_fkey"
      FOREIGN KEY ("assignedToId") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

-- phase_tasks: adicionar hoursWorked e assigneeId (+ FK)
ALTER TABLE "phase_tasks" ADD COLUMN IF NOT EXISTS "hoursWorked" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "phase_tasks" ADD COLUMN IF NOT EXISTS "assigneeId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'phase_tasks_assigneeId_fkey'
      AND table_name = 'phase_tasks'
  ) THEN
    ALTER TABLE "phase_tasks"
      ADD CONSTRAINT "phase_tasks_assigneeId_fkey"
      FOREIGN KEY ("assigneeId") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;
