-- CreateTable
CREATE TABLE "leads" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "chosen_level" INTEGER,
    "recommended_level" INTEGER NOT NULL,
    "verdict" TEXT,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "stages_passed" INTEGER NOT NULL,
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "gaps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tab_switches" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);
