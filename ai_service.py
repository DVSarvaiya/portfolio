from openai import OpenAI
import time


# Verified free models from OpenRouter API (Aug 2026)
# These have $0 prompt + $0 completion pricing
FALLBACK_MODELS = [
    "openrouter/free",                              # Smart router — free models only
    "google/gemma-4-31b-it:free",                    # 262k ctx, 32k output
    "nvidia/nemotron-3-super-120b-a12b:free",        # 262k ctx, 262k output
    "nvidia/nemotron-3.5-lightning:free",             # 1M ctx, 65k output
]


class AIService:

    def __init__(self, api_key, model):

        self.client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1",
            timeout=120.0
        )

        self.model = model

    def ask(self, prompt, system_prompt=None, retries=3, max_tokens=16384):

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
        fallback_index = 0

        for attempt in range(1, retries + 1):
            try:
                response = self.client.chat.completions.create(
                    model=current_model,
                    messages=messages,
                    max_tokens=max_tokens
                )
                content = response.choices[0].message.content
                if "User Safety: safe" in content:
                    raise Exception("OpenRouter safety filter triggered.")
                return content
            except Exception as e:
                error_str = str(e)
                is_model_error = (
                    "404" in error_str
                    or "402" in error_str
                    or "not found" in error_str.lower()
                    or "requires more credits" in error_str.lower()
                )

                # If model is unavailable or costs money, try next fallback
                if is_model_error and fallback_index < len(FALLBACK_MODELS):
                    next_model = FALLBACK_MODELS[fallback_index]
                    fallback_index += 1
                    # Skip if we're already using this model
                    if next_model == current_model:
                        if fallback_index < len(FALLBACK_MODELS):
                            next_model = FALLBACK_MODELS[fallback_index]
                            fallback_index += 1
                        else:
                            next_model = None
                    if next_model:
                        print(f"⚠️ Model '{current_model}' unavailable/paid. Switching to '{next_model}'...")
                        current_model = next_model
                        continue

                print(f"⚠️ API attempt {attempt}/{retries} failed: {e}")
                if attempt < retries:
                    wait = attempt * 10
                    print(f"   Retrying in {wait}s...")
                    time.sleep(wait)
                else:
                    raise Exception(f"API failed after {retries} attempts: {e}")