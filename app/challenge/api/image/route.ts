import {NextRequest, NextResponse} from "next/server";
import {getStore} from "@netlify/blobs";

const store = () => {
    return getStore({name: 'images', consistency: 'strong'});
}

export const GET = async (request: NextRequest) => {
    try {
        const params = request.nextUrl.searchParams;
        const imageId = params.get("imageId");

        console.log("imageId ", imageId)
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

        const headers = new Headers();
        headers.set("Content-Type", "image/webp");
        return new NextResponse(image, {
            status: 200,
            statusText: "OK",
            headers,
        });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({Message: "Failed", status: 500});
    }
};