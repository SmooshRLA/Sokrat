from pydantic import BaseModel, Field
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, UndetectedAdapter, LLMExtractionStrategy, CacheMode, LLMConfig
from crawl4ai.deep_crawling import BFSDeepCrawlStrategy
from crawl4ai.async_crawler_strategy import AsyncPlaywrightCrawlerStrategy
from crawl4ai.deep_crawling.filters import FilterChain, URLPatternFilter
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from dotenv import load_dotenv
import asyncio
import json
import os

class Course(BaseModel):
    name: str 
    difficulty: str
    length: str 
    skills: str
    relevant: bool

LLM_INSRUCTION = "Extract the course's name, difficulty, length, and key skills learned from the content. For key skills, summarize them in a short paragraph. If the course is relevant to the user's query which is: {query} mark it as such."

def get_browser_config_and_strategy():
    undetected_adapter = UndetectedAdapter()
    browser_config = BrowserConfig(
        enable_stealth = True,
        headless = False,
        verbose = True,
        viewport_width=1980,
        viewport_height=1080,
        text_mode = True,
        light_mode = True
    )
    crawler_strategy = AsyncPlaywrightCrawlerStrategy(
        browser_config = browser_config,
        browser_adapter = undetected_adapter
    )
    return browser_config, crawler_strategy
# https://www.coursera.org/learn/data-structures
QUERY_CSS_SELECTOR = ".cds-ProductCard-gridCard, .card__more"
COURSE_CSS_SELECTOR = ".css-oe48t8, .l-card__info-wrapper, .l-info__inner" #.cds-ProductCard-gridCard, .css-oe48t8
URLS = ["https://www.coursera.org/search?query={query}", "https://alison.com/courses?query={query}"]
URL_FILTER = URLPatternFilter(patterns = ["*/learn/*", "*/course/*"])

MD_GENERATOR = DefaultMarkdownGenerator(
    options = {
        "ignore_links": True,
        "escape_html": False,
        "ignore_images": True
    }
)

# NOTE: Alison so friggin ahhhhh rn idk if this problem is going to persist or not.

async def scrape_course_pages(url_list, user_query):
    try:
        if not url_list:
            return []

        llm_strategy = LLMExtractionStrategy(
            llm_config = LLMConfig(provider = "deepseek/deepseek-chat", api_token = os.getenv("DEEPSEEK_API_KEY")),
            schema = Course.model_json_schema(),
            extraction_type = "schema",
            instruction = LLM_INSRUCTION.format(query = user_query),
            apply_chunking = False,
            input_format = "markdown"
        )

        browser_config, crawler_strategy = get_browser_config_and_strategy()
        CRAWL_CONFIG = CrawlerRunConfig(
            extraction_strategy = llm_strategy,
            stream = False,
            cache_mode = CacheMode.BYPASS,
            css_selector = COURSE_CSS_SELECTOR,
            markdown_generator = MD_GENERATOR,
        )

        crawler = AsyncWebCrawler(config = browser_config, crawler_strategy = crawler_strategy)
        await crawler.start()

        tasks = [crawler.arun(url = course_URL, config = CRAWL_CONFIG) for course_URL in url_list]
        results = await asyncio.gather(*tasks)

        import ast
        info_list = []
        for idx, result in enumerate(results):
            if result.success:
                print('Extracted course:', result.extracted_content)
                course = result.extracted_content
                course_url = url_list[idx] if idx < len(url_list) else None
                if isinstance(course, str):
                    try:
                        parsed = json.loads(course)
                    except Exception:
                        try:
                            parsed = ast.literal_eval(course)
                        except Exception:
                            parsed = None
                    if isinstance(parsed, dict):
                        course = parsed
                    elif isinstance(parsed, list):
                        for item in parsed:
                            if isinstance(item, dict):
                                info_list.append({
                                    'name': item.get('name', 'N/A'),
                                    'difficulty': item.get('difficulty', 'N/A'),
                                    'length': item.get('length', 'N/A'),
                                    'skills': item.get('skills', 'N/A'),
                                    'relevant': item.get('relevant', False),
                                    'link': course_url
                                })
                        continue
                    elif parsed is not None:
                        course = parsed
                    else:
                        info_list.append({
                            'name': course,
                            'difficulty': 'N/A',
                            'length': 'N/A',
                            'skills': 'N/A',
                            'relevant': False,
                            'link': course_url
                        })
                        continue
                if isinstance(course, dict):
                    info_list.append({
                        'name': course.get('name', 'N/A'),
                        'difficulty': course.get('difficulty', 'N/A'),
                        'length': course.get('length', 'N/A'),
                        'skills': course.get('skills', 'N/A'),
                        'relevant': course.get('relevant', False),
                        'link': course_url
                    })

        await crawler.close()
        return info_list
    except Exception as e:
        print(f"Error in scrape_course_pages: {e}")
        return []

async def scrape_query_pages(user_query):
    try:

        browser_config, crawler_strategy = get_browser_config_and_strategy()
        URL_FILTER = URLPatternFilter(patterns = ["*/learn/*", "*/course/*"]) # this was declared earlier but idk im too scared to remove ts
        BFS_CRAWL_STRATEGY = BFSDeepCrawlStrategy(
            max_depth = 1,
            include_external = False,
            max_pages = 5,
            filter_chain = FilterChain([URL_FILTER])
        )

        CRAWL_CONFIG = CrawlerRunConfig(
            deep_crawl_strategy = BFS_CRAWL_STRATEGY,
            stream = False,
            cache_mode = CacheMode.BYPASS,
            css_selector = QUERY_CSS_SELECTOR,
            markdown_generator = MD_GENERATOR,
        )

        course_URLS = []
        crawler = AsyncWebCrawler(config = browser_config, crawler_strategy = crawler_strategy)
        await crawler.start()

        tasks = [crawler.arun(url = URL.format(query = user_query), config = CRAWL_CONFIG) for URL in URLS]
        all_results = await asyncio.gather(*tasks)

        for site_result_list in all_results:
            for result in site_result_list:
                if result.success:
                    course_URLS.append(result.url)

        await crawler.close()
        return await scrape_course_pages(course_URLS, user_query)
    except Exception as e:
        print(f"Error in scrape_query_pages: {e}")
        return []
 
async def test():
    return "hello"

#if __name__ == "__main__":
#    load_dotenv()
#    asyncio.run(scrape_query_pages("algorithms"))