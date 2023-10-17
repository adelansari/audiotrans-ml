import { AudioManager } from "./components/AudioManager";
import Transcript from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";

function App() {
    const transcriber = useTranscriber();

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='container flex flex-col justify-center items-center'>
                <h1 className='text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl text-center'>
                    Audio<span className='text-orange-400 bold'>Trans</span>
                </h1>
                <h2 className='mt-3 mb-5 px-4 text-center text-1xl font-semibold tracking-tight text-slate-900 sm:text-2xl pb-4'>
                    Speach recognition & transcription using ML.
                </h2>
                <AudioManager transcriber={transcriber} />
                <Transcript transcribedData={transcriber.output} />
            </div>

            <div className='absolute bottom-4'>
                Github{" "}
                <a
                    className='text-orange-400'
                    href='https://github.com/adelansari/audiotrans-ml'
                >
                    <span className='text-orange-600 cursor-pointer hover:text-green-600 duration-200 bold'>
                        Repository
                    </span>
                </a>
            </div>
        </div>
    );
}

export default App;
