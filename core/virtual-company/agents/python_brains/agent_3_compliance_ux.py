#!/usr/bin/env python3
"""Compatibilità: esegue il solo Agente 3. La logica vive in run_report.py, la definizione in agents_config.py."""
import os
import subprocess
import sys

here = os.path.dirname(os.path.abspath(__file__))
sys.exit(subprocess.call([sys.executable, os.path.join(here, "run_report.py"), "--agent", "3"] + sys.argv[1:]))
