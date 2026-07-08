import os
import sys
import json
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv
from agent_tools import read_website_text, search_web

try:
    import asyncio
    from google.antigravity import Agent, LocalAgentConfig
except ImportError:
    print(json.dumps({"error": "google-antigravity not installed", "problemsFound": ["System Error: Python dependencies missing."], "solutionsProposed": ["Run pip install -r requirements.txt"]}))
    sys.exit(1)

env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))), '.env')
load_dotenv(env_path)

if not os.environ.get("GEMINI_API_KEY"):
    print(json.dumps({"error": "missing_api_key", "problemsFound": ["System Error: GEMINI_API_KEY is missing in the .env file."], "solutionsProposed": ["Add GEMINI_API_KEY to .env"]}))
    sys.exit(1)

class AgentReport(BaseModel):
    problemsFound: List[str] = Field(description="A list of 1-2 local SEO, market trend, or pricing problems.")
    solutionsProposed: List[str] = Field(description="A list of 1-2 actionable local SEO or market positioning solutions.")

async def run_agent():
    try:
        config = LocalAgentConfig(
            model="gemini-3.5-flash",
            system_instruction="You are Agent 2, Market Intelligence & SEO Analyst for Piazza Marconi Cafe. You track local competition in Caltanissetta, search trends, and menu pricing.",
            response_schema=AgentReport
        )
        
        # Fetch real analytics and GMB data
        from agent_tools import get_analytics_data, get_mybusiness_data
        analytics_stats = get_analytics_data("543867716")
        gmb_stats = get_mybusiness_data("1017510290639725298")
        
        prompt = f"Review the local Caltanissetta market context and the following REAL data for our business:\n- Website Traffic: {analytics_stats}\n- Google Maps Traffic: {gmb_stats}\n\nGenerate a brief audit reporting identified problems and concrete solutions based on this real data."
        async with Agent(config) as agent:
            response = await agent.chat(prompt)
            data = await response.structured_output()
            print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"error": str(e), "problemsFound": [f"Execution Error: {str(e)}"], "solutionsProposed": ["Check python logic"]}))

if __name__ == "__main__":
    asyncio.run(run_agent())
