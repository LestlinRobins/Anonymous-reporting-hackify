import "./App.css";
import SendMessage from "./components/SendMessage";

function App() {
  return (
    <>
      <div className="AppHeader">
        <img
          src="https://supabase.io/new/images/brand-assets/logo-light.svg"
          alt="Supabase logo"
        />
        <h1>Anonymous Reporting</h1>
        <p>Report a message anonymously</p>
      </div>
      <div className="AppMessageInputHolder">
        <SendMessage />
      </div>
    </>
  );
}

export default App;
