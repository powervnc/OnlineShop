import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Home from "./pages/Home";
import HomeScrolling from "./pages/HomeScrolling";
import Info from "./pages/Info";
import ProducersPage from "./pages/ProducersPage";
import UserForm from "./pages/LoginSignup/UserForm";
import UsersPage from "./pages/UsersPage";
import { ProducerProvider } from "./Contexts/ContextProducer";
import { HealthProvider } from "./Contexts/ContextHealth";
import { SupplyProvider } from "./Contexts/ContextSupply";
import { UserProvider } from "./Contexts/ContextUser";
import { MainGamesPage } from "./pages/GamePages/MainGamesPage";
import SlotMachine from "./Games/Slots/SlotMachine";
import HangmanGame from "./Games/Hangman/HangmanGame";
import MemoryGame from "./Games/MemoryCard/MemoryGame";
import ResetPasswordForm from "./pages/LoginSignup/ResetPasswordForm";
// import { BackgroundGradientAnimationDemo } from "./BackgroundGradientAnimationDemo";

function App() {
  return (
    <BrowserRouter>
      <HealthProvider>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<UserForm></UserForm>} />
          </Route>
          <Route path="/reset-password" element={<ResetPasswordForm/>}></Route>
         
          {/* <Route
            path="/app"
            element={
              <ProducerProvider>
                <Home></Home>
              </ProducerProvider>
            }
          ></Route>
          <Route path="/producers" element={
            <ProducerProvider>
            <ProducersPage></ProducersPage>
            </ProducerProvider>} /> */}
          <Route
            path="/app/*"
            element={
              <UserProvider>
              <ProducerProvider>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <SupplyProvider>
                        <Home />
                      </SupplyProvider>
                    }
                  />
                  <Route path="/producers" element={<ProducersPage />} />
                  <Route
                    path="/infiniteScroll"
                    element={
                      <SupplyProvider>
                        <HomeScrolling></HomeScrolling>
                      </SupplyProvider>
                    }
                  ></Route>
                  <Route path="/element/:idSupply" element={<Info />} />
                
                  <Route path="/users" element={<UsersPage></UsersPage>}></Route>
                  <Route path="/games">
                      <Route index element={<MainGamesPage />}></Route>
                      <Route path="/games/slots" element={<SlotMachine  amountOfSlots={4}/>}></Route>
                      <Route path="/games/hangman" element={<HangmanGame></HangmanGame>}></Route>
                      <Route path="/games/memoryGame" element={<MemoryGame/>}></Route>
                     
                  </Route>
                </Routes>
              </ProducerProvider>
              </UserProvider>
            }
          />
         
          <Route path="*" element={<NoPage></NoPage>}></Route>
        </Routes>
      </HealthProvider>
    </BrowserRouter>
  );
}

export default App;
