const axios = require('axios');

// Azure OpenAI Configuration
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || 'https://your-resource.openai.azure.com/';
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_DEPLOYMENT_NAME = process.env.AZURE_DEPLOYMENT_NAME || 'gpt-35-turbo';
const AZURE_API_VERSION = '2024-02-15-preview';

// System prompt for Ethiopian government service assistant
const SYSTEM_PROMPT = `You are an expert assistant for the Ethiopian Navigator government services platform. You help citizens find information about government services, understand requirements, check processing times, and track their applications.

Key information:
- Services available: Health Insurance, Business License, Passport, Land Registration, Scholarships, Marriage Certificate, Tax ID, Driving License, Import/Export License
- Languages supported: English, Amharic, Oromo
- Processing times vary (1-30 days depending on service)
- Citizens can submit service requests online and track status

Be helpful, clear, and guide users to the right services. If unsure, direct them to contact support.`;

class ChatbotService {
  /**
   * Send message to Azure OpenAI and get response
   */
  async getAIResponse(userMessage, conversationHistory = [], language = 'en') {
    try {
      // Build messages array for conversation
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      // Call Azure OpenAI
      const response = await axios.post(
        `${AZURE_OPENAI_ENDPOINT}openai/deployments/${AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${AZURE_API_VERSION}`,
        {
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'api-key': AZURE_OPENAI_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: response.data.choices[0].message.content,
        tokens: {
          prompt: response.data.usage.prompt_tokens,
          completion: response.data.usage.completion_tokens,
          total: response.data.usage.total_tokens
        }
      };
    } catch (error) {
      console.error('Azure OpenAI Error:', error.message);
      return {
        success: false,
        message: this.getFallbackResponse(userMessage, language),
        error: error.message
      };
    }
  }

  /**
   * Get fallback response if Azure OpenAI is unavailable
   */
  getFallbackResponse(userMessage, language = 'en') {
    const responses = {
      en: {
        services: 'We offer various government services including Health Insurance Registration, Business License, Passport Application, Land Registration, University Scholarship, Marriage Certificate, Tax ID Registration, Driving License, and Import/Export License.',
        requirements: 'Requirements vary by service. Generally, you\'ll need a valid ID, proof of residence, and service-specific documents. Please select a service to see specific requirements.',
        processing: 'Processing times range from 1-30 days depending on the service. Most common services take 3-10 business days.',
        status: 'To check your application status, please visit your dashboard and enter your tracking number.',
        cost: 'Most services are free or cost between 50-2,500 Ethiopian Birr. Some services like Health Insurance and Scholarships are completely free.',
        default: 'That\'s a great question! Could you provide more details? I\'m here to help with information about government services.'
      },
      am: {
        services: 'የገዠመ ሴቪሶች ብዙ አላቸው:  ጤና 保ἡሞ ሃቦ ቅጂዎ ሙ ዝርዝር ሥራአቄ  ፓስፖርት ምልክያ ይአሞ ነተሳ ምዴበ ትክክለኞ ግዙ ድህነት  ወወዎስ...',
        requirements: 'ስልጣን በእያንዎ ሴቪስ ይለያል ። በአጠቃላይ ቅጁ ID ፣ የመኖሪያ ማረጋገጫ እና ሴቪስ-ተለይ ሰነዶች ያስፈልግዎት።',
        processing: 'የሂደትን ጊዜ ከ1-30 ቀናት ይደርሳል ። በአብዛኛው ሴቪሶች 3-10 ሥራ ቀናት ይወስዳል።',
        status: 'የእርስዎ ትግበራ ሁኔታ ለመመርመር ዳሾቦርድዎን ጎብኙ።',
        cost: 'አብዛኛው ሴቪሶች ነጻ ወይም 50-2,500 ኢትዮጵያን ብር ያስወግዳል።',
        default: 'ታላቅ ጥያቄ! በደንብ ማስረጃ ሴቪስ ስለ ተጠይቋል።'
      },
      om: {
        services: 'Tajaajilaan mootummaa hedduu qabna: Dhaabbii Fayyaa, Lakkii Daldalaa, Pasaporticha, Giddu Lafaa, Scholarship, fi kan biraa.',
        requirements: 'Fedhiin tajaajila kamiitaan irraa addaa dha. Waanti gemeellaa ID, ragaa jireenyaa, fi walaloo tajaajila-addaa barbaadduu danda\'uu.',
        processing: 'Yeroon itti fufinsaa 1-30 guyyaa irra gidduu. Tajaajilaan hedduun 3-10 guyyaa hojii fudhataa.',
        status: 'Haala arfii kee sakattaabachuuf daashboord kee gangalchi.',
        cost: 'Tajaajilaan hedduun bilisa yookiin Birra Itiyoophiyaa 50-2,500 walqabataa.',
        default: 'Gaaffii guddaa! Maaloo xustuuqaa dabalata siif gaaffii gidduutti tajaajila irraa deebii.'
      }
    };

    const messageType = this.classifyMessage(userMessage);
    const langResponses = responses[language] || responses.en;
    
    return langResponses[messageType] || langResponses.default;
  }

  /**
   * Classify user message to appropriate response category
   */
  classifyMessage(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.match(/(service|available|offer)/i)) {
      return 'services';
    }
    if (lowerMessage.match(/(require|document|need)/i)) {
      return 'requirements';
    }
    if (lowerMessage.match(/(time|process|long|take)/i)) {
      return 'processing';
    }
    if (lowerMessage.match(/(status|check|track)/i)) {
      return 'status';
    }
    if (lowerMessage.match(/(cost|price|fee|free)/i)) {
      return 'cost';
    }

    return 'default';
  }

  /**
   * Get service information by name
   */
  async getServiceInfo(serviceName) {
    const services = {
      'health-insurance': {
        name: 'Health Insurance Registration',
        description: 'Register for national health insurance coverage',
        processingTime: '3-5 business days',
        cost: 0,
        requirements: ['Valid ID', 'Proof of residence', 'Employment letter', 'Income statement']
      },
      'business-license': {
        name: 'Business License',
        description: 'Register a new business and obtain business license',
        processingTime: '5-7 business days',
        cost: 500,
        requirements: ['Business registration', 'Tax ID', 'Bank statements', 'Business plan']
      },
      'passport': {
        name: 'Passport Application',
        description: 'Apply for or renew Ethiopian passport',
        processingTime: '10 business days',
        cost: 1000,
        requirements: ['Birth certificate', 'ID card', 'Passport photos', 'Citizenship proof']
      }
      // Add more services as needed
    };

    return services[serviceName.toLowerCase()] || null;
  }

  /**
   * Translate message to specified language
   */
  async translateMessage(message, targetLanguage) {
    // In production, this would use Azure Translator service
    // For now, return the message as-is
    // Implementation would depend on Azure Translator cognitive service
    return message;
  }

  /**
   * Log conversation for analytics
   */
  async logConversation(userId, messages, language) {
    try {
      // Log to database for analytics and training
      console.log(`[CHATBOT] User: ${userId}, Language: ${language}, Messages: ${messages.length}`);
      
      // In production, save to database
      // await database.collection('chatbot_logs').insertOne({
      //   userId,
      //   messages,
      //   language,
      //   timestamp: new Date()
      // });
    } catch (error) {
      console.error('Error logging conversation:', error);
    }
  }

  /**
   * Get suggestion based on context
   */
  getSuggestions(context) {
    const suggestions = {
      onboarding: [
        'What services are available?',
        'How do I start a business?',
        'Where can I get a passport?'
      ],
      tracking: [
        'Where can I track my application?',
        'How long will it take?',
        'What should I do next?'
      ],
      general: [
        'Tell me about Health Insurance',
        'What are the requirements?',
        'How much will it cost?'
      ]
    };

    return suggestions[context] || suggestions.general;
  }
}

module.exports = new ChatbotService();
