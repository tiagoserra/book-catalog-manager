import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { books } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Book routes
  app.get("/api/book", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const userBooks = await db
      .select()
      .from(books)
      .where(eq(books.userId, req.user.id));
    res.json(userBooks);
  });

  app.get("/api/book/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, parseInt(req.params.id)))
      .limit(1);

    if (!book || book.userId !== req.user.id) {
      return res.status(404).send("Book not found");
    }

    res.json(book);
  });

  app.post("/api/book", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const [book] = await db
      .insert(books)
      .values({ ...req.body, userId: req.user.id })
      .returning();

    res.json(book);
  });

  app.put("/api/book/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const [existingBook] = await db
      .select()
      .from(books)
      .where(eq(books.id, parseInt(req.params.id)))
      .limit(1);

    if (!existingBook || existingBook.userId !== req.user.id) {
      return res.status(404).send("Book not found");
    }

    const [updatedBook] = await db
      .update(books)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(books.id, parseInt(req.params.id)))
      .returning();

    res.json(updatedBook);
  });

  app.delete("/api/book/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const [existingBook] = await db
      .select()
      .from(books)
      .where(eq(books.id, parseInt(req.params.id)))
      .limit(1);

    if (!existingBook || existingBook.userId !== req.user.id) {
      return res.status(404).send("Book not found");
    }

    await db.delete(books).where(eq(books.id, parseInt(req.params.id)));

    res.json({ message: "Book deleted successfully" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
