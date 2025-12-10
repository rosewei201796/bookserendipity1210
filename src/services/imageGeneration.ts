import { ImageGenerationOptions } from '@/types';

const IMAGE_API_BASE_URL = import.meta.env.VITE_IMAGE_API_BASE_URL;
const IMAGE_API_KEY = import.meta.env.VITE_IMAGE_API_KEY;

// Check if API is configured
const isAPIConfigured = (): boolean => {
  return !!(IMAGE_API_BASE_URL && IMAGE_API_KEY);
};

// Mock image URLs using placeholder services
const generateMockImageUrl = (prompt: string, _style?: string): string => {
  // Use a deterministic hash of the prompt to get consistent images for same prompts
  const hash = prompt.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const index = Math.abs(hash) % 1000;
  
  // Using picsum.photos for placeholder images
  return `https://picsum.photos/seed/${index}/400/600`;
};

/**
 * Generate an image URL based on a text prompt
 * @param options - Image generation options
 * @returns Promise<string> - URL of the generated image
 */
export async function generateImageFromPrompt(
  options: ImageGenerationOptions
): Promise<string> {
  const { prompt, style } = options;

  // If API is configured, try to use it
  if (isAPIConfigured()) {
    try {
      const response = await fetch(`${IMAGE_API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${IMAGE_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          style,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl || data.url || generateMockImageUrl(prompt, style);
      }
    } catch (error) {
      console.warn('Image API call failed, falling back to mock generation:', error);
    }
  }

  // Fallback to mock generation
  return generateMockImageUrl(prompt, style);
}

/**
 * Generate image for a book card
 * @param bookTitle - Title of the book
 * @param cardText - Text content of the card
 * @returns Promise<string> - URL of the generated image
 */
export async function generateImageForCard(
  bookTitle: string,
  cardText: string
): Promise<string> {
  const prompt = `Book cover style illustration for "${bookTitle}": ${cardText.substring(0, 100)}`;
  return generateImageFromPrompt({ prompt, style: 'book-illustration' });
}

/**
 * Generate multiple images in parallel
 * @param prompts - Array of prompts
 * @returns Promise<string[]> - Array of image URLs
 */
export async function generateMultipleImages(
  prompts: string[]
): Promise<string[]> {
  return Promise.all(
    prompts.map(prompt => generateImageFromPrompt({ prompt }))
  );
}

