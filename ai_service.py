from openai import OpenAI
import time


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

        for attempt in range(1, retries + 1):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    max_tokens=4096
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"⚠️ API attempt {attempt}/{retries} failed: {e}")
                if attempt < retries:
                    wait = attempt * 10
                    print(f"   Retrying in {wait}s...")
                    time.sleep(wait)
                else:
                    raise Exception(f"API failed after {retries} attempts: {e}")