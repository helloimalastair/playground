import { z } from "zod";
import { Hono } from "hono";
import { orm } from "./drizzle";
import { users } from "./schema";
import { zValidator, } from "@hono/zod-validator";

const app = new Hono();

app.get("/", () => new Response(Bun.file("./src/index.html").stream(), {
	headers: {
		"content-type": "text/html; charset=utf-8"
	}
}));

app.get("/api/user", async c => {
	try {
		const body = await orm.select().from(users).execute();
		return c.json({ success: true, body });
	} catch (e: any) {
		return c.json({ success: false, error: e.message });
	}
});

app.post("/api/user", zValidator("form", z.object({
	navn: z.string(),
	højde: z.string({
		invalid_type_error: "Højde skal være et tal",
	}).regex(/\d+/),
	fdag: z.string().regex(/\d{4}-\d{2}-\d{2}/),
	fil: z.string(),
	farve: z.string().regex(/#[0-9a-fA-F]{6}/),
}), (body, c) => {
	if (!body.success) {
		c.status(400);
		return c.json({ error: body.error });
	}
}), async c => {
	const body = c.req.valid("form");
	await orm.insert(users).values(body).execute();
	return c.json({ success: true, body });
});

export default {
	fetch: app.fetch,
	port: 80
};