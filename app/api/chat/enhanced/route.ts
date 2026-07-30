import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { sql } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface EligibilityCheck {
  eligible: boolean;
  reason: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], context = {} } = body;

    if (!message || !message.trim()) {
      return errorResponse('INVALID_REQUEST', 'Message cannot be empty', 400);
    }

    // Build conversation history for Groq
    const formattedHistory = conversationHistory.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    formattedHistory.push({
      role: 'user',
      content: message,
    });

    // System prompt with context about Ethiopian Navigator
    const systemPrompt = `You are an intelligent AI assistant for the Ethiopian Navigator platform, a government service portal.
Your role is to:
1. Help citizens find and understand government services
2. Check service eligibility based on their information
3. Guide them through application processes
4. Provide helpful recommendations and next steps

When users mention services, check their eligibility based on their profile information.
Provide 2-3 actionable suggestions for next steps.
Be helpful, friendly, and professional.
When appropriate, suggest checking eligibility or starting an application.

Current user context: ${JSON.stringify(context)}`;

    // Call Groq API for intelligent response
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...formattedHistory,
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const assistantResponse = completion.choices[0]?.message?.content || 'I encountered an issue. Please try again.';

    // Extract service references from the message and check eligibility
    let eligibility: EligibilityCheck | undefined;
    const serviceKeywords = ['license', 'permit', 'passport', 'visa', 'certificate', 'tax', 'registration'];
    const messageText = message.toLowerCase();

    if (serviceKeywords.some(keyword => messageText.includes(keyword))) {
      eligibility = await checkServiceEligibility(message, context);
    }

    // Generate context-aware suggestions
    const suggestions = generateSuggestions(message, context);

    // Extract any new context from the response
    const newContext = extractContext(message, context);

    return successResponse({
      response: assistantResponse,
      suggestions,
      eligibility,
      context: newContext,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);

    if (error.message.includes('API key')) {
      return errorResponse('CONFIG_ERROR', 'AI service is not configured', 500);
    }

    return errorResponse('CHAT_ERROR', 'Failed to process message', 500);
  }
}

async function checkServiceEligibility(userMessage: string, context: any): Promise<EligibilityCheck> {
  try {
    // Query services to check eligibility criteria
    const services = await sql.unsafe(
      `SELECT id, name, eligibility_criteria, requirements 
       FROM services 
       WHERE LOWER(name) LIKE '%${userMessage.toLowerCase().split(' ')[0]}%'
       LIMIT 1`
    );

    if (services.length === 0) {
      return {
        eligible: true,
        reason: 'Unable to determine specific eligibility. Please check individual service requirements.',
      };
    }

    const service = services[0];
    const criteria = service.eligibility_criteria ? JSON.parse(service.eligibility_criteria) : {};

    // Check against user context
    let eligible = true;
    let failureReasons = [];

    if (criteria.minAge && context.age && context.age < criteria.minAge) {
      eligible = false;
      failureReasons.push(`Minimum age requirement: ${criteria.minAge} years`);
    }

    if (criteria.requiresResidency && context.residency !== 'ethiopia') {
      eligible = false;
      failureReasons.push('Must be a resident of Ethiopia');
    }

    if (criteria.requiredDocuments && context.documents) {
      const missingDocs = criteria.requiredDocuments.filter(
        (doc: string) => !context.documents.includes(doc)
      );
      if (missingDocs.length > 0) {
        eligible = false;
        failureReasons.push(`Missing documents: ${missingDocs.join(', ')}`);
      }
    }

    return {
      eligible,
      reason: eligible
        ? `You appear to meet the eligibility requirements for ${service.name}.`
        : `You may not be eligible due to: ${failureReasons.join('; ')}. Please verify your information.`,
    };
  } catch (error) {
    console.error('Eligibility check error:', error);
    return {
      eligible: true,
      reason: 'Unable to verify eligibility at this time. Please contact support.',
    };
  }
}

function generateSuggestions(userMessage: string, context: any): string[] {
  const suggestions: string[] = [];
  const messageLower = userMessage.toLowerCase();

  // Context-aware suggestions
  if (!context.userType && messageLower.includes('help')) {
    suggestions.push('Tell me your role (citizen/business/employee)');
  }

  if (messageLower.includes('apply') || messageLower.includes('application')) {
    suggestions.push('Start a new application');
    suggestions.push('Track existing application');
  }

  if (messageLower.includes('document') || messageLower.includes('requirement')) {
    suggestions.push('See required documents');
    suggestions.push('Upload documents');
  }

  if (messageLower.includes('status') || messageLower.includes('check')) {
    suggestions.push('View my applications');
    suggestions.push('Check service status');
  }

  if (suggestions.length < 2) {
    suggestions.push('Browse all services');
    suggestions.push('Contact support');
  }

  return suggestions.slice(0, 3);
}

function extractContext(userMessage: string, currentContext: any): any {
  const newContext = { ...currentContext };
  const messageLower = userMessage.toLowerCase();

  // Extract age if mentioned
  const ageMatch = userMessage.match(/(\d+)\s*(?:years?|years old|old|yo)/i);
  if (ageMatch) {
    newContext.age = parseInt(ageMatch[1]);
  }

  // Extract user type
  if (messageLower.includes('i am a citizen') || messageLower.includes('citizen')) {
    newContext.userType = 'citizen';
  } else if (messageLower.includes('i am a business') || messageLower.includes('business')) {
    newContext.userType = 'business';
  } else if (messageLower.includes('i am an employee') || messageLower.includes('employee')) {
    newContext.userType = 'employee';
  }

  return Object.keys(newContext).length > Object.keys(currentContext).length ? newContext : {};
}
