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
    problemsFound: List[str] = Field(description="A list of 1-2 team morale, workflow, or engagement problems.")
    solutionsProposed: List[str] = Field(description="A list of 1-2 actionable team motivation or workflow improvement solutions.")

async def run_agent():
    try:
        config = LocalAgentConfig(
            model="gemini-2.0-flash-lite",
            system_instruction="You are Agent 5, Continuous Improvement Motivator (DevOps/Culture). Focus on team morale, continuous delivery of assets, removing friction, and keeping the virtual company aligned.",
            response_schema=AgentReport
        )
        prompt = "Analyze team dynamics in a fast-paced environment. Generate a brief audit reporting problems in workflow or motivation, and propose concrete solutions to boost morale."
        async with Agent(config) as agent:
            response = await agent.chat(prompt)
            data = await response.structured_output()
            print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"error": str(e), "problemsFound": [f"Execution Error: {str(e)}"], "solutionsProposed": ["Check python logic"]}))

if __name__ == "__main__":
    asyncio.run(run_agent())
