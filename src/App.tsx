import { AudioManager } from "./components/AudioManager";
import Theme from "./components/Theme";
import Transcript from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";

function App() {
    const transcriber = useTranscriber();

    return (
        <div>
            <Theme />
            <div className='flex justify-center flex-col items-center min-h-screen dark:bg-gray-900'>
                <div className='container flex flex-col justify-center items-center mt-2'>
                    <div className='  dark:text-white'>
                        <h1 className='text-5xl font-extrabold tracking-tight dark:text-white text-slate-900 sm:text-7xl text-center'>
                            Audio
                            <span className='text-orange-400 bold'>Trans</span>
                        </h1>
                        <h2 className='mt-3 mb-5 px-4 text-center text-1xl font-semibold tracking-tight dark:text-white text-slate-900 sm:text-2xl pb-4'>
                            Speach recognition & transcription using ML.
                        </h2>
                    </div>
                    <AudioManager transcriber={transcriber} />
                    <Transcript transcribedData={transcriber.output} />
                </div>

                <div className='relative bottom-4 dark:text-white font-bold'>
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
        </div>
    );
}

export default App;
