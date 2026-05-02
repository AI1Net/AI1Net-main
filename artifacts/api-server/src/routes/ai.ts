import { Router } from "express";
import { db, aiProvidersTable, aiToolsTable, aiUsageTable, tokenTransactionsTable, usersTable, rewardsTable } from "@workspace/db";
import { eq, count, sql, like, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getOrCreateUser } from "../lib/getOrCreateUser";
import { SubmitAIRequestBody, ListAIToolsQueryParams } from "@workspace/api-zod";

const router = Router();

const MOCK_OUTPUTS: Record<string, string[]> = {
  TEXT: [
    "Here is a comprehensive analysis based on your query. The key insights suggest that machine learning models continue to evolve rapidly, enabling more sophisticated natural language understanding. The implications for productivity are significant.",
    "Based on the input provided, I've identified three core themes: efficiency, scalability, and innovation. Each presents unique opportunities for optimization within your workflow.",
    "Synthesizing available data: The requested analysis reveals patterns consistent with emerging AI paradigms. Recommend cross-referencing with domain-specific datasets for validation.",
  ],
  CODE: [
    "```typescript\nfunction optimizeQuery(data: any[]) {\n  return data\n    .filter(item => item.active)\n    .sort((a, b) => b.score - a.score)\n    .slice(0, 10);\n}\n```",
    "```python\ndef process_batch(items, batch_size=32):\n    results = []\n    for i in range(0, len(items), batch_size):\n        batch = items[i:i+batch_size]\n        results.extend(model.predict(batch))\n    return results\n```",
  ],
  IMAGE: [
    "Image generated successfully. Resolution: 1024x1024. Style: photorealistic. The output has been processed and optimized for web delivery.",
    "Diffusion model output complete. Applied style transfer with 50 inference steps. Image dimensions: 512x512px.",
  ],
  VIDEO: [
    "Video synthesis initiated. 4 second clip at 24fps generated. Motion vectors computed. Post-processing applied.",
    "Video generation complete: 6 second render at 30fps. Temporal consistency maintained across all frames.",
  ],
  VOICE: [
    "Audio synthesis complete. Duration: 3.2 seconds. Sample rate: 44100Hz. Voice: Neural TTS v2.",
    "Voice output generated. Prosody optimized. SSML markup processed. Output: 2.8s @ 22050Hz.",
  ],
  MULTIMODAL: [
    "Multimodal analysis complete. Visual features extracted: 2048-dim embedding. Text alignment score: 0.94. Cross-modal attention applied.",
    "Combined vision-language processing complete. Object detection: 12 entities identified. Caption confidence: 98.2%.",
  ],
};

router.get("/providers", async (req, res) => {
  try {
    const providers = await db.select({
      id: aiProvidersTable.id,
      name: aiProvidersTable.name,
      description: aiProvidersTable.description,
      website: aiProvidersTable.website,
      toolCount: count(aiToolsTable.id),
    })
    .from(aiProvidersTable)
    .leftJoin(aiToolsTable, eq(aiToolsTable.providerId, aiProvidersTable.id))
    .groupBy(aiProvidersTable.id);

    res.json(providers);
  } catch (err) {
    req.log.error({ err }, "Failed to list providers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tools", async (req, res) => {
  try {
    const params = ListAIToolsQueryParams.parse({
      category: req.query.category,
      providerId: req.query.providerId,
      search: req.query.search,
    });

    const conditions = [];
    if (params.category) conditions.push(eq(aiToolsTable.category, params.category));
    if (params.providerId) conditions.push(eq(aiToolsTable.providerId, params.providerId));
    if (params.search) conditions.push(like(aiToolsTable.name, `%${params.search}%`));

    const tools = await db.select({
      id: aiToolsTable.id,
      name: aiToolsTable.name,
      slug: aiToolsTable.slug,
      description: aiToolsTable.description,
      category: aiToolsTable.category,
      providerId: aiToolsTable.providerId,
      providerName: aiProvidersTable.name,
      pricePerUse: aiToolsTable.pricePerUse,
      createdAt: aiToolsTable.createdAt,
    })
    .from(aiToolsTable)
    .innerJoin(aiProvidersTable, eq(aiProvidersTable.id, aiToolsTable.providerId))
    .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json(tools);
  } catch (err) {
    req.log.error({ err }, "Failed to list tools");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tools/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [tool] = await db.select({
      id: aiToolsTable.id,
      name: aiToolsTable.name,
      slug: aiToolsTable.slug,
      description: aiToolsTable.description,
      category: aiToolsTable.category,
      providerId: aiToolsTable.providerId,
      providerName: aiProvidersTable.name,
      pricePerUse: aiToolsTable.pricePerUse,
      createdAt: aiToolsTable.createdAt,
    })
    .from(aiToolsTable)
    .innerJoin(aiProvidersTable, eq(aiProvidersTable.id, aiToolsTable.providerId))
    .where(eq(aiToolsTable.slug, slug))
    .limit(1);

    if (!tool) {
      res.status(404).json({ error: "Tool not found" });
      return;
    }
    res.json(tool);
  } catch (err) {
    req.log.error({ err }, "Failed to get tool");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/request", requireAuth, async (req, res) => {
  try {
    const body = SubmitAIRequestBody.parse(req.body);
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const [tool] = await db.select()
      .from(aiToolsTable)
      .where(eq(aiToolsTable.slug, body.toolSlug))
      .limit(1);

    if (!tool) {
      res.status(404).json({ error: "Tool not found" });
      return;
    }

    if (user.tokenBalance < tool.pricePerUse) {
      res.status(402).json({ error: "Insufficient tokens" });
      return;
    }

    const outputs = MOCK_OUTPUTS[tool.category] ?? MOCK_OUTPUTS.TEXT;
    const output = outputs[Math.floor(Math.random() * outputs.length)];

    const [usage] = await db.insert(aiUsageTable).values({
      userId: user.id,
      toolId: tool.id,
      input: body.input,
      output,
      tokensUsed: tool.pricePerUse,
      status: "SUCCESS",
    }).returning();

    const newBalance = user.tokenBalance - tool.pricePerUse;
    await db.update(usersTable)
      .set({ tokenBalance: newBalance })
      .where(eq(usersTable.id, user.id));

    await db.insert(tokenTransactionsTable).values({
      userId: user.id,
      type: "SPEND",
      amount: tool.pricePerUse,
      metadata: `AI request to ${tool.name}`,
    });

    const rewardAmount = tool.pricePerUse * 0.1;
    await db.insert(rewardsTable).values({
      userId: user.id,
      type: "USAGE",
      amount: rewardAmount,
    });

    await db.update(usersTable)
      .set({ tokenBalance: newBalance + rewardAmount })
      .where(eq(usersTable.id, user.id));

    await db.insert(tokenTransactionsTable).values({
      userId: user.id,
      type: "REWARD",
      amount: rewardAmount,
      metadata: `Usage reward for ${tool.name}`,
    });

    res.json({
      usageId: usage.id,
      output,
      tokensUsed: tool.pricePerUse,
      remainingBalance: newBalance + rewardAmount,
      status: "SUCCESS",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit AI request");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
