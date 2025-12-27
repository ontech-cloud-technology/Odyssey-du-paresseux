import os
from openai import OpenAI

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.environ["HF_TOKEN"],
)

completion = client.chat.completions.create(
    model="moonshotai/Kimi-K2-Instruct-0905",
    messages=[
        {
            "role": "user",
            "content": "Write a short story about a robot learning to love."
        }
    ],
)

print(completion.choices[0].message)


import os
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="together",
    api_key=os.environ["HF_TOKEN"],
)

# output is a PIL.Image object
image = client.text_to_image(
    "A steampunk airship in the clouds",
    model="black-forest-labs/FLUX.1-dev",
)






# Clé API HuggingFace - À définir dans les variables d'environnement HF_API_KEY

