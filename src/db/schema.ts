import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  pgEnum,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  subscriptionStatus: text("subscription_status").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

export const cvs = pgTable(
  "cvs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    data: jsonb("data").notNull(),
    sourceCvId: uuid("source_cv_id"),
    offerId: uuid("offer_id"),
    isActive: boolean("is_active").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("cvs_user_id_idx").on(table.userId),
    uniqueIndex("cvs_one_active_per_user")
      .on(table.userId)
      .where(sql`${table.isActive}`),
  ],
);

export const offerStatus = pgEnum("offer_status", [
  "interested",
  "applied",
  "interview",
  "offer",
  "rejected",
]);

export const jobOffers = pgTable(
  "job_offers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cvId: uuid("cv_id").references(() => cvs.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    company: text("company").notNull(),
    description: text("description").notNull(),
    url: text("url"),
    status: offerStatus("status").notNull().default("interested"),
    matchScore: integer("match_score"),
    matchGaps: jsonb("match_gaps"),
    matchEvidence: jsonb("match_evidence"),
    matchedAt: timestamp("matched_at", { withTimezone: true }),
    proposal: jsonb("proposal"),
    proposalAt: timestamp("proposal_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("job_offers_user_status_idx").on(table.userId, table.status),
    index("job_offers_cv_id_idx").on(table.cvId),
  ],
);

export const skills = pgTable(
  "skills",
  {
    id: text("id").notNull(),
    version: integer("version").notNull(),
    system: text("system").notNull(),
    userTemplate: text("user_template").notNull(),
    output: jsonb("output").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ name: "skills_pkey", columns: [table.id, table.version] }),
  ],
);

export const aiRuns = pgTable(
  "ai_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    skillId: text("skill_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("ai_runs_user_created_idx").on(table.userId, table.createdAt)],
);
