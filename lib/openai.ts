import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface AutomationAnalysis {
  steps: {
    id: string;
    title: string;
    description: string;
    tools?: string[];
    complexity?: 'low' | 'medium' | 'high';
    // Adding Make-specific fields to match types.ts
    module?: string;
    version?: number;
    parameters?: Record<string, any>;
    mapper?: Record<string, any>;
    metadata?: {
      designer?: {
        x?: number;
        y?: number;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }[];
  recommendations: {
    platforms: string[];
    considerations: string[];
  };
}

export async function analyzeAutomation(prompt: string): Promise<AutomationAnalysis> {
  const systemPrompt = `You are an AI automation expert. Analyze the user's automation request and break it down into logical steps.
For each step provide:
- A clear title
- A detailed description
- Recommended tools/platforms
- Complexity level
- Appropriate module name (for Make.com integration, e.g. "rss:TriggerNewArticle" or "openai-gpt-3:CreateCompletion")

Also provide overall recommendations for:
- Best platforms to implement the automation
- Important considerations and potential challenges

Format the response as a structured JSON object with the following structure:
{
  "steps": [
    {
      "id": "step-1",
      "title": "Step title",
      "description": "Step description",
      "tools": ["Tool1", "Tool2"],
      "complexity": "low|medium|high",
      "module": "app:ModuleName",
      "version": 1,
      "parameters": {},
      "mapper": {}
    }
  ],
  "recommendations": {
    "platforms": ["Platform1", "Platform2"],
    "considerations": ["Consideration1", "Consideration2"]
  }
}`;

  try {
    console.log("Sending request to OpenAI with prompt:", prompt);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    console.log("OpenAI API response received:", completion);
    
    const content = completion.choices[0].message.content;
    
    if (!content) {
      console.error("Empty response content from OpenAI API");
      throw new Error("Empty response from OpenAI API");
    }

    // Parse the JSON content
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
     
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);

      throw new Error("Failed to parse JSON response from OpenAI API");
    }

    // Create a valid response object, with default values if needed
    const response: AutomationAnalysis = {
      steps: [],
      recommendations: {
        platforms: [],
        considerations: []
      }
    };

    // Process steps if they exist
    if (parsedContent.steps && Array.isArray(parsedContent.steps)) {
      response.steps = parsedContent.steps.map((step: any, index: number) => ({
        id: step.id || `step-${index + 1}`,
        title: step.title || `Step ${index + 1}`,
        description: step.description || "No description provided",
        tools: Array.isArray(step.tools) ? step.tools : [],
        complexity: step.complexity || "medium",
        // Add Make-specific fields
        module: step.module || "custom:Module",
        version: step.version || 1,
        parameters: step.parameters || {},
        mapper: step.mapper || {},
        metadata: {
          designer: {
            x: index * 300,
            y: 0,
            ...(step.metadata?.designer || {})
          },
          ...(step.metadata || {})
        }
      }));
    } else {
      // Create a default step if none exist
      response.steps = [{
        id: "step-1",
        title: "Analyze Requirements",
        description: `Analyze and plan automation for: "${prompt}"`,
        tools: ["Documentation tools"],
        complexity: "medium",
        module: "custom:AnalyzeRequirements",
        version: 1,
        parameters: {},
        mapper: {},
        metadata: {
          designer: {
            x: 0,
            y: 0
          }
        }
      }];
    }

    // Process recommendations if they exist
    if (parsedContent.recommendations) {
      if (parsedContent.recommendations.platforms && Array.isArray(parsedContent.recommendations.platforms)) {
        response.recommendations.platforms = parsedContent.recommendations.platforms;
      }
      
      if (parsedContent.recommendations.considerations && Array.isArray(parsedContent.recommendations.considerations)) {
        response.recommendations.considerations = parsedContent.recommendations.considerations;
      }
    }

    // If we got this far, we have a valid response
    console.log("Returning processed response:", response);
    return response;
    
  } catch (error) {
    console.error('Error in analyzeAutomation:', error);
    
    // If the error is from the OpenAI API, log more details
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
}