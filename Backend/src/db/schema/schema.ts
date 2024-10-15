import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Tabela de Usuários
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()), // Identificador único do usuário
  firstName: text("first_name").notNull(), // Nome
  lastName: text("last_name").notNull(), // Sobrenome
  email: text("email").notNull().unique(), // E-mail único para login
  password: text("password").notNull(), // Senha criptografada
  isActive: boolean("is_active").default(true).notNull(), // Status do usuário (ativo/inativo)
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), // Data de criação da conta
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(), // Data da última atualização
});

// Tabela de Metas
export const goals = pgTable("goals", {
  id: text("id").primaryKey().$defaultFn(() => createId()), // Identificador único da meta
  userId: text("user_id").references(() => users.id).notNull(), // Referência ao usuário dono da meta
  title: text("title").notNull(), // Título da meta
  desiredWeeklyFrequency: integer("desired_weekly_frequency").notNull(), // Frequência semanal desejada
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), // Data de criação da meta
});

// Tabela de Conclusão de Metas
export const goalCompletions = pgTable("goal_completions", {
  id: text("id").primaryKey().$defaultFn(() => createId()), // Identificador único da conclusão
  goalId: text("goal_id").references(() => goals.id).notNull(), // Referência à meta
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), // Data da conclusão
});
