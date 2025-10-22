from pydantic import BaseModel, ValidationError
from youtubesearchpython import VideosSearch, Transcript
from dotenv import load_dotenv
from openai import OpenAI
import json
import os

load_dotenv()

SYSTEM_PROMPT = """
    The user will provide the transcript to a video. Use the transcript to generate a list of 1-10 questions regarding the video, according to the transcript length.
    For each question, provide 2-4 possible answers, 1 correct one, and other answers that are incorrect but still related.

    EXAMPLE JSON OUTPUT:
    {
        "questions": [
            {
                "question_text": "What is the deepest trench in the world?",
                "answers": [
                    {"answer_text": "Mariana Trench", "is_correct": true},
                    {"answer_text": "Cascadia Trench", "is_correct": false},
                    {"answer_text": "Cayman Trench", "is_correct": false}
                ]
            }
        ]
    }
"""

client = OpenAI(
    api_key = os.getenv("DEEPSEEK_API_KEY"),
    base_url = "https://api.deepseek.com"
)

class Answer(BaseModel):
    answer_text: str
    is_correct: bool

class Question(BaseModel):
    question_text: str 
    answers: list[Answer]

class QuestionList(BaseModel):
    questions: list[Question]

def create_questions(transcript):
    if not transcript: return

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": transcript}
    ]

    response = client.chat.completions.create(
        model = "deepseek-chat",
        messages = messages,
        response_format = {'type': 'json_object'} 
    )

    response_content = response.choices[0].message.content
    validated = QuestionList.model_validate_json(response_content)
    print(validated)

    parsed_content = json.loads(response_content)
    return parsed_content

def extract_transcript(video_ID):
    transcript_string = ""
    
    try:
        URL = f"https://www.youtube.com/watch?v={video_ID}"
        transcript = Transcript.get(URL)

        for segment in transcript["segments"]:
            transcript_string += segment["text"]
            transcript_string += " "
    except:
        print("An error occurred. Could not extract transcript.")

    return transcript_string

def search_video(user_query, limit):
    vidoes_search = VideosSearch(user_query, limit = limit)

    # Example JSON output: https://pypi.org/project/youtube-search-python/
    return vidoes_search.result()

def get_video_questions(video_ID):
    # extract_transcript can and **will** fail like 50/50 idk why 
    # handle that as you wish
    transcript = extract_transcript(video_ID)
    if transcript:
        print("oi oi")
        return create_questions(transcript)
 
"""
def test():
    results = search_video("how to make a burger in 60s", 2)
    video_ID = results["result"][0]["id"]
    print(get_video_questions(video_ID))

test()"""