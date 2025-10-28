from flask import Flask, render_template, request
import asyncio

from libraryhandler import search_books
from onethandler import search_keyword_onet
from ythandler import search_video
from scrapehandler import scrape_query_pages
from mindmaphandler import create_mind_map

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.form.get('query')

    async def gather_results(q):
        books = await search_books(q)
        onet = await search_keyword_onet(q)
        videos = await search_video(q, limit=3)
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

