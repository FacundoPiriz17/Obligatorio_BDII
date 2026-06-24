import { Camera } from "expo-camera";
import { useEffect, useState } from "react";

export function useCameraPermission() {
    const [granted, setGranted] = useState(null);

    useEffect(() => {
        Camera.requestCameraPermissionsAsync().then(({ status }) =>
            setGranted(status === "granted")
        );
    }, []);

    return { granted };
}
