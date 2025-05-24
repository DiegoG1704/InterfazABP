
import { useNavigate, useLocation } from "react-router-dom";
import GuestRouter from "./Page/router/GuestRouter.jsx";
import PrivateRoute from "./Page/router/PrivateRoute.jsx";
import "../node_modules/primeflex/primeflex.css";
import { history } from "./helper/history.js";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/Loader/Loader.jsx";
import Spinner from "./components/Spinner/Spinner.jsx";
// import { getAxiosInstance } from "./helper/http-common.js";
// import AxiosServices from "./helper/http-common.js";


function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  history.navigate = useNavigate();
  history.location = useLocation();
  // const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isLogged);

  const loading = useSelector((state) => state.ui.globalLoading);
  const secondaryLoading = useSelector((state) => state.ui.secondaryLoading);





  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");

  //   if (token) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false);
  //     navigate("/"); // Redirige al login si no está autenticado
  //   }
  // }, [navigate]);
  // console.log("isAuthenticated", isAuthenticated);

  return (<>
    <Loader isLoading={loading}/>
    <Spinner isVisible={secondaryLoading}/>
    {isAuthenticated ? (
      <PrivateRoute />

    ) : (
      <GuestRouter />
    )}

  </>)
}

export default App;
