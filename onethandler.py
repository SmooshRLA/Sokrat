from onetwebservice import OnetWebService
from dotenv import load_dotenv
import os 
import json

load_dotenv()

USERNAME = os.getenv("ONET_USERNAME")
PASSWORD = os.getenv("ONET_PASSWORD")
ONET_WS = OnetWebService(USERNAME, PASSWORD)

def check_connected():
    version_info = ONET_WS.call('about')
    if 'error' in version_info:
        return False 
    
    return True

async def search_keyword_onet(user_query):
    if not check_connected(): return 

    keyword_results = ONET_WS.call('online/search', ('keyword', user_query), ('end', 5))
    if 'error' in keyword_results: return 

    if (not 'occupation' in keyword_results) or (len(keyword_results['occupation']) == 0):
        return
    else:
        occupations = []
        for occ in keyword_results['occupation']:
            occupation_info = {
                "onet_code": occ['code'],
                "job_title": occ['title'],
                "link_to": f"https://www.onetonline.org/link/summary/{occ['code']}"
            }
            occupations.append(occupation_info)
        print(occupations)
        return occupations

# testing
async def test_onet():
    if not check_connected(): return 

    keyword_results = ONET_WS.call('online/search', ('keyword', 'data science'), ('end', 5))
    if 'error' in keyword_results: return 

    if (not 'occupation' in keyword_results) or (len(keyword_results['occupation']) == 0):
        return
    else:
        occupations = []
        for occ in keyword_results['occupation']:
            occupations.append(occ)
        print(occupations)
        return occupations

#import asyncio
#asyncio.run(test_onet())