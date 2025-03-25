import Layout from "./Layout/Layout";
import { AppRoutes } from "./Routes/AppRoutes";


const App = () => {
  return (
    <div>
      <Layout children={<AppRoutes />}/>
    </div>
  );
};

export default App;