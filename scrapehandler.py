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

UNDETECTED_ADAPTER = UndetectedAdapter()
BROWSER_CONFIG = BrowserConfig(
    enable_stealth = True,
    headless = False,
    verbose = True,
    viewport_width=1980,
    viewport_height=1080,
    text_mode = True,
    light_mode = True
)

CRAWLER_STRATEGY = AsyncPlaywrightCrawlerStrategy(
    browser_config = BROWSER_CONFIG,
    browser_adapter = UNDETECTED_ADAPTER
)
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
    if not url_list: return 

    llm_strategy = LLMExtractionStrategy(
        llm_config = LLMConfig(provider = "deepseek/deepseek-chat", api_token = os.getenv("DEEPSEEK_API_KEY")),
        schema = Course.model_json_schema(),
        extraction_type = "schema",
        instruction = LLM_INSRUCTION.format(query = user_query),
        #chunk_token_threshold = 1000,
        #overlap_rate = 0,
        apply_chunking = False,
        input_format = "markdown"
    )

    CRAWL_CONFIG = CrawlerRunConfig(
        extraction_strategy = llm_strategy,
        stream = False,
        cache_mode = CacheMode.BYPASS,
        css_selector = COURSE_CSS_SELECTOR,
        markdown_generator = MD_GENERATOR,
    )

    crawler = AsyncWebCrawler(config = BROWSER_CONFIG, crawler_strategy = CRAWLER_STRATEGY)
    await crawler.start()

    tasks = [crawler.arun(url = course_URL, config = CRAWL_CONFIG) for course_URL in url_list]
    results = await asyncio.gather(*tasks)

    info_list = []
    for result in results:
        if result.success:
            data = json.loads(result.extracted_content)
            info_list.append(data)
            print(data)

    await crawler.close()

    return info_list

async def scrape_query_pages(user_query):
    URL_FILTER = URLPatternFilter(patterns = ["*/learn/*", "*/course/*"]) # this was declared earlier but idk im too scared to remove ts
    BFS_CRAWL_STRATEGY = BFSDeepCrawlStrategy(
        max_depth = 1,
        include_external = False,
        max_pages = 7,
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
    crawler = AsyncWebCrawler(config = BROWSER_CONFIG, crawler_strategy = CRAWLER_STRATEGY)
    await crawler.start()

    tasks = [crawler.arun(url = URL.format(query = user_query), config = CRAWL_CONFIG) for URL in URLS]
    all_results = await asyncio.gather(*tasks)

    for site_result_list in all_results:
        for result in site_result_list:
            if result.success:
                course_URLS.append(result.url)

    await crawler.close()
    await scrape_course_pages(course_URLS, user_query)
 
#if __name__ == "__main__":
#    load_dotenv()
#    asyncio.run(scrape_query_pages("algorithms"))