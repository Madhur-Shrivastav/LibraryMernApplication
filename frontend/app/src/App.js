import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-in" element={<Signin />}></Route>
        <Route path="/sign-up" element={<Signup />}></Route>
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />}></Route>
        <Route path="listing/:listingid" element={<Listing></Listing>}></Route>
        <Route element={<PrivateRoute></PrivateRoute>}>
          <Route path="/profile" element={<Profile></Profile>}></Route>
          <Route
            path="/create"
            element={<CreateListing></CreateListing>}
          ></Route>
          <Route
            path="/update/:listingid"
            element={<UpdateListing></UpdateListing>}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
