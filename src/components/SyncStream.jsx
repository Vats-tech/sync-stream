import { useState, useEffect } from "react";

const SyncStream = () => {
  /**
   * Boolean value to determine if internet is available or not.
   */
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  /**
   * Array to hold buffer of api request.
   */
  const [buffer, setBuffer] = useState([]);

  /**
   *  Listen for online and offline events
   */
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      sendBufferedRequests();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /**
   * Handle api call.
   * Make the api if mode is online else buffer the request.
   */
  const hitEndpoint = async () => {
    const request = {
      url: "https://webhook.site/6553b826-b49b-47ae-9b6a-c924a0c506af",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timestamp: new Date().toISOString() }),
    };

    if (isOnline) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body,
          mode: "no-cors",
        });
        console.log("Request sent");
      } catch (error) {
        console.error("Failed to send request:", error);
      }
    } else {
      bufferRequest(request);
    }
  };

  /**
   * Function to buffer the request
   * @param {object} request
   */
  const bufferRequest = (request) => {
    const updatedBuffer = [...buffer, request];
    setBuffer(updatedBuffer);
    localStorage.setItem("requestBuffer", JSON.stringify(updatedBuffer));
    console.log("Request buffered");
  };

  /**
   * Function to send buffered requests
   */
  const sendBufferedRequests = async () => {
    const bufferedRequests =
      JSON.parse(localStorage.getItem("requestBuffer")) || [];
    for (const request of bufferedRequests) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });
        console.log("Buffered request sent");
      } catch (error) {
        console.error("Failed to send buffered request:", error);
      }
    }
    // Clear the buffer
    localStorage.removeItem("requestBuffer");
    setBuffer([]);
  };

  return (
    <div className="sync-stream-container">
      <button className="sync-stream-button" onClick={hitEndpoint}>
        Hit Me
      </button>
    </div>
  );
};

export default SyncStream;
