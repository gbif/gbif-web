import axios from 'axios';
import lunr from 'lunr';

/**
 * Loads the modified search index and creates a lunr search interface
 * @param query The search query to execute
 * @returns The search results
 */
interface SearchData {
  index: object;
  store?: {
    documents?: Record<string, { [key: string]: unknown }>;
  };
}

export default async function searchTechDocs(
  query: string,
): Promise<
  { score: number; document?: Record<string, unknown>; ref: string }[]
> {
  try {
    const searchData = (await getSearchIndex()) as SearchData;

    // Create a lunr index from the loaded data
    const idx = lunr.Index.load(searchData.index);

    // Execute the search
    const results = idx.search(query);

    // If there's a documents array in the search data, use it to get the full documents
    if (searchData?.store?.documents) {
      const { documents } = searchData.store;

      // Map the search results to include the full document data
      const formattedResults = results.map((result) => {
        return {
          score: result.score,
          document: documents[result.ref.split('-')[0]],
          ref: result.ref,
        };
      });
      return formattedResults;
    }

    // If no document store found, just return the results
    return results;
  } catch (error) {
    // just ignore errors
    return [];
  }
}

interface CacheEntry {
  data: SearchData;
  timestamp: number;
}

let cache: CacheEntry | null = null;
const cacheExpiryMs = 60 * 60 * 1000; // 1 hour in milliseconds

async function getSearchIndex(): Promise<SearchData> {
  const now = Date.now();

  // Check if cache is expired or doesn't exist
  if (!cache || now - cache.timestamp > cacheExpiryMs) {
    const results = await fetchAndModifyJsFile();
    cache = {
      data: results,
      timestamp: Date.now(),
    };
    return results;
  }

  return cache.data;
}

/**
 * Fetches a JavaScript file from a URL, removes specified wrapping code,
 * and saves the result to a file.
 */
async function fetchAndModifyJsFile(): Promise<SearchData> {
  try {
    // URL of the JavaScript file to fetch
    const url = 'https://techdocs.gbif.org/en/search-index.js';

    // Fetch the file content as text
    const response = await axios.get(url, {
      responseType: 'text',
    });

    // Get the file content as string
    const fileContent = response.data;

    // Define the prefix and suffix to remove
    const prefix = 'antoraSearch.initSearch(lunr, ';
    const suffix = ')';

    // Process the content - remove the prefix and suffix
    let processedContent = fileContent;

    if (processedContent.startsWith(prefix)) {
      processedContent = processedContent.substring(prefix.length);
    } else {
      console.warn('Warning: Expected prefix not found in the file content');
    }

    if (processedContent.endsWith(suffix)) {
      processedContent = processedContent.substring(
        0,
        processedContent.length - suffix.length,
      );
    } else {
      console.warn('Warning: Expected suffix not found in the file content');
    }

    // Save the processed content to a file
    // fs.writeFileSync('modified-search-index.json', processedContent);
    const index = JSON.parse(processedContent);
    return index;
  } catch (error) {
    return {} as SearchData; // Return an empty object in case of error
  }
}

// Execute the function
fetchAndModifyJsFile();
