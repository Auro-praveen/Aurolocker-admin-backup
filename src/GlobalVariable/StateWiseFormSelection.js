import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import NativeSelect from "@mui/material/NativeSelect";
import { FormControl, InputLabel } from "@mui/material";
import { commonApiForGetConenction } from "./GlobalModule";
import UrlPath from "./urlPath.json";
import { useAuth } from "../utils/Auth";

const StateWiseFormSelection = (props) => {
  const [allStates, setAllStates] = useState([]);

  const [selectedState, setSelectedState] = useState();

  const Auth = useAuth();

  useEffect(() => {
    getStatesOfTerminals();
    console.log("inside");
    console.log("inside");
    console.log("inside");
    console.log("inside");
  }, []);

  useEffect(() => {
    getStatesOfTerminals();

    console.log(Auth.serverPaths.localAdminPath);
    
    console.log("inside auth access type here here");
    
    console.log(Auth.accessAppType);
  }, [Auth.accessAppType]);

  const getStatesOfTerminals = async () => {
    const respData = await commonApiForGetConenction(
      Auth.serverPaths.localAdminPath + "FetchStates?value=states"
    );

    console.log(respData);
    const states = respData.state;

    setAllStates(states);

    if (states.length > 0) {
      props.onStateChangeCallback(states[0]);
    }
  };

  const terminalStateWiseHandler = (e) => {
    setSelectedState(e.target.value);
    props.onStateChangeCallback(e.target.value);
  };

  return (
    <div className="terminal-id-drop-container">
      <Box>
        <FormControl
          sx={{
            m: 1,
            width: 300,
            textAlign: "center",
          }}
          focused
        >
          <InputLabel
            variant="standard"
            color="info"
            htmlFor="uncontrolled-native"
          >
            Choose State
          </InputLabel>
          <NativeSelect
            defaultValue={30}
            variant="outlined"
            color="success"
            inputProps={{
              name: "Choose State",
              id: "uncontrolled-native",
            }}
            value={selectedState}
            onChange={(e) => terminalStateWiseHandler(e)}
          >
            {allStates.map((state, index) => (
              <option className={"states-container"} value={state} key={index}>
                {state}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </Box>
    </div>
  );
};

export default StateWiseFormSelection;
