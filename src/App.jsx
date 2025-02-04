import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import "./App.css";
function App() {
  return (
    <>
      <div className="grid-container">
        <Header></Header>
        <Main></Main>
        <Footer></Footer>
      </div>
    </>
  );
}
export default App;
