import React from "react";
import MallAuthNav from "./MallAuthNav";
import { Button, ButtonGroup, colors } from "@mui/material";
import { useState } from "react";
import MallAuthHist from "./MallAuthHist";
import MallAuthActive from "./MallAuthActive";
import { useAuth } from "../utils/Auth";
import { useEffect } from "react";

const MallAuth = () => {
  const [activeButtonName, setActiveButtonName] = useState("");

  const [siteDetails, setSiteDetails] = useState({
    siteName: "",
    siteLocation: "",
  });
  const Auth = useAuth();

  useEffect(() => {
    setSiteDetails({
      siteName: Auth.mallAuthUser.siteName,
      siteLocation: Auth.mallAuthUser.siteLocation,
    });
  }, []);

  const onActiveBtnClickHandler = (val) => {
    setActiveButtonName(val);
  };
  return (
    <>
      <MallAuthNav />

      <div className="mall-auth-container">
        <ButtonGroup variant="contained" aria-label="outlined button group">
          <Button
            onClick={() => onActiveBtnClickHandler("current")}
            color={activeButtonName === "current" ? "warning" : "inherit"}
          >
            Transaction History{" "}
          </Button>
          <Button
            onClick={() => onActiveBtnClickHandler("history")}
            color={activeButtonName === "history" ? "warning" : "inherit"}
          >
            Current Transaction
          </Button>
        </ButtonGroup>

        {activeButtonName === "current" ? (
          <div>
            <MallAuthHist
              siteName={siteDetails.siteName}
              siteLocation={siteDetails.siteLocation}
            />


          </div>
        ) : activeButtonName === "history" ? (
          <MallAuthActive
            siteName={siteDetails.siteName}
            siteLocation={siteDetails.siteLocation}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default MallAuth;
