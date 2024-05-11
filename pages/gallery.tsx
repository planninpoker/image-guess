import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {ChallengeWithRounds} from "gmaker/app/challenge/api/gallery/route";
import {useState} from "react";
import {Box, Card, Slider, Stack, Typography} from "@mui/material";
import Image from "next/image";

const useChallenge = () => {
    return useQuery({
        queryKey: ["challenge", "gallery"],
        refetchOnMount: true,
        queryFn: async (): Promise<ChallengeWithRounds> => {
            const resp = await axios.get<ChallengeWithRounds>("/challenge/api/gallery");
            return resp.data;
        }
    });
}

type ImageComponentProps = {
    imageId: string;
    name: string;
}
const ImageComponent = ({imageId, name}:ImageComponentProps) => {
    const [isHovering, setIsHovering] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);

    return (
       <Card sx={{
           p:2,
           width: "calc(50% - 8px)",
       }}>
           <Stack sx={{
           }}>
               <Box
                   onMouseEnter={() => setIsHovering(true)}
                   onMouseLeave={() => setIsHovering(false)}
                   key={imageId}
                   sx={{
                       position: "relative",
                       maxWidth: "1000px",
                       maxHeight: "1000px",
                       height: "100%",
                       aspectRatio: "1/1",
                       borderRadius: "12px",
                       overflow: "hidden",
                       backgroundColor: "rgba(0, 0, 0, 0.8)",
                   }}>
                   <Image
                       src={`/challenge/api/image?imageId=${imageId}`}
                       loading={"eager"}
                       alt={`blurry image of a ${name}`}
                       width={10 * (sliderValue) || 1}
                       height={10 * sliderValue || 1}
                       quality={sliderValue * 10}
                       style={{
                           width: "100%",
                           height: "100%",
                           aspectRatio: "1/1",
                           objectFit: "contain",
                       }}
                   />
                   {isHovering && <Box sx={{
                       position: "absolute",
                       bottom: 0,
                       right: 0,
                       p: 1,
                       px:2,
                       background: "rgba(0, 0, 0, 0.6)",
                       borderTopLeftRadius: "12px",
                       borderBottomRightRadius: "12px",
                   }}>
                       <Typography>
                           {name}
                       </Typography>
                   </Box>}
               </Box>
               <Stack pt={1}>
                   <Typography id="image-quality-label" variant={"body2"}>Image Quality</Typography>
                   <Slider
                       value={sliderValue}
                       sx={{
                           mx:1,
                       }}
                       onChange={(_, value) => setSliderValue(value as number)}
                       min={0}
                       max={10}
                       step={1}
                       aria-labelledby="image-quality-label"  // Connects the label with the slider
                       getAriaValueText={value => `Image quality level: ${value}`}  // Provides a readable description of the slider value
                       aria-valuetext={`Image quality level: ${sliderValue}`}  // Current value text for screen readers
                   />
               </Stack>
           </Stack>
       </Card>
    )
}

const Gallery = () => {
    const {data} = useChallenge();

    return <Stack spacing={4}
                  sx={{
                      mx: "auto",
                  }}
                  py={{
                      xs: 2,
                      sm: 4,
                  }}>
        <Stack>
            <Typography variant={"h2"} component={'h1'}>
                Previous Images Gallery
            </Typography>
            <Typography variant={"body1"}>
                All of the images from past challenges. Think you can guess them all?
            </Typography>
        </Stack>
        <Stack direction={"row"} flexWrap={"wrap"} gap={2}>
            {data?.rounds.map((round, index) => (
                <ImageComponent
                    key={round.id}
                    imageId={round.imageId}
                    name={round.name}
                />
            ))}
        </Stack>
    </Stack>
}

export default Gallery