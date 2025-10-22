from __future__ import annotations
from pydantic import BaseModel, ValidationError
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI
import json
import os

load_dotenv()

SYSTEM_PROMPT = """
    The user will provide a specific topic that they wish to learn more about. 
    Create a mind map given this topic, beginning with 1 starting node and branching out. 
    Each node in the mind map should have its own text label, and optionally can have children. 
    Although, refrain from making children that are 5+ generations away from the starting node.

    EXAMPLE JSON OUTPUT:
    {
        "text": "Calculus",
        "children": [
            {
                "text": "Basics",
                "children": [
                    {
                        "text": "Limits"
                    },
                    {
                        "text": "Continuity"
                    }
                ]
            },
            {
                "text": "Derivatives",
                "children": [
                    {
                        "text": "Rules (Power, Product, Chain)"
                    },
                    {
                        "text": "Applications (Rates of change, optimization)"
                    }
                ]
           }
        ]
    }
"""

class MindMapNode(BaseModel):
    text: str 
    children: Optional[list[MindMapNode]] = None 

client = OpenAI(
    api_key = os.getenv("DEEPSEEK_API_KEY"),
    base_url = "https://api.deepseek.com"
)

# Returns a JSON object similar to the example given in the prompt
def create_mind_map(user_query):
    if not user_query: return 

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_query}
    ]

    response = client.chat.completions.create(
        model = "deepseek-chat",
        messages = messages,
        response_format = {'type': 'json_object'} 
    )

    response_content = response.choices[0].message.content
    print(response_content)
    validated = MindMapNode.model_validate_json(response_content) # you probabyly need a try catch block bc validatoin error
    print(validated)

    parsed_content = json.loads(response_content)
    print(parsed_content)
    return parsed_content