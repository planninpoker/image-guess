import {NextRequest, NextResponse} from "next/server";
import {getStore} from "@netlify/blobs";

const store = () => {
    return getStore({name: 'images', consistency: 'strong'});
}

export const GET = async (request: NextRequest) => {
    const params = request.nextUrl.searchParams;
    const imageId = params.get("imageId");

    try {
        if (!imageId) {
            console.log("Image ID not found")
            return NextResponse.json({Message: "Image ID not found", status: 400});
        }

        const blobStore = store();
        const image = await blobStore.get(imageId, {consistency: "strong", type: "blob"});
        console.log("found image")

        if (!image) {
            console.log("Image not found")
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
        console.log("Error occured ", error);
        return NextResponse.json({Message: "Failed for some reason", status: 500, error: error});
    }
};