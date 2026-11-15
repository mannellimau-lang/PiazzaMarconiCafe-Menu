import os

import requests

try:
    from bs4 import BeautifulSoup
except ImportError:  # dipendenza facoltativa: senza bs4 si usa un'estrazione testuale semplice
    BeautifulSoup = None

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
    # 3. Nessuna credenziale: le funzioni che la usano degradano con un messaggio esplicito
    return None

def read_website_text(url: str) -> str:
    """Fetches and extracts text from a given URL."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        if BeautifulSoup is None:
            import re
            raw = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", response.text, flags=re.S | re.I)
            text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", raw)).strip()
        else:
            soup = BeautifulSoup(response.text, 'html.parser')
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
        from duckduckgo_search import DDGS
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

def _fetch_analytics(property_id):
    """Chiamata reale a Google Analytics. Va eseguita SOLO in un processo figlio (vedi get_analytics_data)."""
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest

    client = BetaAnalyticsDataClient()
    request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[Dimension(name="city")],
        metrics=[Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
    )
    response = client.run_report(request, timeout=15.0)
    lines = ["Google Analytics (ultimi 7 giorni, utenti attivi per città):"]
    for row in list(response.rows)[:15]:
        lines.append(f"- {row.dimension_values[0].value}: {row.metric_values[0].value}")
    if not response.rows:
        lines.append("Nessun dato nel periodo.")
    return "\n".join(lines)


def get_analytics_data(property_id="543867716", timeout=30):
    """
    Utenti attivi GA4 degli ultimi 7 giorni.

    La libreria gRPC di Google può restare appesa (import lento, rete, credenziali): un thread
    bloccato non si può interrompere e impediva all'intero report di terminare. Per questo la
    chiamata avviene in un PROCESSO FIGLIO che viene ucciso allo scadere del timeout.
    Se il dato manca lo si dichiara: mai sostituirlo con numeri "di base" inventati.
    """
    import subprocess
    import sys

    creds_path = _get_credentials_path()
    if not creds_path:
        return "Google Analytics: DATI NON DISPONIBILI (credenziali non configurate)."
    env = dict(os.environ, GOOGLE_APPLICATION_CREDENTIALS=creds_path)
    try:
        proc = subprocess.run([sys.executable, os.path.abspath(__file__), "--analytics", str(property_id)],
                              capture_output=True, text=True, timeout=timeout, env=env)
    except subprocess.TimeoutExpired:
        return f"Google Analytics: DATI NON DISPONIBILI (nessuna risposta entro {timeout}s)."
    if proc.returncode != 0 or not proc.stdout.strip():
        last = (proc.stderr.strip().splitlines() or ["errore sconosciuto"])[-1][:160]
        return f"Google Analytics: DATI NON DISPONIBILI ({last})."
    return proc.stdout.strip()


def get_mybusiness_data(location_id="1017510290639725298"):
    """Google Business Profile: integrazione non ancora attiva -> lo si dichiara, senza simulare dati."""
    return "Google Business Profile: DATI NON DISPONIBILI (integrazione delle metriche non ancora implementata)."


def check_site_health(urls, timeout=12):
    """Controllo deterministico (senza AI) di stato HTTP e tempi di risposta delle pagine pubbliche."""
    lines = []
    for url in urls:
        try:
            r = requests.get(url, timeout=timeout, headers={'User-Agent': 'PiazzaMarconiCafe-HealthCheck/1.0'})
            lines.append(f"- {url} -> HTTP {r.status_code}, {r.elapsed.total_seconds():.2f}s, {len(r.content) // 1024} KB")
        except requests.RequestException as e:
            lines.append(f"- {url} -> ERRORE {type(e).__name__}")
    return "\n".join(lines)


if __name__ == "__main__":
    import sys
    if len(sys.argv) == 3 and sys.argv[1] == "--analytics":
        print(_fetch_analytics(sys.argv[2]))
