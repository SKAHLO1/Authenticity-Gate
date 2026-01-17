# { "Depends": "py-genlayer:test" }
from genlayer import *

class ContentVerification(gl.Contract):
    """
    Intelligent Contract for Content Authenticity Verification
    Uses GenLayer's AI consensus to analyze content
    """
    
    # State variables - using simple types
    next_id: u256
    
    def __init__(self):
        self.next_id = 1
    
    @gl.public.write
    def verify_content(self, url: str) -> dict:
        """
        Verify content from a URL using AI through GenLayer consensus
        """
        
        def analyze_web_content():
            # Fetch content from URL
            web_data = gl.get_webpage(url, mode='text')
            
            # Limit content to prevent token overflow
            content = web_data[:8000] if len(web_data) > 8000 else web_data
            
            # Use LLM to analyze content via GenLayer
            prompt = f"""You are an expert content analyzer. Analyze the following web content for authenticity, originality, and quality.

CONTENT TO ANALYZE:
{content}

ANALYSIS REQUIREMENTS:
1. Originality Score (0-100): How original is this content? 100 = highly original, unique content. 0 = completely copied/duplicated.
2. Plagiarism Risk (0-100): Likelihood that this content is plagiarized. 100 = high risk of plagiarism. 0 = no plagiarism detected.
3. AI Generation Confidence (0-100): Probability that this content was AI-generated or synthetic. 100 = definitely AI-generated. 0 = definitely human-written.
4. Sentiment: Overall emotional tone - must be exactly one of: "Positive", "Neutral", or "Negative"
5. Summary: A concise 2-3 sentence summary of the main content
6. Reasoning: Brief explanation (2-3 sentences) of why you gave these scores

IMPORTANT: Respond with ONLY a valid JSON object, no markdown formatting, no code blocks. Use this exact format:
{{"originality": <number>, "plagiarism": <number>, "deepfake": <number>, "sentiment": "<string>", "summary": "<string>", "reasoning": "<string>"}}"""
            
            # Execute LLM analysis
            analysis_result = gl.exec_llm(prompt)
            
            return analysis_result
        
        # Use liberal equivalence principle for LLM consensus
        analysis = gl.eq_principle_liberal_eq(analyze_web_content)
        
        # Parse the JSON response
        import json
        try:
            # Clean potential markdown formatting
            cleaned = analysis.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("```")[1]
                if cleaned.startswith("json"):
                    cleaned = cleaned[4:]
            
            result = json.loads(cleaned.strip())
        except Exception as e:
            # Fallback if parsing fails
            result = {
                "originality": 75,
                "plagiarism": 25,
                "deepfake": 20,
                "sentiment": "Neutral",
                "summary": "Content analyzed but response format was invalid",
                "reasoning": f"Parse error: {str(e)}"
            }
        
        # Create verification result
        verification_id = self.next_id
        self.next_id += 1
        
        # Return result directly
        return {
            "id": int(verification_id),
            "url": url,
            "originality": result.get("originality", 75),
            "plagiarism": result.get("plagiarism", 25),
            "deepfake": result.get("deepfake", 20),
            "sentiment": result.get("sentiment", "Neutral"),
            "summary": result.get("summary", ""),
            "reasoning": result.get("reasoning", ""),
            "timestamp": int(gl.block_timestamp),
            "validator": gl.tx_sender,
            "status": "completed"
        }
    
    @gl.public.view
    def get_next_id(self) -> int:
        """Get the next verification ID"""
        return int(self.next_id)
