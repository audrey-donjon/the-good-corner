import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { PageLayout } from "./components/Layout";
import { AdPage } from "./pages/Ad";
import { AdEditorPage } from "./pages/AdEditor";
import { CategoryPage } from "./pages/Category";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery } from "@apollo/client";
import { SigninPage } from "./pages/Signin";
import { SignupPage } from "./pages/Signup";
import { queryWhoami } from "./api/whoiam";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

enum AuthState {
  authenticated,
  unauthenticated,
}

function checkAuth(Component: React.FC, authStates:AuthState[], redirectTo: string = "/"){
  // Component function
  return function(){
    const { data: whoamiData } = useQuery(queryWhoami);
    const me = whoamiData?.whoami;
    if(me === undefined){
      return <div>Loading...</div>;
    }

    if(
      (me === null && authStates.includes(AuthState.unauthenticated)) ||
      (me === authStates.includes(AuthState.authenticated))
    ){
      return <Component />;
    }

    return <Navigate to={redirectTo} replace/>;
  }
}

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route Component={PageLayout}>
            <Route path="/" Component={HomePage} />
            <Route path="/signin" Component={checkAuth(SigninPage, [AuthState.unauthenticated])} />
            <Route path="/signup" Component={checkAuth(SignupPage, [AuthState.unauthenticated])} />
            <Route path="/categories/:id" Component={CategoryPage} />
            <Route path="/ads/:id" Component={AdPage} />
            <Route path="/ads/:id/edit" Component={checkAuth(AdEditorPage, [AuthState.authenticated])} />
            <Route path="/ads/new" Component={checkAuth(AdEditorPage, [AuthState.authenticated])} />
            <Route path="/about" Component={AboutPage} />
            <Route path="*" Component={() => <Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
