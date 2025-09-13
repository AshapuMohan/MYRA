import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await sql`
      SELECT preferences FROM users WHERE id = ${session.user.id}
    `;

    const defaultPreferences = {
      language: "en-US",
      voice_speed: 1.0,
      high_contrast: false,
      font_size: "medium",
      dyslexia_friendly: false
    };

    const preferences = user?.preferences || defaultPreferences;

    return Response.json({ preferences });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return Response.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();
    
    // Validate preference values
    const validLanguages = ["en-US", "es-ES", "fr-FR", "de-DE", "it-IT", "pt-BR", "zh-CN", "ja-JP"];
    const validFontSizes = ["small", "medium", "large", "extra-large"];
    
    if (updates.language && !validLanguages.includes(updates.language)) {
      return Response.json({ error: "Invalid language" }, { status: 400 });
    }
    
    if (updates.font_size && !validFontSizes.includes(updates.font_size)) {
      return Response.json({ error: "Invalid font size" }, { status: 400 });
    }
    
    if (updates.voice_speed && (updates.voice_speed < 0.5 || updates.voice_speed > 2.0)) {
      return Response.json({ error: "Voice speed must be between 0.5 and 2.0" }, { status: 400 });
    }

    // Get current preferences
    const [currentUser] = await sql`
      SELECT preferences FROM users WHERE id = ${session.user.id}
    `;

    const currentPreferences = currentUser?.preferences || {
      language: "en-US",
      voice_speed: 1.0,
      high_contrast: false,
      font_size: "medium",
      dyslexia_friendly: false
    };

    // Merge with updates
    const newPreferences = { ...currentPreferences, ...updates };

    // Update in database
    await sql`
      UPDATE users 
      SET preferences = ${JSON.stringify(newPreferences)}
      WHERE id = ${session.user.id}
    `;

    return Response.json({ preferences: newPreferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return Response.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}