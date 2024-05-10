import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {sessionOptions} from "gmaker/src/auth/iron-session/iron-options";
import {getAppSession} from "gmaker/src/auth/iron-session/iron-session";
import {store} from "gmaker/app/images/route";

export const GET = async (request: NextRequest) => {
    const session = await getAppSession(cookies(), sessionOptions);
    if (!session?.user) {
        return NextResponse.json({Message: "Unauthorized", status: 401});
    }
    try {
        const params = request.nextUrl.searchParams;
        const imageId = params.get("imageId");

        if (!imageId) {
            return NextResponse.json({Message: "Image ID not found", status: 400});
        }

        const blobStore = store();
        const image = await blobStore.get(imageId, {consistency: "strong", type: "blob"});

        if (!image) {
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