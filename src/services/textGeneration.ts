import { TextGenerationOptions } from '@/types';

const TEXT_API_BASE_URL = import.meta.env.VITE_TEXT_API_BASE_URL;
const TEXT_API_KEY = import.meta.env.VITE_TEXT_API_KEY;

// Check if API is configured
const isAPIConfigured = (): boolean => {
  return !!(TEXT_API_BASE_URL && TEXT_API_KEY);
};

// Mock/fallback text generation templates
const generateMockCardText = (bookTitle: string, author?: string, index: number = 0): string => {
  const templates = [
    `A pivotal moment in ${bookTitle} reveals the complexity of human nature.`,
    `In ${bookTitle}, ${author || 'the author'} explores a timeless theme.`,
    `This book makes us think: what truly matters?`,
    `${bookTitle} takes us into a whole new world.`,
    `Characters face difficult choices that make us reflect on our own values.`,
    `${author || 'The author'}'s words are poetic and captivating.`,
    `This story reminds us that hope always exists.`,
    `Between the lines of ${bookTitle}, we find resonance.`,
    `This book challenges our understanding of the world.`,
    `${bookTitle} is a journey for the soul.`,
    `Every page is filled with wisdom and insight.`,
    `This story will stay with readers forever.`,
  ];
  
  return templates[index % templates.length];
};

const generateMockTwistText = (sourceText: string, index: number = 0): string => {
  const templates = [
    `But from another perspective: what lies beneath "${sourceText.substring(0, 20)}..."?`,
    `This reminds me of a completely opposite viewpoint...`,
    `Perhaps the truth is not so simple.`,
    `Think from a different angle: what if the opposite were true?`,
    `The opposing view is equally worth contemplating.`,
    `However, everything has two sides.`,
    `Let's challenge this assumption...`,
    `From a critical perspective...`,
  ];
  
  return templates[index % templates.length];
};

/**
 * Generate base card texts for a book
 * @param bookTitle - Title of the book
 * @param author - Author name (optional)
 * @param count - Number of cards to generate
 * @returns Promise<string[]> - Array of generated texts
 */
export async function generateBaseCardTextsForBook(
  bookTitle: string,
  author?: string,
  count: number = 12
): Promise<string[]> {
  // If API is configured, try to use it
  if (isAPIConfigured()) {
    try {
      const response = await fetch(`${TEXT_API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEXT_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Generate ${count} thoughtful, concise card texts about the book "${bookTitle}"${author ? ` by ${author}` : ''}. Each text should be a unique insight, quote, or reflection.`,
          count,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.texts || data.results || [];
      }
    } catch (error) {
      console.warn('Text API call failed, falling back to mock generation:', error);
    }
  }

  // Fallback to mock generation
  return Array.from({ length: count }, (_, i) => generateMockCardText(bookTitle, author, i));
}

/**
 * Generate twist card texts from a source text
 * @param sourceText - The source text to generate twists from
 * @param options - Generation options
 * @returns Promise<string[]> - Array of generated twist texts
 */
export async function generateTwistCardTextsFromSource(
  sourceText: string,
  options: TextGenerationOptions
): Promise<string[]> {
  const { prompt, count } = options;

  // If API is configured, try to use it
  if (isAPIConfigured()) {
    try {
      const response = await fetch(`${TEXT_API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEXT_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: prompt || `Generate ${count} alternative perspectives or contrasting ideas based on: "${sourceText}"`,
          count,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.texts || data.results || [];
      }
    } catch (error) {
      console.warn('Text API call failed, falling back to mock generation:', error);
    }
  }

  // Fallback to mock generation
  return Array.from({ length: count }, (_, i) => generateMockTwistText(sourceText, i));
}

/**
 * Generate a single card text
 * @param prompt - Custom prompt for generation
 * @returns Promise<string> - Generated text
 */
export async function generateSingleCardText(prompt: string): Promise<string> {
  if (isAPIConfigured()) {
    try {
      const response = await fetch(`${TEXT_API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEXT_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          count: 1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.texts?.[0] || data.results?.[0] || generateMockCardText('默认书籍', '作者', 0);
      }
    } catch (error) {
      console.warn('Text API call failed, falling back to mock generation:', error);
    }
  }

  // Fallback to mock generation
  return generateMockCardText('默认书籍', '作者', Math.floor(Math.random() * 12));
}

