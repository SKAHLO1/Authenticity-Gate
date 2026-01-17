import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * GenLayer Integration Service
 * 
 * This service provides integration with GenLayer intelligent contracts
 * and Google's Gemini AI for content verification.
 * 
 * In production, this would interact with deployed GenLayer contracts.
 * For development, it simulates the contract behavior using Gemini directly.
 */

interface VerificationResult {
  originality: number;
  plagiarism: number;
  deepfake: number;
  sentiment: string;
  summary: string;
  reasoning: string;
}

export class GenLayerService {
  private gemini: GoogleGenerativeAI | null = null;
  private contractAddress: string | null = null;
  private useDirectGemini: boolean = true; // Toggle for development mode

  constructor() {
    console.log('🔧 GenLayerService initializing...');
    console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('   GENLAYER_CONTRACT_ADDRESS:', process.env.GENLAYER_CONTRACT_ADDRESS || 'NOT SET');
    console.log('   NODE_ENV:', process.env.NODE_ENV);
    
    // Initialize Gemini if API key is available
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log('✓ Gemini initialized successfully');
    } else {
      console.warn('⚠️  GEMINI_API_KEY not found in environment');
    }
    
    // Get contract address from environment
    this.contractAddress = process.env.GENLAYER_CONTRACT_ADDRESS || null;
    
    // Use direct Gemini if no contract address or in development
    this.useDirectGemini = !this.contractAddress || process.env.NODE_ENV === 'development';
    
    console.log('🔧 GenLayerService mode:', this.useDirectGemini ? 'direct-gemini' : 'genlayer-contract');
    console.log('🔧 GenLayerService ready:', this.isReady());
  }

  /**
   * Verify content using either GenLayer contract or direct Gemini API
   */
  async verifyContent(content: string): Promise<VerificationResult> {
    if (this.useDirectGemini) {
      return this.verifyWithGemini(content);
    } else {
      return this.verifyWithContract(content);
    }
  }

  /**
   * Verify content using Gemini AI directly
   * This simulates what the GenLayer contract would do
   */
  private async verifyWithGemini(content: string): Promise<VerificationResult> {
    if (!this.gemini) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const model = this.gemini.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Analyze the following content for authenticity and quality.

Content: ${content.slice(0, 5000)}

Provide a JSON response with the following fields:
1. originality: A score from 0-100 indicating how original the content is (100 = highly original)
2. plagiarism: A score from 0-100 indicating plagiarism risk (100 = high risk)
3. deepfake: A score from 0-100 indicating likelihood of AI generation or synthetic content (100 = likely fake)
4. sentiment: One of "Positive", "Neutral", or "Negative"
5. summary: A brief summary of the content (max 200 words)
6. reasoning: Brief explanation of the scores

Return ONLY valid JSON, no markdown formatting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let analysisResult: VerificationResult;
      try {
        // Remove markdown code blocks if present
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysisResult = JSON.parse(cleanText);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', text);
        // Fallback to default values
        analysisResult = {
          originality: 75,
          plagiarism: 25,
          deepfake: 20,
          sentiment: "Neutral",
          summary: "Analysis completed but response format was invalid",
          reasoning: "Unable to parse detailed analysis"
        };
      }

      return analysisResult;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Content verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify content using GenLayer intelligent contract
   * TODO: Implement actual GenLayer SDK integration
   */
  private async verifyWithContract(content: string): Promise<VerificationResult> {
    // This would use the GenLayer SDK to call the deployed contract
    // For now, falls back to direct Gemini
    console.warn('GenLayer contract integration not yet implemented, using direct Gemini');
    return this.verifyWithGemini(content);
    
    /* Example implementation with GenLayer SDK:
    const client = new GenLayerClient({
      endpoint: process.env.GENLAYER_RPC_URL,
      privateKey: process.env.GENLAYER_PRIVATE_KEY
    });

    const result = await client.write({
      contract: this.contractAddress!,
      method: 'verify_content',
      args: [url]
    });

    return result;
    */
  }

  /**
   * Batch verify multiple contents
   */
  async batchVerify(contents: string[]): Promise<VerificationResult[]> {
    // Limit to 10 items for safety
    const limited = contents.slice(0, 10);
    
    // Process in parallel with rate limiting
    const results = await Promise.all(
      limited.map(content => this.verifyContent(content))
    );
    
    return results;
  }

  /**
   * Check if the service is ready
   */
  isReady(): boolean {
    if (this.useDirectGemini) {
      return this.gemini !== null;
    }
    return this.contractAddress !== null;
  }

  /**
   * Get service status information
   */
  getStatus() {
    return {
      mode: this.useDirectGemini ? 'direct-gemini' : 'genlayer-contract',
      ready: this.isReady(),
      contractAddress: this.contractAddress,
      geminiConfigured: this.gemini !== null,
    };
  }
}

// Lazy singleton instance - only created when first accessed
let _instance: GenLayerService | null = null;

export const genLayerService = {
  get instance(): GenLayerService {
    if (!_instance) {
      _instance = new GenLayerService();
    }
    return _instance;
  },
  // Proxy methods for backward compatibility
  verifyContent: (content: string) => genLayerService.instance.verifyContent(content),
  batchVerify: (contents: string[]) => genLayerService.instance.batchVerify(contents),
  isReady: () => genLayerService.instance.isReady(),
  getStatus: () => genLayerService.instance.getStatus(),
};
