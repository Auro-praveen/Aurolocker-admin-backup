import PathUrl from "./urlPath.json";

const lockopenMobileNumber = "0099009900";

// const localServerPathForGlobalConnection =
//   "http://192.168.0.198:8080/AuroAutoLocker/";

async function getUrlPaths(typeOfServer, appType) {
  if (typeOfServer === "ADMIN_SERVER") {
    const localServerPathForGlobalConnection =
      appType === "TEMPLE-LOCKERS"
        ? PathUrl.templeLocalServerPath
        : appType === "STATION-LOCKERS"
        ? PathUrl.stationLocalServerPath
        : PathUrl.localServerPath;
    return localServerPathForGlobalConnection;
  } else if (typeOfServer === "MAIN_SERVER") {
    const mainAppServer =
      appType === "TEMPLE-LOCKERS"
        ? PathUrl.templeServerUrl
        : appType === "STATION-LOCKERS"
        ? PathUrl.stationServerUrl
        : PathUrl.serverUrl;
    return mainAppServer;
  }
}

const lockerDaysType = ["WeekDay", "WeekEnd"];
const lockerCategories = ["Small", "Medium", "Large", "eLarge"];
const timeSlot = [1, 1, 3, 5, 8, 12];

// const [serverPaths, setServePaths] = useState({
//   serverUrl: Auth.accessAppType === "TEMPLE-LOCKERS" ? PathUrl.templeServerUrl : Auth.accessAppType === "STATION-LOCKERS" ? PathUrl.stationServerUrl : PathUrl.serverUrl,
//   localAdminPath: Auth.accessAppType === "TEMPLE-LOCKERS" ? PathUrl.templeLocalServerPath : Auth.accessAppType === "STATION-LOCKERS" ? PathUrl.stationLocalServerPath : PathUrl.localServerPath
// })

// praveen march 5 - 2024
async function commonApiForPostConenction(path, payload, appType) {
  const adminServerPath = await getUrlPaths("ADMIN_SERVER", appType);

  if (adminServerPath) {
    try {
      const response = await fetch(adminServerPath + path, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error : " + error);
      throw error;
    }
  } else {
    alert("error getting url contact admin");
  }
}

const commonApiForGetConenction = async (path) => {
  try {
    console.log("called here in global module get operation");

    const response = await fetch(path);
    let data = null;

    if (response != null) {
      data = response.json();
    }
    // const
    // console.log(data);
    return data;
  } catch (error) {
    console.log("Error is : " + error);
    throw error;
  }
};

// url for communcation with main server

async function commonApiForPostConenctionServer(payload, appType) {
  const mainAppServer = await getUrlPaths("MAIN_SERVER", appType);

  if (mainAppServer) {
    try {
      const response = await fetch(mainAppServer, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error : " + error);
      throw error;
    }
  } else {
    alert("error fetching valid url contact admin");
  }
}

export { lockopenMobileNumber };

export {
  commonApiForPostConenction,
  commonApiForGetConenction,
  lockerDaysType,
  lockerCategories,
  timeSlot,
  commonApiForPostConenctionServer,
};
