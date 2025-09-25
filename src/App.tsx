import "./App.css";
import { Layout } from "./components/Layout";
import Form from "./components/Form";



function App() {
  return (
    <div>
      <Layout>
        <span className="text-center text-black text-2xl font-fjalla">Inicio de sesión</span>
      </Layout>
      <Form />
    </div>
  );
}
export default App;
