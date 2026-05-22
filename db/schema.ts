import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  bio: text("bio").default(""),
  points: integer("points").default(0),
  level: integer("level").default(1),
  badges: text("badges").default("[]"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const materials = sqliteTable("materials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description").default(""),
  projectCount: integer("project_count").default(0),
  color: text("color").default("#2F5D3A"),
});

export const crafts = sqliteTable("crafts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").default(""),
  image: text("image").notNull(),
  authorId: text("author_id").references(() => users.id),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  timeMinutes: integer("time_minutes").default(30),
  ageGroup: text("age_group").default("todos"),
  materials: text("materials").default("[]"),
  steps: text("steps").default("[]"),
  likes: integer("likes").default(0),
  saves: integer("saves").default(0),
  views: integer("views").default(0),
  tags: text("tags").default("[]"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const craftLikes = sqliteTable("craft_likes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  craftId: integer("craft_id").references(() => crafts.id),
  userId: text("user_id").references(() => users.id),
});

export const craftSaves = sqliteTable("craft_saves", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  craftId: integer("craft_id").references(() => crafts.id),
  userId: text("user_id").references(() => users.id),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  authorId: text("author_id").references(() => users.id),
  content: text("content").notNull(),
  images: text("images").default("[]"),
  tags: text("tags").default("[]"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  craftId: integer("craft_id").references(() => crafts.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const follows = sqliteTable("follows", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  followerId: text("follower_id").references(() => users.id),
  followingId: text("following_id").references(() => users.id),
});

export const quizQuestions = sqliteTable("quiz_questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctOption: text("correct_option").notNull(),
  explanation: text("explanation").default(""),
  category: text("category").default("reciclaje"),
});

export const quizScores = sqliteTable("quiz_scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const recycleItems = sqliteTable("recycle_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  aliases: text("aliases").default("[]"),
  container: text("container").notNull(),
  containerColor: text("container_color").notNull(),
  explanation: text("explanation").default(""),
  tip: text("tip").default(""),
});

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id),
  type: text("type").notNull(),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).default(false),
  link: text("link"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});
