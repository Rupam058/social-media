import { Route, Router, Switch } from "wouter";
import Posts from "./views/Posts";
import Login from "./views/Login";
import { useHashLocation } from "wouter/use-hash-location";
import { AuthProvider } from "./context/auth";
import Navbar from "./components/layout/Navbar";
import Profile from "./views/Profile";
import Following from "./views/Following";

function App() {
    return (
        <AuthProvider>
            <div className="bg-gray-200 min-h-screen">
                <Router hook={useHashLocation}>
                    <Navbar />
                    <Switch>
                        <Route path={`/`} component={Posts} />
                        <Route path={`/login`} component={Login} />
                        <Route
                            path={`/profile/:username`}
                            component={Profile}
                        />
                        <Route path={`/following`} component={Following} />
                        <Route>404</Route>
                    </Switch>
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;
