import os
from dotenv import load_dotenv

from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

load_dotenv()

# Read credentials from .env
IBM_API_KEY = os.getenv("IBM_API_KEY")
IBM_PROJECT_ID = os.getenv("IBM_PROJECT_ID")
IBM_ENDPOINT = os.getenv("IBM_ENDPOINT")

# Connect to IBM watsonx.ai
credentials = Credentials(
    api_key=IBM_API_KEY,
    url=IBM_ENDPOINT
)

# IBM Granite model (IBM Bob)
model = ModelInference(
    model_id="ibm/granite-4-h-small",
    credentials=credentials,
    project_id=IBM_PROJECT_ID,
    params={
        GenParams.MAX_NEW_TOKENS: 350,
        GenParams.TEMPERATURE: 0.2
    }
)


def bob_review(prompt: str):
    """
    Sends the complete prompt to IBM Granite (IBM Bob)
    and returns the generated review text.
    """

    print("🚀 Sending to IBM Bob...")

    response = model.generate_text(prompt=prompt)

    print("✅ IBM Bob responded.")

    return response.strip()

def bob_chat(question: str, context: str):
    prompt = f"""
You are IBM Bob, an AI code reviewer inside VS Code.

Pull Request Review Context:
{context}

Developer Question:
{question}

Answer as an experienced software engineer.

Keep answers concise, actionable, and technical.
"""

    response = model.generate_text(prompt=prompt)

    return response.strip()