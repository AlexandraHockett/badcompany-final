import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Folder name as seen in your Cloudinary account
const FOLDER_NAME = "hula-hula-23";
// We're assuming the public_id prefix matches the folder name in this case
// If not, you'll need to adjust this based on actual image public_ids
const PUBLIC_ID_PREFIX = "hula-hula-23";

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get("max_results") || "500");
    const nextCursor = searchParams.get("next_cursor") || undefined;

    // Use a search based on the public_id prefix
    const result = await cloudinary.search
      .expression(`public_id:${PUBLIC_ID_PREFIX}_*`)
      .sort_by("public_id", "asc")
      .max_results(maxResults)
      .next_cursor(nextCursor)
      .execute();

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
