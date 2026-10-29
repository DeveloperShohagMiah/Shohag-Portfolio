
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import BlogDetails from "./pages/BlogDetails";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="blogs/:slug" element={<BlogDetails />} />
    </Routes>
  );
};

export default App;