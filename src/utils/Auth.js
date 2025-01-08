import {
  useState,
  createContext,
  useContext,
  useEffect,
  Component,
} from "react";
import PathUrl from "../GlobalVariable/urlPath.json";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  //props will be children

  //in app component wrap the entire component tree with AuthProvider
  const [user, setUser] = useState(null);
  const [appPermissions, setAppPermissions] = useState([]);

  /*
  TODO:  Access-app Type presently has three type of accessess like

  MALL-LOCKERS  -> for mall locker terminals
  STATION-LOCKERS -> for accessing railway station terminals
  TEMPLE-LOCKERS  -> for accessing temple terminal lockers

  */

  const [accessAppType, setAccessAppType] = useState("MALL-LOCKERS");

  const [mallAuthUser, setMallAuthUser] = useState({
    userName: null,
    siteName: null,
    siteLocation: null,
  });

  const [permissions, setPermissions] = useState({
    allPermissions: [],
    userPermissions: [],
  });

  // const navigate = useNavigate()

  const [serverPaths, setServePaths] = useState({
    serverUrl:
      accessAppType === "TEMPLE-LOCKERS"
        ? PathUrl.templeServerUrl
        : accessAppType === "STATION-LOCKERS"
        ? PathUrl.stationServerUrl
        : PathUrl.serverUrl,
    localAdminPath:
      accessAppType === "TEMPLE-LOCKERS"
        ? PathUrl.templeLocalServerPath
        : accessAppType === "STATION-LOCKERS"
        ? PathUrl.stationLocalServerPath
        : PathUrl.localServerPath,
  });

  useEffect(() => {
    setServePaths({
      serverUrl:
        accessAppType === "TEMPLE-LOCKERS"
          ? PathUrl.templeServerUrl
          : accessAppType === "STATION-LOCKERS"
          ? PathUrl.stationServerUrl
          : PathUrl.serverUrl,
      localAdminPath:
        accessAppType === "TEMPLE-LOCKERS"
          ? PathUrl.templeLocalServerPath
          : accessAppType === "STATION-LOCKERS"
          ? PathUrl.stationLocalServerPath
          : PathUrl.localServerPath,
    });
  }, [accessAppType]);

  const loginHandler = (user, allPerm, userPerm) => {
    setUser(user);
    setPermissions({
      ...permissions,
      allPermissions: allPerm[0],
      userPermissions: userPerm[0],
    });

    localStorage.setItem("userName", user);
  };

  // const url = "http://192.168.0.198:8080/AuroAutoLocker/FetchUserLoginDetails";
  const logouUser = () => {
    fetch(PathUrl.localServerPath + "FetchUserLoginDetails?userName=" + user, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      // .then((resp) => resp.json())
      // .then((data) => {
      //   console.log(data);
      // })

      .catch((err) => console.log("err : " + err));
  };

  const removeLoggedInUSer = (usr) => {
    fetch(PathUrl.localServerPath + "FetchUserLoginDetails?userName=" + usr, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      // .then((resp) => resp.json())
      // .then((data) => {
      //   console.log(data);
      // })
      .catch((err) => console.log("err : " + err));
  };

  const logoutHandler = () => {
    localStorage.removeItem("userName", user);
    logouUser();
    setUser(null);
  };

  const mallAuthLogin = (userName, siteName, siteLocatn) => {
    setMallAuthUser({
      userName: userName,
      siteName: siteName,
      siteLocation: siteLocatn,
    });
    setUser(userName);
  };

  const mallAuthLogout = () => {
    console.log("triggered");
    logouUser();
    localStorage.removeItem("userName", user);

    setUser(null);
    setMallAuthUser({
      userName: null,
      terminalId: null,
    });
  };

  const handleAccessAppType = (type) => {
    setAccessAppType(type);
  };

  const handleAppPermissions = (appPermission) => {
    console.log(appPermission);

    setAppPermissions(appPermission);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        loginHandler,
        logoutHandler,
        removeLoggedInUSer,
        mallAuthUser,
        mallAuthLogin,
        mallAuthLogout,
        handleAccessAppType,
        accessAppType,
        serverPaths,
        handleAppPermissions,
        appPermissions
      }}
    >
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// for class components
export const classUseAuth = (Component) => {
  return function Wrapper(props) {
    const auth = useAuth();
    return <Component {...props} auth={auth} />;
  };
};
