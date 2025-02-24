import { useGlobalState } from "@/GlobalStateProvider";
import { StyleFinderResponse, Status, ResultData } from "@/types";

export const useSearch = () => {
    const { input, setInput, testing, setCurrentSite, setStatus, setLoading, abortController, setAbortController, apiPid, setApiPid, resData, setResData, completedBatches, setCompletedBatches, totalBatches, setTotalBatches } = useGlobalState();

    const handleSearch = () => {
        const apiAddress = "/api/find-styles";
        const testAddress = "/api/test";
        const fetchAddress = testing ? testAddress : apiAddress;

        const tempInput = input;
        setCurrentSite(tempInput);
        setStatus("pending");
        setLoading(true);
        setInput("");

        fetch(fetchAddress, {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: input, testNumber: 0, loadTime: 10 }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // TODO add type check for data to have id
                pollForUpdates(data.tracker.toString(), 1);
            });
    };

    // TODO: Correct past state issue in closure
    const pollForUpdates = (trackingId: string, interval: number = 5, timeout: number = 60) => {
        const apiAddress = "api/progress";
        const testAddress = "api/test/progress";
        const fetchAddress = (testing ? testAddress : apiAddress) + "/" + trackingId;

        // If there's an existing controller, polling is already running
        if (abortController) {
            console.log("Polling already in progress");
            return;
        }
        // otherwise create an new abort controller for the request
        const newController = new AbortController();
        setAbortController(newController);

        let lastUpdate = "";
        const poll = () => {

            // Check if cancelled
            fetch(fetchAddress, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: newController.signal
            })
                .then((response) => response.json())
                .then((result) => {
                    // TODO: add option to timeout
                    // Wait for request to finish
                    // Check if done

                    // Typecast data
                    const data = result as StyleFinderResponse;
                    if (data.done) {
                        setLoading(false);
                        setStatus("done"); // do explicitly so no race condition with cancellation
                        setApiPid(null);
                        // If there are results display them
                        if (data.results) {
                            console.log("Results complete:", data);
                            setResData(new ResultData(data.results));
                        }
                        setAbortController(null);

                    } else {
                        if (lastUpdate !== data.updated_at) {
                            lastUpdate = data.updated_at;
                            // Schedule next poll if not done
                            if (data.results) {
                                setResData(new ResultData(data.results));
                                console.log("Results updated:", data);
                            }
                            //
                            if (data.process_id !== undefined && data.process_id !== apiPid) {
                                setApiPid(data.process_id);
                                console.log("API PID updated:", data);
                            }
                            // check if status has changed
                            if (data.status !== status) {
                                setStatus(data.status as Status);
                                console.log("Status updated:", data);
                            }
                            // check if batches have changed
                            if (data.completed_batches !== completedBatches) {
                                setCompletedBatches(data.completed_batches);
                                console.log("Complete batches updated:", data);
                            }
                            // check if batches have changed
                            if (data.total_batches !== totalBatches) {
                                setTotalBatches(data.total_batches);
                                console.log("Total batches updated:", data);
                            }

                        }
                        setTimeout(poll, interval * 1000);
                    }
                }).catch(err => {
                    if (err.name === 'AbortError') {
                        console.log("Polling aborted");
                    } else {
                        console.error("Polling error:", err);
                    }
                    setAbortController(null);
                });;
        };

        // Start polling
        poll();

    }

    const handleStop = () => {

        // Stop loading and polling
        if (abortController) {
            abortController.abort();
            setAbortController(null);
        }
        setStatus("cancelled");
        setLoading(false);

        console.log("Cancelled");

        // Send stop request
        const apiAddress = "/api/stop";
        const testAddress = "/api/test/stop";
        console.log("Sending stop request to:", (testing ? testAddress : apiAddress) + "/" + apiPid);
        const fetchAddress = (testing ? testAddress : apiAddress) + "/" + apiPid;

        fetch(fetchAddress, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        setApiPid(null);
    }

    return { handleSearch, pollForUpdates, handleStop }
}