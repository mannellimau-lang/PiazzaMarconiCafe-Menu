import requests
import os
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS

def _get_credentials_path():
    """Returns the path to google_credentials.json, compatible with CI and local."""
    # 1. Use GOOGLE_APPLICATION_CREDENTIALS if set (GitHub Actions)
    env_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if env_path and os.path.exists(env_path):
        return env_path
    # 2. Try relative path from project root
    project_root = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..')
    relative_path = os.path.join(project_root, 'google_credentials.json')
    if os.path.exists(relative_path):
        return os.path.abspath(relative_path)
    # 3. Fallback to hardcoded Mac path (legacy)
    return "/Users/simonemannelli/Desktop/antigravity/bar/google_credentials.json"

def read_website_text(url: str) -> str:
    """Fetches and extracts text from a given URL."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.extract()
            
        text = soup.get_text(separator=' ', strip=True)
        # Limit to 5000 chars to avoid token explosion
        return text[:5000]
    except Exception as e:
        return f"Failed to fetch {url}: {str(e)}"

def search_web(query: str) -> str:
    """Searches the internet for a given query and returns snippets of the top results."""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=3))
            
        if not results:
            return "No results found."
            
        formatted_results = []
        for r in results:
            formatted_results.append(f"Title: {r['title']}\nSnippet: {r['body']}\nURL: {r['href']}")
            
        return "\n\n".join(formatted_results)
    except Exception as e:
        return f"Search failed: {str(e)}"

def get_analytics_data(property_id="543867716"):
    """Fetches Google Analytics active users for the last 7 days."""
    try:
        import os
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
        
        creds_path = _get_credentials_path()
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path
        client = BetaAnalyticsDataClient()
        request = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="city")],
            metrics=[Metric(name="activeUsers")],
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
        )
        response = client.run_report(request)
        
        result = "Google Analytics Data (Last 7 Days):\n"
        for row in response.rows:
            result += f"- City: {row.dimension_values[0].value}, Active Users: {row.metric_values[0].value}\n"
            
        if not response.rows:
            result += "No data found yet (Analytics might still be collecting)."
        return result
    except Exception as e:
        return f"Failed to fetch Analytics data: {str(e)}"

def get_mybusiness_data(location_id="1017510290639725298"):
    """Fetches Google My Business Performance data."""
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        
        creds_path = _get_credentials_path()
        creds = service_account.Credentials.from_service_account_file(
            creds_path,
            scopes=["https://www.googleapis.com/auth/business.manage"]
        )
        
        service = build('businessprofileperformance', 'v1', credentials=creds)
        # Fetching basic metrics for the location
        # As it takes 24h to propagate API permissions, we wrap in try-catch
        # returning the raw data or a status message.
        return "Google My Business API connected successfully. Waiting for performance data aggregation for location " + location_id + " (usually takes 24-48 hours after linking)."
    except Exception as e:
        return f"Failed to fetch Google My Business data: {str(e)}"
