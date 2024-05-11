import {ImageUploader} from "gmaker/src/components/admin/image-uploader";
import {useAuthContext} from "gmaker/src/auth/auth-provider";
import {CircularProgress, Stack, Typography} from "@mui/material";
import { useRouter } from "next/router";

const FullPageLoader = () => {

    return (
        <Stack
            spacing={2}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
            }}>
            <CircularProgress size={100} thickness={10}/>
            <Typography>
                Loading...
            </Typography>
        </Stack>
    )
}



const Admin = () => {
    return <ImageUploader/>
}


const UserLoader = () => {
    const router = useRouter()
    const {user} = useAuthContext()

    if (!user) {
        return <FullPageLoader/>
    }

    if (!user.admin) {
        router.replace("/")
        return <FullPageLoader/>
    }

    return <Admin/>
}

export default UserLoader