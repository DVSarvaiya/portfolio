from openai import OpenAI
import time


FALLBACK_MODELS = [
    "openrouter/auto",
    "nvidia/nemotron-nano-9b-v2:free",
    "north/north-mini-code:free",
]


class AIService:

    def __init__(self, api_key, model):

        self.client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1",
            timeout=120.0
        )

        self.model = model

    def ask(self, prompt, system_prompt=None, retries=3):

        messages = []
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })
            
        messages.append({
            "role": "user",
            "content": prompt
        })

        current_model = self.model

        for attempt in range(1, retries + 1):
            try:
                response = self.client.chat.completions.create(
                    model=current_model,
                    messages=messages,
                    max_tokens=4096
                )
                content = response.choices[0].message.content
                if "User Safety: safe" in content:
                    raise Exception("OpenRouter safety filter triggered.")
                return content
            except Exception as e:
                error_str = str(e)
                is_model_unavailable = "404" in error_str or "not found" in error_str.lower()

                if is_model_unavailable and current_model != "openrouter/auto":
                    # Model was removed from free tier — switch to auto router
                    print(f"⚠️ Model '{current_model}' unavailable. Switching to fallback...")
                    current_model = "openrouter/auto"
                    # Don't count this as a wasted attempt — retry immediately
                    continue

                print(f"⚠️ API attempt {attempt}/{retries} failed: {e}")
                if attempt < retries:
                    wait = attempt * 10
                    print(f"   Retrying in {wait}s...")
                    time.sleep(wait)
                else:
                    raise Exception(f"API failed after {retries} attempts: {e}")