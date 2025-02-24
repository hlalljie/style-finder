// External Imports
import { JSX } from "react";
import chroma from 'chroma-js';
import { Loader2, Square } from 'lucide-react'

//Internal Imports
import { useGlobalState } from "@/GlobalStateProvider";
import { ColorData, FontData } from "./types";
import { useSearch } from "@/hooks/useSearch";


const Home = (): JSX.Element => {

    const { resData, loading, apiPid } = useGlobalState();

    return (
        <div id='main' className="background-gradient animate-gradient-x-slow relative h-screen grid grid-rows-[auto_1fr_auto]" >
            <section id='header' className="p-3">
                <h1>Style Finder</h1>
            </section>
            {(!resData) ?
                <section id='content-container' className="max-w-md mt-[30vh]">
                    {
                        loading ? <Loading /> :
                            <h2 id="intro" className='text-center heading-gradient'>Search a website for its brand colors and fonts.</h2>
                    }


                </section> :
                <section id='content-container' className="pt-10 max-w-2xl w-full">
                    {resData ? <ResultsDisplay /> : null}
                    {loading && <Loading withContent />}
                </section>

            }
            {apiPid ? <StopButton /> : null}
            <InputContainer />
        </div >
    );
};

const Loading = ({ withContent }: { withContent?: boolean }): JSX.Element => {

    const { currentSite, status, completedBatches, totalBatches } = useGlobalState();

    // Set status message
    let message = "";
    switch (status) {
        default:
            console.log("Uknown status:", status);
        case "pending":
            message = "Starting to find site content for";
            break;
        case "validating":
            message = "Validating";
            break;
        case "scraping":
            message = "Scraping site content for";
            break;
        case "parsing":
            message = "Parsing site content for";
            break;
        case "done":
            message = "Completed finding site content for";
            break;
        case "error":
            message = "Error finding site content for";
            break;
        case "timeout":
            message = "Timeout finding site content for";
            break;

    }
    return <div id="loading-container" className="text-center">
        {<h3 className={"heading-gradient mb-4" + (withContent ? " mt-10" : "")}>{message} {currentSite} {status === "parsing" && (
            <>
                <br />
                {`(${completedBatches}/${totalBatches} batches done)`}
            </>
        )}</h3>}
        <svg
            className="animate-spin mx-auto"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" />
                    <stop offset="100%" />
                </linearGradient>
            </defs>
            <Loader2 stroke="url(#loader-gradient)" strokeWidth="2" />

        </svg>

    </div>;
};

const StopButton = (): JSX.Element => {

    const { handleStop } = useSearch();

    return (
        <Square onClick={handleStop} className="cursor-pointer hover:text-red-500 transition-colors absolute p7 bottom-10 left-7" />
    );
}

const InputContainer = (): JSX.Element => {

    const { input, setInput } = useGlobalState();
    const { handleSearch } = useSearch();

    return (
        <section id='input-container' className="w-full ">
            <div id='input ' className="mx-auto w-screen p-7 flex justify-center">
                <input
                    className="flex-1 rounded-tl-sm rounded-bl-sm max-w-sm bg-inputcolor px-4 py-2 text-lg focus:outline-none"
                    type="text"
                    placeholder="Enter a website URL"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                ></input>
                <button id='search' className={
                    (input != "" ? 'bg-inputreadycolor ' : 'bg-inputbtncolor ') + 'rounded-tr-sm rounded-br-sm px-4 py-2 text-lg text-gray-200 hover:text-white'} onClick={handleSearch}
                >
                    <a className={input != "" ? "heading-gradient" : ""}>Search</a>
                </button>
            </div>
        </section >
    )
}

const ResultsDisplay = (): JSX.Element => {

    const { resData, loading } = useGlobalState();
    if (!resData) {
        return <></>;
    }

    return (
        <div className="resultsDisplay">
            {resData.error ? (
                !loading && (<ErrorDisplay error={resData.error}
                />)
            ) : resData.brandData ? (
                <DataDisplay />
            ) : (
                "No error and no data?!?"
            )}
        </div>
    );
};

const ErrorDisplay = ({ error }: { error: Error }): JSX.Element => {
    return (
        <div id="error-display" className="mt-[30vh]">
            <h3 className="text-center heading-gradient">{"Error: " + error.toString() + "."} < br /> Try Again</h3>
        </div>
    );
};

const DataDisplay = (): JSX.Element => {

    const { resData } = useGlobalState();

    if (!resData) {
        return <></>;
    }

    return (
        <div id="data-display">
            <h3 className="text-center">Website Styles for {resData.received}</h3>
            {resData.brandData!.colors && (
                <ColorDisplay colors={resData.brandData!.colors} />
            )}
            {resData.brandData!.fonts ? (
                <FontDisplay fonts={resData.brandData!.fonts} />
            ) : null}
            {resData.parsedData && (<ParsedDataDisplay parsedData={resData.parsedData} />)}

        </div>
    );
};

const ColorDisplay = ({ colors }: { colors: ColorData }): JSX.Element => {

    return (
        <div id="color-display" className="mt-10">
            <div id='color-container' className="flex flex-wrap justify-space-between gap-8">
                {Object.entries(colors).map((color) => (
                    <ColorPanel key={color[0]} color={color} />
                ))}
            </div>

        </div>
    );
};

const ColorPanel = ({ color }: { color: [string, string[]] }): JSX.Element => {
    const colorName = color[0];
    const colorLocs = color[1];
    const textColor = chroma(colorName).luminance() > 0.5 ? "black" : "white";
    return (
        <div
            id="color-panel"
            className="rounded-sm w-[calc(50%-1rem)] aspect-[2/1] flex flex-col items-center justify-center gap-2 p-5 text-center"
            style={{ backgroundColor: colorName }}
        >
            <h5 id="color-name" style={{ color: textColor }}>{colorName}</h5>
            <p style={{ color: textColor }}>{colorLocs.join(", ")}</p>
        </div >
    )
}

const FontDisplay = ({ fonts }: { fonts: FontData }): JSX.Element => {
    return (
        <div id="font-display" className="mt-10 text-left">
            <h3>Fonts:</h3>
            {Object.entries(fonts).map(([key, values]) => (
                <h4 key={key}>
                    <strong>{key}</strong> - {values.join(", ")}
                </h4>
            ))}

        </div>
    );
};

const ParsedDataDisplay = ({
    parsedData,
    visible
}: {
    parsedData: string;
    visible?: boolean;
}): JSX.Element => {
    return (
        <div id="parsed-data-container" className={visible ? "" : "hidden"}>
            <h3>All Parsed Data</h3>
            <p>{parsedData}</p>
        </div>
    );
};

export default Home;
