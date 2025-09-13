import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return Response.json({ error: "Search query is required" }, { status: 400 });
    }

    // Call Google Search integration
    const searchResponse = await fetch(`${process.env.ANYTHING_API_URL || ''}/integrations/google-search/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.ANYTHING_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      throw new Error(`Search API responded with status: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    // Transform the results for better accessibility
    const results = searchData.items?.map(item => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      displayUrl: item.displayLink,
    })) || [];

    return Response.json({ 
      query,
      results,
      totalResults: results.length 
    });

  } catch (error) {
    console.error("Error performing search:", error);
    return Response.json({ error: "Failed to perform search" }, { status: 500 });
  }
}