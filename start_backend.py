#!/usr/bin/env python3
"""
HeritageGuardian AI — Quick Start Script
Run this from the heritageguardian/ directory.
"""

import subprocess
import sys
import os
import shutil
from pathlib import Path

def check_python():
    if sys.version_info < (3, 9):
        print("❌ Python 3.9+ required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}")

def check_env():
    if not Path(".env").exists():
        if Path(".env.example").exists():
            shutil.copy(".env.example", ".env")
            print("✅ Created .env from .env.example")
            print("   ℹ️  Add GRANITE_API_KEY to .env for live IBM Granite inference")
            print("   ℹ️  Demo mode works without API keys")
        else:
            print("⚠️  No .env file found")
    else:
        print("✅ .env file exists")

def install_deps():
    print("📦 Installing Python dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt", "-q"], check=True)
    print("✅ Dependencies installed")

def start_backend():
    print("\n🚀 Starting HeritageGuardian AI backend on http://localhost:8000")
    print("   API docs available at http://localhost:8000/api/docs")
    print("   Press Ctrl+C to stop\n")
    os.execvp(sys.executable, [
        sys.executable, "-m", "uvicorn",
        "backend.main:app",
        "--reload", "--host", "0.0.0.0", "--port", "8000"
    ])

if __name__ == "__main__":
    print("🏛️  HeritageGuardian AI — Starting up...\n")
    check_python()
    check_env()
    install_deps()
    start_backend()
