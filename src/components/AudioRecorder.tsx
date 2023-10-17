import { useState, useEffect, useRef } from "react";

import { formatAudioTimestamp } from "../utils/AudioUtils";
import { webmFixDuration } from "../utils/BlobFix";

// A function that returns the supported MIME type for audio recording
function getMimeType() {
    const types = [
        "audio/webm",
        "audio/mp4",
        "audio/ogg",
        "audio/wav",
        "audio/aac",
        "audio/mp3",
    ];
    for (let i = 0; i < types.length; i++) {
        if (MediaRecorder.isTypeSupported(types[i])) {
            return types[i];
        }
    }
    return undefined;
}

// A component that records audio from the microphone and passes the blob to the parent component
export default function AudioRecorder(props: {
    onRecordingComplete: (blob: Blob) => void;
}) {
    // checks recording is in progress or not
    const [recording, setRecording] = useState(false);
    // storeing the duration of the recording in seconds
    const [duration, setDuration] = useState(0);
    // storing the recorded blob or null if not recorded yet
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

    // storing the media stream object from the microphone
    const streamRef = useRef<MediaStream | null>(null);
    // storing the media recorder object that handles the recording
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    // storing an array of blob chunks from the recording
    const chunksRef = useRef<Blob[]>([]);

    // storing the audio element that plays back the recorded blob
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const startRecording = async () => {
        // Reset recording (if any)
        setRecordedBlob(null);

        let startTime = Date.now();

        try {
            // If there is no stream object yet, request access to the microphone and get the stream object
            if (!streamRef.current) {
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
            }

            // Get the supported MIME type for audio recording
            const mimeType = getMimeType();
            // Create a new media recorder object with the stream and MIME type
            const mediaRecorder = new MediaRecorder(streamRef.current, {
                mimeType,
            });

            // Store the media recorder object in the ref variable
            mediaRecorderRef.current = mediaRecorder;

            // Add an event listener for when data is available from the recording
            mediaRecorder.addEventListener("dataavailable", async (event) => {
                // If there is some data in the event, push it to the chunks array
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
                // If the media recorder state is inactive, it means the recording has stopped
                if (mediaRecorder.state === "inactive") {
                    // Calculate the duration of the recording in milliseconds
                    const duration = Date.now() - startTime;

                    // Received a stop event
                    // Create a blob from the chunks array with the MIME type
                    let blob = new Blob(chunksRef.current, { type: mimeType });

                    // If the MIME type is webm, fix the duration metadata of the blob
                    if (mimeType === "audio/webm") {
                        blob = await webmFixDuration(blob, duration, blob.type);
                    }

                    setRecordedBlob(blob);
                    // Call the parent component's callback function with the blob
                    props.onRecordingComplete(blob);

                    // Reset the chunks array for future recordings
                    chunksRef.current = [];
                }
            });

            mediaRecorder.start();

            setRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    // A function that stops the recording process
    const stopRecording = () => {
        // If there is a media recorder object and its state is recording, stop it and set its state to inactive
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
        ) {
            mediaRecorderRef.current.stop(); // set state to inactive
            setDuration(0);
            setRecording(false);
        }
    };

    // A useEffect hook that runs when the recording state variable changes
    useEffect(() => {
        let stream: MediaStream | null = null;

        // If the recording state variable is true, start a timer that updates the duration state variable every second
        if (recording) {
            const timer = setInterval(() => {
                setDuration((prevDuration) => prevDuration + 1);
            }, 1000);

            // Return a cleanup function that clears the timer
            return () => {
                clearInterval(timer);
            };
        }

        // Return a cleanup function that stops the stream if it exists
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [recording]);

    // A function that handles the click event of the toggle recording button
    const handleToggleRecording = () => {
        // If the recording state variable is true, stop the recording, otherwise start the recording
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Return the JSX element that renders the audio recorder component
    return (
        <div className='flex flex-col justify-center items-center'>
            <button
                type='button'
                className={`m-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-200 ${
                    recording
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={handleToggleRecording}
            >
                {recording
                    ? `Stop Recording (${formatAudioTimestamp(duration)})`
                    : "Start Recording"}
            </button>

            {recordedBlob && (
                <audio className='w-full' ref={audioRef} controls>
                    <source
                        src={URL.createObjectURL(recordedBlob)}
                        type={recordedBlob.type}
                    />
                </audio>
            )}
        </div>
    );
}
