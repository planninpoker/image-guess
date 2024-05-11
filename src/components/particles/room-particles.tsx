import {useCallback, useEffect, useRef} from "react";

import Particles from "react-tsparticles";
import {loadFull} from "tsparticles";
import type {Engine} from "tsparticles-engine";
import {
    EmitterContainer,
    loadEmittersPlugin,
} from "tsparticles-plugin-emitters";
import {Portal, useTheme} from "@mui/material";
import {IEmitter} from "tsparticles-plugin-emitters/types/Options/Interfaces/IEmitter";

export const getConfettiEmitter = (): Partial<IEmitter> => {
    return {
        name: "confetti",
        particles: {
            color: {
                value: ["#00FFFC", "#FC00FF", "#fffc00"],
            },
            shape: {
                type: ["circle", "square"],
                options: {},
            },
            opacity: {
                value: 1,
                animation: {
                    enable: true,
                    minimumValue: 0,
                    speed: 3,
                    startValue: "max",
                    destroy: "min",
                },
            },
            size: {
                value: 15,
                random: {
                    enable: true,
                    minimumValue: 7,
                },
            },
            move: {
                enable: true,
                gravity: {
                    enable: true,
                    acceleration: 10,
                },
                speed: {
                    min: 10,
                    max: 80,
                },
                decay: 0.04,
                direction: "topRight",
                straight: false,
                outModes: {
                    default: "destroy",
                    top: "none",
                },
            },
            rotate: {
                value: {
                    min: 0,
                    max: 360,
                },
                direction: "random",
                move: true,
                animation: {
                    enable: true,
                    speed: 60,
                },
            },
            tilt: {
                direction: "random",
                enable: true,
                move: true,
                value: {
                    min: 0,
                    max: 360,
                },
                animation: {
                    enable: true,
                    speed: 60,
                },
            },
            roll: {
                darken: {
                    enable: true,
                    value: 10,
                },
                enable: true,
                speed: {
                    min: 15,
                    max: 25,
                },
            },
            wobble: {
                distance: 30,
                enable: true,
                move: true,
                speed: {
                    min: -15,
                    max: 15,
                },
            },
        },
        position: {
            x: 50,
            y: 50,
        },
        rate: {
            delay: 0.1, // Emit particles every 0.1 seconds
            quantity: 400, // Emit 250 particles at once
        },
        life: {
            wait: false,
            duration: 0.1, // Destroy the emitter after 0.1 seconds
            count: 1, // Destroy the emitter after 1 loop
        },
    };
};


export const RoomParticles = ({ids}: { ids: string[] }) => {
    const theme = useTheme();

    const containerRef = useRef<EmitterContainer | undefined>(undefined);
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
        await loadEmittersPlugin(engine);
    }, []);

    const particlesLoaded = useCallback(
        async (container: EmitterContainer | undefined) => {
            await container;
            containerRef.current = container;
        },
        [],
    );

    const usedRef = useRef<Record<string, boolean>>({});
    useEffect(() => {
        ids.forEach((id) => {
            if (usedRef.current[id]) {
                return;
            }
            usedRef.current[id] = true;
            containerRef.current?.addEmitter(getConfettiEmitter());
        })
    }, [ids]);

    return (
        <Portal>
            <Particles
                id="tsparticles"
                key="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded as any}
                options={{
                    backgroundMode: {
                        enable: true,
                        zIndex: 0,
                    },
                    emitters: [],
                }}
            />
        </Portal>
    )
}