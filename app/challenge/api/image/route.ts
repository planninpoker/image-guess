import {NextRequest, NextResponse} from "next/server";
import {getStore} from "@netlify/blobs";
export const GET = async (request: NextRequest) => {
    const params = request.nextUrl.searchParams;
    const imageId = params.get("imageId");

    try {
        if (!imageId) {
            return NextResponse.json({Message: "Image ID not found", status: 400});
        }

        const blobStore = getStore({name: 'images', consistency: 'strong'});
        const image = await blobStore.get(imageId, {consistency: "strong", type: "blob"});

        if (!image) {
            return NextResponse.json({Message: "Image not found", status: 404});
        }

        return new NextResponse(image, {
            status: 200,
            statusText: "OK",
            headers: {
                'Content-Type': 'image/webp',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error) {
        return NextResponse.json({Message: "Failed for some reason", status: 500, error: error});
    }
};