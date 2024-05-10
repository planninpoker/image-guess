import {getStore} from '@netlify/blobs';
import {getUUID} from "gmaker/src/helpers/strings";
import {NextResponse} from "next/server";

export const store = () => {
    return getStore({name: 'images', consistency: 'strong'});
}

export const POST = async (request: Request) => {
    const formData = await request.formData();

    const file = formData.get("file");
    if (!file) {
        return NextResponse.json({error: "No files received."}, {status: 400});
    }

    try {
        const id = getUUID();
        const blobStore = store();
        await blobStore.set(`${id}.webp`, file);
        return NextResponse.json({Message: "Success", status: 201});
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({Message: "Failed", status: 500});
    }
};