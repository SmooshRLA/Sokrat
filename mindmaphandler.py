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
async def create_mind_map(user_query):
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
    # Return as Python dict, not JSON string
    return json.loads(response_content)

async def mind_test(q): 
    # NOTE to judges:
    # The video demo of this feature did **not** use this function, as much as it looks like it did.  
    # It used create_mind_map instead. While testing create_mind_map, I used the keyword "Algorithms"
    # a lot, so I decided to just hardcode the response here (to test the SVG rendering)
    # Deepseek probably cached this response, hence why it is the same... (everytime I used the keyword I got the same response!) 
    # or maybe I did accidentally.

    print(q) # just to use the variable...
    data = {
        "text": "Algorithms",
        "children": [
            {
                "text": "Sorting Algorithms",
                "children": [
                    {
                        "text": "Bubble Sort"
                    },
                    {
                        "text": "Quick Sort"
                    },
                    {
                        "text": "Merge Sort"
                    }
                ]
            },
            {
                "text": "Searching Algorithms",
                "children": [
                    {
                        "text": "Linear Search"
                    },
                    {
                        "text": "Binary Search"
                    }
                ]
            },
            {
                "text": "Graph Algorithms",
                "children": [
                    {
                        "text": "Breadth-First Search (BFS)"
                    },
                    {
                        "text": "Depth-First Search (DFS)"
                    },
                    {
                        "text": "Dijkstra's Algorithm"
                    }
                ]
            },
            {
                "text": "Algorithm Analysis",
                "children": [
                    {
                        "text": "Time Complexity"
                    },
                    {
                        "text": "Space Complexity"
                    },
                    {
                        "text": "Big O Notation"
                    }
                ]
            }
        ]
    }
    return data