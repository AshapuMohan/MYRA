import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const search = searchParams.get('search');

    let query = `
      SELECT id, title, url, search_query, visited_at 
      FROM browse_history 
      WHERE user_id = $1
    `;
    let params = [session.user.id];

    if (search) {
      query += ` AND (
        LOWER(title) LIKE LOWER($2) OR 
        LOWER(url) LIKE LOWER($2) OR 
        LOWER(search_query) LIKE LOWER($2)
      )`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY visited_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const history = await sql(query, params);

    return Response.json({ history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return Response.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, url, search_query } = await request.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const [historyEntry] = await sql`
      INSERT INTO browse_history (user_id, title, url, search_query)
      VALUES (${session.user.id}, ${title || null}, ${url}, ${search_query || null})
      RETURNING id, title, url, search_query, visited_at
    `;

    return Response.json({ historyEntry });
  } catch (error) {
    console.error("Error creating history entry:", error);
    return Response.json({ error: "Failed to create history entry" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const historyId = searchParams.get('id');
    const clearAll = searchParams.get('clear_all') === 'true';

    if (clearAll) {
      await sql`
        DELETE FROM browse_history 
        WHERE user_id = ${session.user.id}
      `;
      return Response.json({ success: true, message: "All history cleared" });
    }

    if (!historyId) {
      return Response.json({ error: "History ID is required" }, { status: 400 });
    }

    await sql`
      DELETE FROM browse_history 
      WHERE id = ${historyId} AND user_id = ${session.user.id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting history:", error);
    return Response.json({ error: "Failed to delete history" }, { status: 500 });
  }
}