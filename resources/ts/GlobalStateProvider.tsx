import React, { createContext, useContext, useState } from "react";
import { Status, ResultData } from "./types";

type GlobalStateType = {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;

    currentSite: string;
    setCurrentSite: React.Dispatch<React.SetStateAction<string>>;

    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;

    status: Status;
    setStatus: React.Dispatch<React.SetStateAction<Status>>;

    apiPid: number | null;
    setApiPid: React.Dispatch<React.SetStateAction<number | null>>;

    abortController: AbortController | null;
    setAbortController: React.Dispatch<React.SetStateAction<AbortController | null>>;

    resData: ResultData | null;
    setResData: React.Dispatch<React.SetStateAction<ResultData | null>>;

    completedBatches: number;
    setCompletedBatches: React.Dispatch<React.SetStateAction<number>>;

    totalBatches: number;
    setTotalBatches: React.Dispatch<React.SetStateAction<number>>;

    testing: boolean;
    setTesting: React.Dispatch<React.SetStateAction<boolean>>;
};

// Create context
const GlobalStateContext = createContext<GlobalStateType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [input, setInput] = useState("");
    const [currentSite, setCurrentSite] = useState("");

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<Status>("pending");

    const [apiPid, setApiPid] = useState<number | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const [resData, setResData] = useState<ResultData | null>(null);

    const [completedBatches, setCompletedBatches] = useState(0);
    const [totalBatches, setTotalBatches] = useState(0);

    const [testing, setTesting] = useState(true);

    return (
        <GlobalStateContext.Provider
            value={{
                input, setInput,
                currentSite, setCurrentSite,
                loading, setLoading,
                status, setStatus,
                apiPid, setApiPid,
                abortController, setAbortController,
                resData, setResData,
                completedBatches, setCompletedBatches,
                totalBatches, setTotalBatches,
                testing, setTesting
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    );
};

// Hook to use global state
export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("useGlobalState must be used within a GlobalStateProvider");
    }
    return context;
};