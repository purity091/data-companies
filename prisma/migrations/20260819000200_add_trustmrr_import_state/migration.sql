CREATE TABLE "trustmrr_import_state" (
    "id" SMALLINT NOT NULL DEFAULT 1,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "next_page" INTEGER NOT NULL DEFAULT 1,
    "locked_until" TIMESTAMPTZ(3),
    "last_run_at" TIMESTAMPTZ(3),
    "last_fetched" INTEGER NOT NULL DEFAULT 0,
    "last_created" INTEGER NOT NULL DEFAULT 0,
    "last_updated" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trustmrr_import_state_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "trustmrr_import_state_singleton_check" CHECK ("id" = 1)
);

INSERT INTO "trustmrr_import_state" ("id") VALUES (1)
ON CONFLICT ("id") DO NOTHING;
