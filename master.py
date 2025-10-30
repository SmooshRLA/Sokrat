
from flask import Flask, render_template, request, jsonify
import asyncio

from libraryhandler import search_books
from onethandler import search_keyword_onet
from ythandler import search_video, get_video_questions
from scrapehandler import scrape_query_pages, test
from mindmaphandler import create_mind_map, mind_test

app = Flask(__name__)

@app.route('/video_questions/<video_id>')
async def video_questions(video_id):
    questions = await get_video_questions(video_id)
    return jsonify(questions)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.form.get('query')

    async def gather_results(q):
        books = await search_books(q)
        onet = await search_keyword_onet(q)
        videos = await search_video(q, limit=7)
        courses = await scrape_query_pages(q)
        mindmap = await create_mind_map(q)
        return {
            'books': books,
            'onet': onet,
            'videos': videos,
            'courses': courses,
            'mindmap': mindmap
        }

    results = asyncio.run(gather_results(query))
    return render_template('data.html', query=query, results=results)

if __name__ == '__main__':
    app.run(debug=True)

