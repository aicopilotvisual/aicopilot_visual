export interface AutomationStep {
  id: string;
  title: string;
  description: string;
  tools?: string[];
  complexity?: 'low' | 'medium' | 'high';
  // Additional fields needed for Make export
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
}



// export interface AutomationStep {
//   id: string;
//   title: string;
//   description: string;
//   tools?: string[];
//   complexity?: 'low' | 'medium' | 'high';
//   // Make integration fields
//   module?: string; // Format like "rss:TriggerNewArticle" or "openai-gpt-3:CreateCompletion"
//   version?: number;
//   parameters?: Record<string, any>;
//   mapper?: Record<string, any>;
//   metadata?: {
//     designer?: {
//       x?: number;
//       y?: number;
//       [key: string]: any;
//     };
//     restore?: Record<string, any>;
//     parameters?: Array<Record<string, any>>;
//     expect?: Array<Record<string, any>>;
//     interface?: Array<Record<string, any>>;
//     [key: string]: any;
//   };
// }