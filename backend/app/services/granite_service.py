"""IBM Granite integration service with controlled fallback."""
import os
import json
import logging
import httpx
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

GRANITE_ENDPOINT = os.getenv("GRANITE_ENDPOINT", "")
IBM_API_KEY = os.getenv("IBM_API_KEY", "")
GRANITE_MODEL = os.getenv("GRANITE_MODEL", "ibm/granite-3-3-8b-instruct")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID", "")
APP_ENV = os.getenv("APP_ENV", "demo")

# Token cache
_token_cache: Dict[str, Any] = {}


def _is_granite_configured() -> bool:
    return bool(GRANITE_ENDPOINT and IBM_API_KEY)


async def _get_iam_token() -> Optional[str]:
    """Get IBM IAM token, cached."""
    import time
    cached = _token_cache.get("token")
    expires = _token_cache.get("expires", 0)
    if cached and time.time() < expires - 60:
        return cached
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                "https://iam.cloud.ibm.com/identity/token",
                data={
                    "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                    "apikey": IBM_API_KEY,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            resp.raise_for_status()
            data = resp.json()
            _token_cache["token"] = data["access_token"]
            _token_cache["expires"] = time.time() + data.get("expires_in", 3600)
            return _token_cache["token"]
    except Exception as e:
        logger.warning(f"IAM token fetch failed: {e}")
        return None


async def call_granite(prompt: str, max_tokens: int = 512, temperature: float = 0.3) -> Optional[str]:
    """
    Call IBM Granite via watsonx.ai API.
    Returns None on failure so callers can use fallback logic.
    """
    if not _is_granite_configured():
        logger.info("Granite not configured — using fallback mode")
        return None

    try:
        token = await _get_iam_token()
        if not token:
            return None

        endpoint = GRANITE_ENDPOINT.rstrip("/")
        url = f"{endpoint}/ml/v1/text/generation?version=2024-05-01"

        payload = {
            "model_id": GRANITE_MODEL,
            "input": prompt,
            "parameters": {
                "decoding_method": "greedy",
                "max_new_tokens": max_tokens,
                "temperature": temperature,
                "stop_sequences": [],
            },
        }
        if WATSONX_PROJECT_ID:
            payload["project_id"] = WATSONX_PROJECT_ID

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                url,
                json=payload,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            generated = data.get("results", [{}])[0].get("generated_text", "").strip()
            logger.info(f"Granite call succeeded, tokens: {len(generated.split())}")
            return generated if generated else None

    except httpx.TimeoutException:
        logger.warning("Granite request timed out — using fallback")
        return None
    except Exception as e:
        logger.warning(f"Granite call failed: {e} — using fallback")
        return None


async def call_granite_json(prompt: str, max_tokens: int = 700) -> Optional[Dict]:
    """Call Granite and parse JSON response."""
    raw = await call_granite(prompt, max_tokens=max_tokens, temperature=0.1)
    if not raw:
        return None
    # Extract JSON block
    try:
        # Try direct parse
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    # Find JSON block in response
    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start >= 0 and end > start:
        try:
            return json.loads(raw[start:end])
        except json.JSONDecodeError:
            pass
    logger.warning("Could not parse Granite JSON response")
    return None


def granite_available() -> bool:
    return _is_granite_configured()
