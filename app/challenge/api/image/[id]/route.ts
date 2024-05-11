import {NextRequest, NextResponse} from "next/server";
import {getStore} from "@netlify/blobs";

export const GET = async (request: Request, {params}: { params: { id: string } }) => {
    const id = params.id;

    try {
        if (!id) {
            return NextResponse.json({Message: "Image ID not found", status: 400});
        }

        const blobStore = getStore({name: 'images', consistency: 'strong'});
        const image = await blobStore.get(id, {consistency: "strong", type: "blob"});

        if (!image) {
            return NextResponse.json({Message: "Image not found", status: 404});
        }

        return new NextResponse(image, {
            status: 200,
            statusText: "OK",
            headers: {
                'Content-Type': 'image/webp',
                "Cache-Control": "public, max-age=604800, must-revalidate",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error) {
        return NextResponse.json({Message: "Failed for some reason", status: 500, error: error});
    }
};