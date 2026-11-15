"""Test del client LLM contro un finto server Gemini: 404 modello, 429 con retryDelay, 429 giornaliero, 503, JSON rotto, successo."""
import json, sys, threading, os
from http.server import BaseHTTPRequestHandler, HTTPServer
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "agents", "python_brains"))
import llm_client

calls = []
SCRIPT = {}  # model -> lista di risposte in sequenza

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _send(self, code, obj):
        b = json.dumps(obj).encode(); self.send_response(code); self.send_header('Content-Type','application/json'); self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b)
    def do_GET(self):
        self._send(200, {"models": [{"name": f"models/{m}", "supportedGenerationMethods": ["generateContent"]} for m in SCRIPT["__available__"]]})
    def do_POST(self):
        self.rfile.read(int(self.headers.get('Content-Length', 0)))
        model = self.path.split('/models/')[1].split(':')[0]; calls.append(model)
        code, obj = SCRIPT[model].pop(0) if SCRIPT.get(model) else (404, {"error": {"message": "not found"}})
        self._send(code, obj)

ok = lambda d: (200, {"candidates": [{"content": {"parts": [{"text": json.dumps(d)}]}, "finishReason": "STOP"}]})
srv = HTTPServer(('127.0.0.1', 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
llm_client.API_ROOT = f"http://127.0.0.1:{srv.server_port}/v1beta"
llm_client._sleep_backoff = lambda *a, **k: None  # niente attese nei test
os.environ.pop("GEMINI_MODEL", None)
schema = {"type": "OBJECT"}

def case(name, env_models, available, script, expect_model=None, expect_fail=False):
    calls.clear(); SCRIPT.clear(); SCRIPT.update(script); SCRIPT["__available__"] = available
    os.environ["AGENT_MODELS"] = env_models
    try:
        data, model = llm_client.generate_json("sys", "prompt", schema, api_key="test")
        res = f"OK model={model} calls={calls}"
        assert not expect_fail and model == expect_model, res
    except llm_client.LLMUnavailable as e:
        res = f"UNAVAILABLE ({e}) calls={calls}"
        assert expect_fail, res
    print(f"PASS  {name}: {res}")

R429 = (429, {"error": {"message": "rate", "details": [{"retryDelay": "2s"}]}})
DAILY = (429, {"error": {"message": "quota", "details": [{"violations": [{"quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier"}]}]}})
case("modello configurato inesistente viene scartato in scoperta", "gemini-9-ultra", ["gemini-2.5-flash"], {"gemini-2.5-flash": [ok({"a": 1})]}, "gemini-2.5-flash")
case("429 al minuto -> retry stesso modello", "", ["gemini-2.5-flash"], {"gemini-2.5-flash": [R429, R429, ok({"a": 1})]}, "gemini-2.5-flash")
case("quota giornaliera -> salta subito al modello successivo", "", ["gemini-2.5-flash", "gemini-2.5-flash-lite"], {"gemini-2.5-flash": [DAILY], "gemini-2.5-flash-lite": [ok({"a": 1})]}, "gemini-2.5-flash-lite")
case("503 ripetuti poi fallback", "", ["gemini-2.5-flash", "gemini-2.5-flash-lite"], {"gemini-2.5-flash": [(503, {})]*3, "gemini-2.5-flash-lite": [ok({"a": 1})]}, "gemini-2.5-flash-lite")
case("JSON troncato -> ritenta", "", ["gemini-2.5-flash"], {"gemini-2.5-flash": [(200, {"candidates": [{"content": {"parts": [{"text": "{\"a\":"}]}, "finishReason": "MAX_TOKENS"}]}), ok({"a": 1})]}, "gemini-2.5-flash")
case("tutti i preferiti ritirati -> selezione automatica del flash più recente", "", ["gemini-4.0-flash", "gemini-3.5-flash", "gemini-4.0-flash-image", "gemini-4.0-pro"], {"gemini-4.0-flash": [ok({"a": 1})]}, "gemini-4.0-flash")
case("tutto esaurito -> LLMUnavailable", "", ["gemini-2.5-flash"], {"gemini-2.5-flash": [DAILY]}, expect_fail=True)
case("chiave rifiutata -> stop immediato", "", ["gemini-2.5-flash", "gemini-2.5-flash-lite"], {"gemini-2.5-flash": [(403, {"error": {"message": "API key invalid"}})], "gemini-2.5-flash-lite": [ok({})]}, expect_fail=True)
