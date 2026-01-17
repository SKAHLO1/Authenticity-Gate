# { "Depends": "py-genlayer:test" }
from genlayer import *

@allow_storage
class VerificationResult:
    id: u256
    url: str
    originality: u64
    plagiarism: u64
    deepfake: u64
    sentiment: str
    summary: str
    reasoning: str
    timestamp: u256
    validator: str
    status: str

class ContentVerification(gl.Contract):
    """
    Intelligent Contract for Content Authenticity Verification
    Uses GenLayer's AI consensus with Gemini to analyze content for:
    - Originality Score
    - Plagiarism Risk
    - Deepfake/AI Generation Confidence
    - Sentiment Analysis
    """
    
    # State variables
    verifications: TreeMap[u256, VerificationResult]
    next_id: u256
    
    def __init__(self):
        self.next_id = 1
    
    @gl.public.write
    def verify_content(self, url: str) -> dict:
        """
        Verify content from a URL using Gemini AI through GenLayer consensus
        
        Args:
            url: The URL to analyze
            
        Returns:
            dict: Verification result with scores and analysis
        """
        
        def analyze_web_content():
            # Fetch content from URL
            web_data = gl.get_webpage(url, mode='text')
            
            # Limit content to prevent token overflow (Gemini context limit)
            content = web_data[:8000] if len(web_data) > 8000 else web_data
            
            # Use Gemini LLM to analyze content via GenLayer
            # This prompt is optimized for Gemini's capabilities
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
            
            # Execute LLM analysis using Gemini
            analysis_result = gl.exec_llm(prompt)
            
            return analysis_result
        
        # Use liberal equivalence principle for LLM consensus
        # Multiple validators with Gemini will reach consensus on the analysis
        analysis = gl.eq_principle_liberal_eq(analyze_web_content)
        
        # Parse the JSON response from Gemini
        import json
        try:
            # Clean potential markdown formatting
            cleaned = analysis.strip()
            if cleaned.startswith("```"):
                # Remove markdown code blocks if present
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
        
        # Store verification result on-chain
        verification_id = self.next_id
        
        verification = VerificationResult()
        verification.id = verification_id
        verification.url = url
        verification.originality = result.get("originality", 75)
        verification.plagiarism = result.get("plagiarism", 25)
        verification.deepfake = result.get("deepfake", 20)
        verification.sentiment = result.get("sentiment", "Neutral")
        verification.summary = result.get("summary", "")
        verification.reasoning = result.get("reasoning", "")
        verification.timestamp = gl.block_timestamp
        verification.validator = gl.tx_sender
        verification.status = "completed"
        
        self.verifications[verification_id] = verification
        self.next_id += 1
        
        # Convert to dict for return
        return {
            "id": int(verification.id),
            "url": verification.url,
            "originality": int(verification.originality),
            "plagiarism": int(verification.plagiarism),
            "deepfake": int(verification.deepfake),
            "sentiment": verification.sentiment,
            "summary": verification.summary,
            "reasoning": verification.reasoning,
            "timestamp": int(verification.timestamp),
            "validator": verification.validator,
            "status": verification.status
        }
    
    @gl.public.view
    def get_verification(self, verification_id: int) -> dict:
        """
        Get a specific verification result
        
        Args:
            verification_id: The ID of the verification
            
        Returns:
            dict: The verification result or None if not found
        """
        verification = self.verifications.get(verification_id, None)
        if verification is None:
            return {}
        
        return {
            "id": int(verification.id),
            "url": verification.url,
            "originality": int(verification.originality),
            "plagiarism": int(verification.plagiarism),
            "deepfake": int(verification.deepfake),
            "sentiment": verification.sentiment,
            "summary": verification.summary,
            "reasoning": verification.reasoning,
            "timestamp": int(verification.timestamp),
            "validator": verification.validator,
            "status": verification.status
        }
    
    @gl.public.view
    def get_all_verifications(self) -> list[dict]:
        """
        Get all verification results
        
        Returns:
            list: All verifications sorted by ID
        """
        results = []
        for vid in sorted(self.verifications.keys()):
            v = self.verifications[vid]
            results.append({
                "id": int(v.id),
                "url": v.url,
                "originality": int(v.originality),
                "plagiarism": int(v.plagiarism),
                "deepfake": int(v.deepfake),
                "sentiment": v.sentiment,
                "summary": v.summary,
                "reasoning": v.reasoning,
                "timestamp": int(v.timestamp),
                "validator": v.validator,
                "status": v.status
            })
        return results
    
    @gl.public.view
    def get_verification_count(self) -> int:
        """
        Get total number of verifications
        
        Returns:
            int: Count of verifications
        """
        return len(self.verifications)
    
    @gl.public.write
    def batch_verify(self, urls: list[str]) -> list[dict]:
        """
        Verify multiple URLs in a single transaction
        
        Args:
            urls: List of URLs to verify
            
        Returns:
            list: List of verification results
        """
        results = []
        for url in urls[:10]:  # Limit to 10 URLs per batch
            result = self.verify_content(url)
            results.append(result)
        return results
