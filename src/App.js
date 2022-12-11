import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Provider} from "react-redux";
import NavigationBar from "./navigation-bar";
import Home from "./home";
import Register from "./register";
import Login from "./login";
import Profile from "./profile";
import EditProfile from "./edit-profile";
import Search from "./search";
import Detail from "./detail-screen";
import {configureStore} from "@reduxjs/toolkit";
import usersReducer from "./reducers/users-reducer";
import profileReducer from "./reducers/profile-reducer";
import CoinDataReducer from "./reducers/coin-data-reducer";
import CoinMarketChartReducer from "./reducers/coin-market-chart-reducer";
import GeneralCommentsReducer from "./reducers/comment-reducer"
import CurrentUser from "./users/current-user";
import WatchlistReducer from "./reducers/watchlist-reducer";
import HomeReducer from "./reducers/home-reducer";
import ProtectedRoute from "./login/protected-route";
import PublicProfile from "./public-profile";
import FollowReducer from "./reducers/follow-reducer";
import BlogListScreen from "./blog-list-screen";
import SearchReducer from "./reducers/search-reducer";

const store = configureStore({
                                 reducer: {
                                     users: usersReducer,
                                     profile: profileReducer,
                                     coinData: CoinDataReducer,
                                     coinMarketChart: CoinMarketChartReducer,
                                     watchlist: WatchlistReducer,
                                     coins: HomeReducer,
                                     comments: GeneralCommentsReducer,
                                     follow: FollowReducer,
                                     resList: SearchReducer,
                                 }
                             });

function App() {
    return (
        <Provider store={store}>
            <CurrentUser>
                <BrowserRouter>
                    <NavigationBar/>
                    <div className={'container-fluid'}>
                        <Routes>
                            <Route index
                                   element={<Home/>}/>
                            <Route path={'/profile'}
                                   element={
                                       <ProtectedRoute>
                                           <Profile/>
                                       </ProtectedRoute>
                                   }/>
                            <Route path={'/profile/:uid'}
                                   element={<PublicProfile/>}/>
                            <Route path={'/profile/edit-profile'}
                                   element={<EditProfile/>}/>
                            <Route path={"/search"}
                                   element={<Search/>}/>
                            <Route path={"/detail/*"}
                                   element={<Detail/>}/>
                            <Route path={"/login"}
                                   element={<Login/>}/>
                            <Route path={"/register"}
                                   element={<Register/>}/>
                            <Route path={"/blog"}
                                   element={<BlogListScreen/>}/>
                        </Routes>
                    </div>
                </BrowserRouter>
            </CurrentUser>
        </Provider>
    );
}

export default App;