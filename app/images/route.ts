import {getStore} from '@netlify/blobs';
import {NextResponse} from "next/server";

const store = () => {
    return getStore({name: 'images', consistency: 'strong'});
}

export const POST = async (request: Request) => {
    const formData = await request.formData();

    const file = formData.get("file");
    const name = formData.get("name");
    if (!file) {
        return NextResponse.json({error: "No files received."}, {status: 400});
    }
    if (!name || typeof name !== "string") {
        return NextResponse.json({error: "No name received."}, {status: 400});
    }

    try {
        const blobStore = store();
        await blobStore.set(name, file);
        return NextResponse.json({Message: "Success", status: 201});
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({Message: "Failed", status: 500});
    }
};