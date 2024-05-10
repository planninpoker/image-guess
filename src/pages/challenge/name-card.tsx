import {Box, Button, Card, Stack, TextField, Typography} from "@mui/material";
import Link from "next/link";
import {useAuthContext} from "gmaker/src/auth/auth-provider";
import Nope from "nope-validator";
import {useForm} from "react-hook-form";
import {nopeResolver} from "@hookform/resolvers/nope";

const schema = Nope.object().shape({
    usersName: Nope.string().required("Name is required").min(2, "Name is too short").max(50, "Name is too long"),
})

export const NameCard = () => {
    const {updateUser} = useAuthContext()

    const formSubmit = async (data:any) => {
        updateUser(data.usersName)
    }

    const {
        register,
        formState: {errors},
        handleSubmit,
    } = useForm({
        resolver: nopeResolver(schema),
    });

    return (
        <Stack py={{
            xs: 2,
            sm: 12,
        }}>
            <Card sx={{
                py: 4,
                px:2
            }}>
                <Stack>
                    <Typography textAlign={"center"} variant={"h2"} pb={1} color={"secondary.main"}>
                        Welcome!
                    </Typography>
                    <Typography textAlign={"center"} pb={3}>
                        Before you get started, please enter your name
                    </Typography>
                    <Box sx={{
                        maxWidth: 400,
                        width: "100%",
                        margin: "auto",
                    }}>
                        <form onSubmit={handleSubmit(formSubmit)}>
                            <TextField
                                {...register("usersName")}
                                placeholder={"Enter your name..."}
                                autoComplete={"off"}
                                fullWidth
                                label={errors.usersName?.message as string}
                                error={!!errors.usersName}
                            />
                            <Button
                                variant={"contained"}
                                type={"submit"}
                                fullWidth
                                sx={{
                                    mx: "auto",
                                mt:2,
                            }}>
                                Submit and Start
                            </Button>
                        </form>
                    </Box>
                </Stack>
            </Card>
            <Link href={"/"}>
                <Typography
                    sx={{
                        pt: 2,
                        color: "primary.light",
                        cursor: "pointer",
                        textDecoration: "underline",
                        textAlign: "center",
                    }}>
                    Go back to main page
                </Typography>
            </Link>
        </Stack>
    )
}