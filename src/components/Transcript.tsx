import { useRef, useEffect } from "react";

import { TranscriberData } from "../hooks/useTranscriber";
import { formatAudioTimestamp } from "../utils/AudioUtils";

interface Props {
    transcribedData: TranscriberData | undefined;
}

export default function Transcript({ transcribedData }: Props) {
    // A ref to access the div element
    const divRef = useRef<HTMLDivElement>(null);

    // A helper function to save a blob as a file
    const saveBlob = (blob: Blob, filename: string) => {
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        // Create a link element and set its attributes
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        // Click the link to trigger the download
        link.click();
        // Revoke the URL to free up memory
        URL.revokeObjectURL(url);
    };
    // A function to export the transcript as a TXT file
    const exportTXT = () => {
        // Get the chunks of transcribed data or an empty array
        let chunks = transcribedData?.chunks ?? [];
        // Join the text of each chunk and trim any whitespace
        let text = chunks
            .map((chunk) => chunk.text)
            .join("")
            .trim();

        // Create a blob with the text and the MIME type
        const blob = new Blob([text], { type: "text/plain" });
        // Save the blob as transcript.txt
        saveBlob(blob, "transcript.txt");
    };
    // A function to export the transcript as a JSON file
    const exportJSON = () => {
        // Stringify the chunks of transcribed data or an empty array with indentation
        let jsonData = JSON.stringify(transcribedData?.chunks ?? [], null, 2);

        // post-process the JSON to make it more readable
        const regex = /(    "timestamp": )\[\s+(\S+)\s+(\S+)\s+\]/gm;
        jsonData = jsonData.replace(regex, "$1[$2 $3]");

        // Create a blob with the JSON data and the MIME type
        const blob = new Blob([jsonData], { type: "application/json" });
        // Save the blob as transcript.json
        saveBlob(blob, "transcript.json");
    };

    // Scroll to the bottom when the component updates
    useEffect(() => {
        if (divRef.current) {
            // Calculate the difference between the div's height, scroll position and scroll height
            const diff = Math.abs(
                divRef.current.offsetHeight +
                    divRef.current.scrollTop -
                    divRef.current.scrollHeight,
            );

            if (diff <= 64) {
                // We're close enough to the bottom, so scroll to the bottom
                divRef.current.scrollTop = divRef.current.scrollHeight;
            }
        }
    });

    return (
        <div
            ref={divRef}
            className='w-full flex flex-col my-2 p-4 max-h-[20rem] overflow-y-auto'
        >
            {transcribedData &&
                transcribedData.chunks.map((chunk, i) => (
                    <div
                        key={`${i}-${chunk.text}`}
                        className='w-full flex flex-row mb-2 bg-white rounded-lg p-4 shadow-xl shadow-black/5 ring-1 ring-slate-700/10 dark:text-black'
                    >
                        <div className='mr-5'>
                            {/* Format and display the timestamp of each chunk */}
                            {formatAudioTimestamp(chunk.timestamp[0])}
                        </div>
                        {/* Display the text of each chunk */}
                        {chunk.text}
                    </div>
                ))}
            {transcribedData && !transcribedData.isBusy && (
                <div className='w-full text-right'>
                    {/* Display buttons to export the transcript as TXT or JSON files */}
                    <button
                        onClick={exportTXT}
                        className='text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:bg-indigo-500 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 inline-flex items-center'
                    >
                        Export TXT
                    </button>
                    <button
                        onClick={exportJSON}
                        className='text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 dark:text-black dark:bg-green-400 dark:hover:bg-green-600 dark:focus:ring-green-800 inline-flex items-center'
                    >
                        Export JSON
                    </button>
                </div>
            )}
        </div>
    );
}
