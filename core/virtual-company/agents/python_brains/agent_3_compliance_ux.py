import os
import sys
import json
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv

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
    problemsFound: List[str] = Field(description="A list of 1-2 compliance or UX issues.")
    solutionsProposed: List[str] = Field(description="A list of 1-2 actionable legal or usability solutions.")

async def run_agent():
    try:
        config = LocalAgentConfig(
            model="gemini-2.5-flash",
            system_instruction="You are Agent 3, Risk, UI/UX & Compliance Officer for Piazza Marconi Cafe. You combine the roles of UI/UX Auditor and Corporate Attorney. You ensure digital touchpoints are highly usable, conversion-optimized, and legally compliant (GDPR, Italian laws).",
            response_schema=AgentReport
        )
        prompt = "Review the website interface and legal disclaimers. Identify friction points in user experience or legal risks, and propose solutions."
        async with Agent(config) as agent:
            response = await agent.chat(prompt)
            data = await response.structured_output()
            print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"error": str(e), "problemsFound": [f"Execution Error: {str(e)}"], "solutionsProposed": ["Check python logic"]}))

if __name__ == "__main__":
    asyncio.run(run_agent())
