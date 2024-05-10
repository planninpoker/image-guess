import {Box, Button, Card, Stack, TextField, Typography} from '@mui/material';
import {ChangeEvent, useState} from 'react';
import {useSnackbar} from "notistack";
import {CreateChallengeRequest} from "gmaker/app/admin/api/create-challenge/route";
import axios from "axios";
import {getUUID} from "gmaker/src/helpers/strings";

interface ImageData {
    id: string;
    file: File | null;
    name: string;
    previewUrl: string | null;
}

export const ImageUploader = () => {
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const {enqueueSnackbar} = useSnackbar()
    const [imageDataArray, setImageDataArray] = useState<ImageData[]>(
        Array(10).fill({id: getUUID(), file: null, name: '', previewUrl: null}).map((v) => ({
            ...v,
            id: getUUID(),
        }))
    );

    const completed = imageDataArray.every((data) => data.file !== null && data.name !== '');

    const handleAllImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const fileArray = Array.from(files);
        setImageDataArray((prevArray) => {
            const updatedArray = [...prevArray];
            fileArray.forEach((file, index) => {
                const previewUrl = URL.createObjectURL(file);
                updatedArray[index] = {
                    ...updatedArray[index],
                    file,
                    previewUrl,
                };
            });
            return updatedArray;
        })
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImageDataArray((prevArray) => {
                const updatedArray = [...prevArray];
                updatedArray[index] = {
                    ...updatedArray[index],
                    file,
                    previewUrl,
                };
                return updatedArray;
            });
        }
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const name = event.target.value;
        setImageDataArray((prevArray) => {
            const updatedArray = [...prevArray];
            updatedArray[index] = {
                ...updatedArray[index],
                name,
            };
            return updatedArray;
        });
    };

    const afterUpload = async () => {
        try {
            const req: CreateChallengeRequest = {
                name: title,
                description: description,
                date: new Date(),
                images: imageDataArray.map((data) => ({id: data.id, name: data.name})),
            };
            await axios.post("/admin/api/create-challenge", req);
        } catch (e) {
            console.log("Error occurred ", e);
            enqueueSnackbar("Error occurred", {variant: "error"});
        }
    }

    const handleUpload = async () => {
        const uploadedImages = imageDataArray.filter((data) => data.file !== null);

        if (uploadedImages.length !== 10) {
            enqueueSnackbar("Please upload all images", {variant: "error"});
            return;
        }

        for (const imageData of uploadedImages) {
            const formData = new FormData();
            formData.append('file', imageData.file as File);
            formData.append('name', `${imageData.id}.webp`);

            try {
                await axios.post("/images", formData);
            } catch (error) {
                console.error(`Error uploading image ${imageData.name}:`, error);
                enqueueSnackbar("Error occurred", {variant: "error"});
            }
        }
        await afterUpload();
    };

    return (
        <Stack spacing={2} py={8}>
            <Typography>
                Create a new challenge
            </Typography>
            <Stack direction={"row"} spacing={2}>
                <TextField
                    fullWidth
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
                <TextField
                    fullWidth
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </Stack>
            <Stack direction={"row"} flexWrap={"wrap"} gap={1}>
                {imageDataArray.map((data, index) => (
                    <Card key={index} sx={{
                        display: "flex",
                        p: 1,
                    }}>
                        <Stack spacing={1}>
                            <TextField
                                type="text"
                                placeholder="Image name"
                                value={data.name}
                                onChange={(event) => handleNameChange(event, index)}
                            />
                            <Box
                                component={"label"}
                                htmlFor={"upload-image"}
                                sx={{
                                    border: "2px dashed",
                                    maxWidth: '200px',
                                    aspectRatio: 1 / 1,
                                    width: "100%",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                {data.previewUrl && <img
                                    src={data.previewUrl}
                                    alt={data.name}
                                    style={{height: "100%", aspectRatio: 1 / 1, width: "100%"}}

                                />}
                                {!data.previewUrl && <Typography>
                                    Upload image
                                </Typography>}
                            </Box>
                            <input
                                id={"upload-image"}
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleImageChange(event, index)}
                                style={{
                                    display: "none",
                                }}
                            />
                        </Stack>

                    </Card>
                ))}
                <Card sx={{
                    display: "flex",
                    p: 1,
                }}>
                    <Box>
                        <Button
                            component={"label"}
                            htmlFor={"upload-all-images"}
                            variant={"contained"}
                            sx={{
                                px: 4,
                                py: 1,
                            }}
                        >
                            Upload All Images
                        </Button>
                        <input
                            id={"upload-all-images"}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAllImageChange}
                            style={{
                                display: "none",
                            }}
                        />
                    </Box>
                </Card>
            </Stack>
            <Button onClick={handleUpload} disabled={!completed} variant={"contained"}>Upload</Button>
        </Stack>
    );
};