import { text, numeric, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	navn: text("name"),
	højde: numeric("height"),
	fdag: text("birthday"),
	fil: text("file"),
	farve: text("color"),
});