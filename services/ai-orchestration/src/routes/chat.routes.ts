// File: services/ai-orchestration/src/routes/chat.routes.ts
// Purpose: Chat and conversation endpoints

import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../../libs/logging/logger';
import { connectionPool } from '../../../libs/database/connection-pool';
import { AuthenticatedRequest } from '../../../services/user-service/src/middleware/auth.middleware';

const router = Router();

// POST /api/chat/sessions - Create chat session
router.post('/sessions', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sessionId = uuidv4();

    await connectionPool.executeQuery(
      `INSERT INTO ai_service.chat_sessions 
       (id, user_id, status, created_at)
       VALUES ($1, $2, $3, $4)`,
      [sessionId, req.userId, 'active', new Date()],
      'ai-orchestration'
    );

    logger.info('Chat session created', { sessionId, userId: req.userId });

    res.status(201).json({
      session_id: sessionId,
      user_id: req.userId,
      created_at: new Date(),
    });
  } catch (error) {
    logger.error('Failed to create session', error as Error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/chat/sessions/:id - Get session
router.get('/sessions/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const session = await connectionPool.executeQuery<any>(
      `SELECT * FROM ai_service.chat_sessions WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.userId],
      'ai-orchestration'
    );

    if (session.length === 0) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const messages = await connectionPool.executeQuery<any>(
      `SELECT role, content, created_at FROM ai_service.chat_messages 
       WHERE session_id = $1 
       ORDER BY created_at ASC`,
      [req.params.id],
      'ai-orchestration'
    );

    res.json({
      session: session[0],
      messages,
    });
  } catch (error) {
    logger.error('Failed to get session', error as Error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/chat/sessions/:id/messages - Send message
router.post('/sessions/:id/messages', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message required' });
      return;
    }

    // Verify session ownership
    const session = await connectionPool.executeQuery<any>(
      `SELECT * FROM ai_service.chat_sessions WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.userId],
      'ai-orchestration'
    );

    if (session.length === 0) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    // TODO: Integrate with Groq API
    // For now, return a placeholder response
    const aiResponse = 'I understand you asked: ' + message;

    // Save user message
    await connectionPool.executeQuery(
      `INSERT INTO ai_service.chat_messages 
       (id, session_id, user_id, role, content, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), req.params.id, req.userId, 'user', message, new Date()],
      'ai-orchestration'
    );

    // Save AI response
    await connectionPool.executeQuery(
      `INSERT INTO ai_service.chat_messages 
       (id, session_id, user_id, role, content, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), req.params.id, req.userId, 'assistant', aiResponse, new Date()],
      'ai-orchestration'
    );

    logger.info('Message processed', { sessionId: req.params.id });

    res.json({
      user_message: message,
      ai_response: aiResponse,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Failed to process message', error as Error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export { router as chatRoutes };
