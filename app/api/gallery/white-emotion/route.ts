// app/api/gallery/white-emotion/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Correct the folder name to match what's in your Cloudinary account
const FOLDER_NAME = "whiteEmotion-24";
const PUBLIC_ID_PREFIX = "white-motion-24";

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get("max_results") || "500");
    const nextCursor = searchParams.get("next_cursor") || undefined;

    // Use a search based on the public_id prefix instead of folder
    const result = await cloudinary.search
      .expression(`public_id:${PUBLIC_ID_PREFIX}_*`)
      .sort_by("public_id", "asc")
      .max_results(maxResults)
      .next_cursor(nextCursor)
      .execute();

    // Add debug log
    console.log(
      `Found ${result.resources?.length || 0} images for White Emotion`
    );

    // Transform results to include only necessary data
    const images = result.resources
      ? result.resources.map((resource: any, index: number) => ({
          id: index + 1,
          title: `Foto ${index + 1}`,
          url: resource.secure_url,
          publicId: resource.public_id,
          width: resource.width,
          height: resource.height,
          format: resource.format,
          uploaded: resource.created_at,
        }))
      : [];

    // Return the results along with pagination info
    return NextResponse.json({
      images,
      total: result.total_count || 0,
      nextCursor: result.next_cursor,
    });
  } catch (error) {
    console.error(
      "Cloudinary API error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      {
        error: "Failed to fetch images from Cloudinary",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
