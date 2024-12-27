import { createReactClient } from "@livepeer/react";
import { studioProvider } from "livepeer/providers/studio";

const LivepeerClient = createReactClient({
    provider: studioProvider({
        apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
    }),
});

export default LivepeerClient;
