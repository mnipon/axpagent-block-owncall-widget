import React, { useState, useEffect } from "react";

import styles from "./Root.module.css";

function Root({ api, interactionId, clientDetails, getConfiguration }) {
  //End Call Timer (10 seconds)
  const endCallTimer = 10000;
  const [agentState, setAgentState] = useState(null);
  const [direction, setDirection] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const agentVoiceAddress =
    getConfiguration.userProfileDetailsList[0].defaultResource.address.match(
      /^(.*)@/
    )[1];

  // console.log("agent details is :", clientDetails);
  // console.log("api is :", api);
  // console.log("configuration is :", getConfiguration);
  // console.log("agent voice number is :", agentVoiceAddress);

  // useEffect to get agent state to fix issue with too many re-renders with api
  useEffect(() => {
    api.onDataEvent("onInteractionEvent", (data) => {
      // console.log("data is :", data);
      for (let i of Object.keys(data)) {
        if (i === "state") {
          setAgentState(data[i]);
        }
        if (i === "direction") {
          setDirection(data[i]);
        }
        if (i === "destinationAddress") {
          setDestinationAddress(data[i]);
        }
      }
    });
  }, [api]);

  useEffect(() => {
    if (destinationAddress === agentVoiceAddress && direction === "OUTGOING") {
      setAlertMessage("YOU ARE NOT ALLOWED TO CALL YOUR OWN NUMBER!!!");
      // End Interaction
      console.log(alertMessage);
      // Delay End Call for 10 seconds to let agent sees the notification message.  This part can be removed if required.
      const timer = setTimeout(() => {
        api.endInteraction(interactionId);
      }, endCallTimer);
      // Clean up the timer when component is unmounted
      return () => clearTimeout(timer);
    }
  }, [
    api,
    destinationAddress,
    agentState,
    interactionId,
    agentVoiceAddress,
    alertMessage,
    direction,
  ]);

  return (
    <div
      className={`${styles.container} ${
        alertMessage ? styles.flexContainer : styles.hiddenContainer
      }`}
    >
      <div className={styles.textAlert}>{alertMessage}</div>
    </div>
  );
}

export default Root;
