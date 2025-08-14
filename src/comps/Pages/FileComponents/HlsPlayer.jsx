import React, {useEffect, useRef, useState} from 'react';
import Hls from 'hls.js';
import {getToken, subscribe} from "../../../common/ApiService";

export default function HlsPlayer({ videoUrl }) {
    const videoRef = useRef(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        let mounted = true;
        getToken().then(t => {
            if (mounted && t) {
                setToken(t);
            }
        });

        const unsubscribe = subscribe(newToken => {
            setToken(newToken);
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!token || !videoRef.current) return;

        let hls= null;

        if (Hls.isSupported()) {
            hls = new Hls({
                xhrSetup: (xhr) => {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            });

            hls.loadSource(videoUrl);
            hls.attachMedia(videoRef.current);

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data?.response?.code === 401) {
                    // Optionally, force a token refresh or reload
                }
            });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = videoUrl;
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [token, videoUrl]);

    return <video ref={videoRef} controls className="w-[640px] h-[360px] max-w-[90vw] max-h-[80vh]" />;
};
