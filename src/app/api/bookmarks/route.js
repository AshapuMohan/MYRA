import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await sql`
      SELECT id, title, url, voice_tag, created_at 
      FROM bookmarks 
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return Response.json({ bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return Response.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, url, voice_tag } = await request.json();

    if (!title || !url) {
      return Response.json({ error: "Title and URL are required" }, { status: 400 });
    }

    const [bookmark] = await sql`
      INSERT INTO bookmarks (user_id, title, url, voice_tag)
      VALUES (${session.user.id}, ${title}, ${url}, ${voice_tag || null})
      RETURNING id, title, url, voice_tag, created_at
    `;

    return Response.json({ bookmark });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return Response.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get('id');

    if (!bookmarkId) {
      return Response.json({ error: "Bookmark ID is required" }, { status: 400 });
    }

    await sql`
      DELETE FROM bookmarks 
      WHERE id = ${bookmarkId} AND user_id = ${session.user.id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return Response.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}