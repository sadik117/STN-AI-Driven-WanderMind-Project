import { Request, Response, NextFunction } from 'express';
import { openai } from '../lib/openai';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

// ─── 1. AI ITINERARY BUILDER ────────────────────────────────────────────────
const itinerarySchema = z.object({
  destination: z.string().min(1),
  days: z.number().min(1).max(30),
  budget: z.number().optional(),
  travelStyle: z.string(),
  interests: z.array(z.string()).optional(),
});

export const generateItinerary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = itinerarySchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400);

    const { destination, days, budget, travelStyle, interests } = parsed.data;

    const prompt = `You are an expert travel planner. Create a detailed ${days}-day itinerary for ${destination}.
Travel style: ${travelStyle}
Budget: ${budget ? `$${budget} USD total` : 'flexible'}
Interests: ${interests?.join(', ') || 'general sightseeing'}

Return ONLY valid JSON in this exact format:
{
  "title": "string",
  "summary": "string (2-3 sentences)",
  "totalEstimatedCost": number,
  "currency": "USD",
  "days": [
    {
      "day": number,
      "theme": "string",
      "activities": [
        {
          "time": "HH:MM",
          "place": "string",
          "description": "string",
          "duration": "string",
          "estimatedCost": number,
          "tip": "string",
          "category": "food|culture|adventure|nature|shopping|transport"
        }
      ]
    }
  ],
  "packingTips": ["string"],
  "bestTimeToVisit": "string",
  "localPhrases": [{"phrase": "string", "meaning": "string"}]
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_BASE_URL?.includes('openrouter') ? 'openai/gpt-4o-mini' : 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) return sendError(res, 'AI failed to generate itinerary', 500);

    const itineraryPlan = JSON.parse(content);

    // Save to DB if user authenticated
    if (req.user) {
      await prisma.itinerary.create({
        data: {
          userId: req.user.id,
          title: itineraryPlan.title || `Trip to ${destination}`,
          days,
          budget: budget || null,
          travelStyle,
          planJson: itineraryPlan,
          aiGenerated: true,
        },
      });
    }

    sendSuccess(res, itineraryPlan, 'Itinerary generated successfully');
  } catch (err) {
    next(err);
  }
};

// ─── 2. AI DESTINATION DISCOVERY CHATBOT ───────────────────────────────────
const chatSchema = z.object({
  message: z.string().min(1),
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })).optional().default([]),
});

export const chatWithDestinationBot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400);

    const { message, history } = parsed.data;

    // Get top destinations as context
    const destinations = await prisma.destination.findMany({
      select: { name: true, country: true, continent: true, avgCostPerDay: true, climate: true, tags: true, rating: true, bestMonths: true },
      orderBy: { rating: 'desc' },
      take: 30,
    });

    const destContext = destinations.map(d =>
      `${d.name}, ${d.country} (${d.continent}) — $${d.avgCostPerDay}/day, Climate: ${d.climate}, Best months: ${d.bestMonths.join(', ')}, Tags: ${d.tags.join(', ')}, Rating: ${d.rating}`
    ).join('\n');

    const systemPrompt = `You are WanderMind's friendly AI travel assistant. Help users discover perfect destinations and plan trips.

Available destinations in our database:
${destContext}

Guidelines:
- Recommend destinations from our database when possible
- Be conversational, enthusiastic, and knowledgeable
- When recommending, always mention: best time to visit, avg daily cost, and 2-3 highlights
- If asked for recommendations, return a JSON block with this structure inside your response:
  <recommendations>{"destinations": [{"name": "...", "country": "...", "reason": "...", "avgCostPerDay": 0, "bestFor": "..."}]}</recommendations>
- Always end with a follow-up question to refine recommendations`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_BASE_URL?.includes('openrouter') ? 'openai/gpt-4o-mini' : 'gpt-4o-mini',
      messages,
      temperature: 0.8,
      max_tokens: 1000,
    });

    const reply = completion.choices[0].message.content || 'I could not generate a response.';
    sendSuccess(res, { reply }, 'Chat response');
  } catch (err) {
    next(err);
  }
};

// ─── 3. AI PACKING LIST GENERATOR ───────────────────────────────────────────
const packingSchema = z.object({
  destination: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  activities: z.array(z.string()).optional().default([]),
  tripType: z.string(),
});

export const generatePackingList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = packingSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400);

    const { destination, startDate, endDate, activities, tripType } = parsed.data;

    const prompt = `Create a comprehensive packing list for a trip to ${destination}.
Trip type: ${tripType}
${startDate && endDate ? `Dates: ${startDate} to ${endDate}` : ''}
Planned activities: ${activities.join(', ') || 'general sightseeing'}

Return ONLY valid JSON:
{
  "destination": "string",
  "totalItems": number,
  "categories": [
    {
      "name": "string",
      "icon": "emoji",
      "items": [
        {"name": "string", "essential": boolean, "quantity": "string"}
      ]
    }
  ],
  "weatherNote": "string",
  "importantReminders": ["string"]
}

Categories should include: Clothing, Documents & Money, Toiletries, Electronics, Health & Safety, Snacks & Extras`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_BASE_URL?.includes('openrouter') ? 'openai/gpt-4o-mini' : 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const content = completion.choices[0].message.content;
    if (!content) return sendError(res, 'Failed to generate packing list', 500);

    const packingList = JSON.parse(content);

    // Save to DB if user authenticated
    if (req.user) {
      await prisma.packingList.create({
        data: {
          userId: req.user.id,
          destination,
          tripType,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          itemsJson: packingList.categories,
        },
      });
    }

    sendSuccess(res, packingList, 'Packing list generated');
  } catch (err) {
    next(err);
  }
};

// ─── 4. AI BUDGET ANALYZER ──────────────────────────────────────────────────
const budgetSchema = z.object({
  destination: z.string().min(1),
  days: z.number().min(1),
  travelStyle: z.string(),
  groupSize: z.number().min(1).default(1),
  totalBudget: z.number().optional(),
});

export const analyzeBudget = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = budgetSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400);

    const { destination, days, travelStyle, groupSize, totalBudget } = parsed.data;

    const prompt = `Analyze travel budget for ${destination} — ${days} days, ${groupSize} person(s), ${travelStyle} style.
${totalBudget ? `User's total budget: $${totalBudget} USD` : ''}

Return ONLY valid JSON:
{
  "destination": "string",
  "days": number,
  "groupSize": number,
  "currency": "USD",
  "estimatedTotal": number,
  "perPersonPerDay": number,
  "breakdown": {
    "accommodation": number,
    "food": number,
    "transport": number,
    "activities": number,
    "shopping": number,
    "misc": number
  },
  "budgetScore": number (0-100, 100 = very affordable),
  "budgetLabel": "Budget|Moderate|Comfortable|Luxury",
  "savingTips": ["string"],
  "splurgeWorthy": ["string"],
  "budgetVsEstimate": "under|on_track|over|not_provided"
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_BASE_URL?.includes('openrouter') ? 'openai/gpt-4o-mini' : 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    const content = completion.choices[0].message.content;
    if (!content) return sendError(res, 'Failed to analyze budget', 500);

    sendSuccess(res, JSON.parse(content), 'Budget analysis complete');
  } catch (err) {
    next(err);
  }
};

// ─── 5. AI JOURNAL SUMMARIZER ───────────────────────────────────────────────
const journalSchema = z.object({
  rawNotes: z.string().min(10, 'Please write at least a few sentences'),
  destination: z.string().min(1),
  travelDate: z.string(),
});

export const summarizeJournal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = journalSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, parsed.error.issues[0].message, 400);

    const { rawNotes, destination, travelDate } = parsed.data;

    const prompt = `Transform these raw travel notes into a polished, engaging travel journal entry.

Destination: ${destination}
Date: ${travelDate}
Raw Notes: ${rawNotes}

Return ONLY valid JSON:
{
  "title": "string (creative, engaging title)",
  "summary": "string (3-4 polished paragraphs, vivid and personal)",
  "highlights": ["string (top 3-5 memorable moments)"],
  "mood": "adventurous|relaxed|cultural|foodie|romantic|family",
  "hashtags": ["string (8-10 relevant hashtags with #)"],
  "quote": "string (an inspiring travel quote that fits this trip)",
  "rating": number (1-5, based on how the notes sound)
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_BASE_URL?.includes('openrouter') ? 'openai/gpt-4o-mini' : 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;
    if (!content) return sendError(res, 'Failed to summarize journal', 500);

    const summary = JSON.parse(content);

    // Save to DB
    if (req.user) {
      await prisma.journalEntry.create({
        data: {
          userId: req.user.id,
          title: summary.title,
          rawNotes,
          aiSummary: summary.summary,
          highlights: summary.highlights,
          hashtags: summary.hashtags,
          destination,
          travelDate: new Date(travelDate),
        },
      });
    }

    sendSuccess(res, summary, 'Journal summarized successfully');
  } catch (err) {
    next(err);
  }
};
