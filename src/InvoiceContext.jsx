import { createContext, useContext, useState } from "react";

const InvoiceContext = createContext();

export const useInvoiceContext = () => useContext(InvoiceContext);

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState(1);

  const createInvoice = (invoice) => {
    setInvoices((prev) => [...prev, invoice]);
    setNextInvoiceNumber((prev) => prev + 1);
  };

  const updateInvoice = (updatedInvoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.Id === updatedInvoice.Id ? updatedInvoice : inv))
    );
  };

  const getInvoiceById = (id) => {
    return invoices.find((invoice) => invoice.Id === id) || null;
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        createInvoice,
        updateInvoice,
        getInvoiceById,
        nextInvoiceNumber,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
