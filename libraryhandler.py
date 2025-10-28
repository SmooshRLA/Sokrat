import requests
import json

def search_books(user_query):
    result = requests.get(url = f"https://openlibrary.org/search.json?q={user_query}")
    text = result.text
    formatted = json.loads(text)
    book_list = []

    for book in formatted["docs"]:
        print(book)
        title = book["title"]
        key = book['key']
        book_info = {
            "title": title, 
            "link": f"https://openlibrary.org{key}",
        }

        author_exists = "author_name" in book 
        if author_exists:
            book_info["authors"] = book["author_name"]

        book_list.append(book_info)

    #print(book_list)

    return book_list


#search_books("python data structures")
 