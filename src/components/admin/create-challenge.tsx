import {Button} from "@mui/material"
import axios from "axios";
import {CreateChallengeRequest} from "gmaker/app/admin/api/create-challenge/route";

export const CreateChallenge = () => {
    const createChallenge = async () => {
        const req: CreateChallengeRequest = {
            name: "Day 1",
            description: "Day 1 challenge",
            date: new Date(),
            imageIds: ["2b2c8036-53d7-4ac0-a9f2-cce95b24fb76.webp", "4a60fb22-8ff8-401b-8a98-0ce8281b0ce1.webp", "5addf351-9ea9-440d-b184-543ca74e344d.webp", "356ede2a-be29-42a6-ab46-a31abd08d833.webp", "380f38d6-7b39-4190-b03f-7bd00f1a5e39.webp"]
        }
        await axios.post("/admin/api/create-challenge", req)
    }

    return <Button onClick={createChallenge}>
        Create Challenge
    </Button>
}