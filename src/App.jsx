import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InvoiceList from "./InvoiceList";
import InvoiceCreateEdit from "./InvoiceCreateEdit";
import { InvoiceProvider } from "./InvoiceContext";

const App = () => {
  return (
    <InvoiceProvider>
      <Router>
        <Routes>
          <Route path="*" element={<InvoiceList />} />
          <Route path="/invoice/create" element={<InvoiceCreateEdit />} />
          <Route path="/invoice/edit/:id" element={<InvoiceCreateEdit />} />
        </Routes>
      </Router>
    </InvoiceProvider>
  );
};

export default App;
