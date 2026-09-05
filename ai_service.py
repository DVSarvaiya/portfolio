from openai import OpenAI
import time


# Free OpenRouter models, ordered by best-guess fit for code/UI generation
# (Sep 2026) — picked from live availability + weekly-usage signals rather
# than a network-verified benchmark (this environment can't reach
# openrouter.ai to confirm exact slugs). A wrong/renamed slug here is
# harmless: AIService.ask() treats a 404 as "unavailable" and moves on to
# the next entry, so this list is safe to keep pruning/reordering over time
# as models come and go on OpenRouter.
FALLBACK_MODELS = [
    "z-ai/glm-5.2:free",                    # GLM line has a strong code-gen track record
    "minimax/minimax-m3:free",              # very high real-world usage, 1M ctx
    "poolside/laguna-s-2.1:free",           # Poolside is a code-model-focused lab
    "nvidia/nemotron-3.5-lightning:free",   # 1M ctx, fast, previously verified working
    "nvidia/nemotron-3-super:free",         # large model, solid all-rounder fallback
    "openrouter/free",                      # last-resort smart router
]


class AIService:

    def __init__(self, api_key, model):

        self.client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1",
            timeout=120.0
        )

        self.model = model

    def ask(self, prompt, system_prompt=None, retries=6, max_tokens=16384):

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
        # Models we've already tried this call, so we never retry one we
        # know is unavailable and never get stuck looping the same model.
        tried_models = {current_model}
        remaining_fallbacks = [m for m in FALLBACK_MODELS if m not in tried_models]

        last_error = None

        for attempt in range(1, retries + 1):
            try:
                response = self.client.chat.completions.create(
                    model=current_model,
                    messages=messages,
                    max_tokens=max_tokens
                )
                content = response.choices[0].message.content

                if not content or not content.strip():
                    raise Exception("Model returned an empty response.")

                if "User Safety: safe" in content:
                    raise Exception("OpenRouter safety filter triggered.")

                return content
            except Exception as e:
                last_error = e
                error_str = str(e)
                is_model_error = (
                    "404" in error_str
                    or "402" in error_str
                    or "not found" in error_str.lower()
                    or "requires more credits" in error_str.lower()
                )

                # If model is unavailable or costs money, permanently drop it
                # and try the next untried fallback — without spending a retry.
                if is_model_error and remaining_fallbacks:
                    next_model = remaining_fallbacks.pop(0)
                    tried_models.add(next_model)
                    print(f"⚠️ Model '{current_model}' unavailable/paid. Switching to '{next_model}'...")
                    current_model = next_model
                    continue

                print(f"⚠️ API attempt {attempt}/{retries} failed: {e}")
                if attempt < retries:
                    wait = attempt * 10
                    print(f"   Retrying in {wait}s...")
                    time.sleep(wait)

        raise Exception(f"API failed after {retries} attempts: {last_error}")
