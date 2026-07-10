import os
import sys
import json
import traceback
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv

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
    problemsFound: List[str] = Field(description="A list of 1-2 compliance or UX issues.")
    solutionsProposed: List[str] = Field(description="A list of 1-2 actionable legal or usability solutions.")

def run_agent():
    try:
        model_name = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")
        
        prompt = "Review the website interface and legal disclaimers. Identify friction points in user experience or legal risks, and propose solutions."
        
        system_instruction = "You are Agent 3, Risk, UI/UX & Compliance Officer for Piazza Marconi Cafe. You combine the roles of UI/UX Auditor and Corporate Attorney. You ensure digital touchpoints are highly usable, conversion-optimized, and legally compliant (GDPR, Italian laws)."
        
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
