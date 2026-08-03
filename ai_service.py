from openai import OpenAI


class AIService:

    def __init__(self, api_key, model):

        self.client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1"
        )

        self.model = model

    def ask(self, prompt, system_prompt=None):

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

        response = self.client.chat.completions.create(

            model=self.model,

            messages=messages
        )

        return response.choices[0].message.content