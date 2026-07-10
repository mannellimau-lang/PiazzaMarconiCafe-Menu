import os
import sys
import json
import traceback
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv
from agent_tools import read_website_text, search_web

try:
    import google.generativeai as genai
except ImportError:
    print(json.dumps({
        "error": "google-generativeai not installed",
        "problemsFound": ["System Error: Python dependencies missing."],
        "solutionsProposed": ["Run pip install -r requirements.txt"]
    }))
    sys.exit(1)

env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))), '.env')
load_dotenv(env_path)

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print(json.dumps({
        "error": "missing_api_key",
        "problemsFound": ["System Error: GEMINI_API_KEY is missing in the environment."],
        "solutionsProposed": ["Add GEMINI_API_KEY to .env or environment variables."]
    }))
    sys.exit(1)

genai.configure(api_key=api_key)

class AgentReport(BaseModel):
    problemsFound: List[str] = Field(description="A list of 1-2 local SEO, market trend, or pricing problems.")
    solutionsProposed: List[str] = Field(description="A list of 1-2 actionable local SEO or market positioning solutions.")

def run_agent():
    try:
        model_name = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")
        
        # Fetch real analytics and GMB data
        from agent_tools import get_analytics_data, get_mybusiness_data
        analytics_stats = get_analytics_data("543867716")
        gmb_stats = get_mybusiness_data("1017510290639725298")
        
        prompt = f"Review the local Caltanissetta market context and the following REAL data for our business:\n- Website Traffic: {analytics_stats}\n- Google Maps Traffic: {gmb_stats}\n\nGenerate a brief audit reporting identified problems and concrete solutions based on this real data."
        
        system_instruction = "You are Agent 2, Market Intelligence & SEO Analyst for Piazza Marconi Cafe. You track local competition in Caltanissetta, search trends, and menu pricing."
        
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=system_instruction
        )
        
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=AgentReport
            )
        )
        
        output_text = response.text.strip()
        if output_text.startswith("```json"):
            output_text = output_text[7:]
        if output_text.endswith("```"):
            output_text = output_text[:-3]
        output_text = output_text.strip()
        
        data = json.loads(output_text)
        print(json.dumps({
            "problemsFound": data.get("problemsFound", []),
            "solutionsProposed": data.get("solutionsProposed", [])
        }))
    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({
            "error": str(e),
            "problemsFound": [f"Execution Error: {str(e)}"],
            "solutionsProposed": ["Check python logic or API status"]
        }))

if __name__ == "__main__":
    run_agent()
