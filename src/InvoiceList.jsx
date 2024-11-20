import { Box, Button, Grid, Typography } from "@mui/material";
import { useInvoiceContext } from "./InvoiceContext";
import { Link } from "react-router-dom";

const InvoiceList = () => {
  const { invoices } = useInvoiceContext();

  return (
    <Box p={3}>
      <Typography variant="h4">Invoices List</Typography>

      <Link to="/invoice/create" style={{ textDecoration: "none" }}>
        <Button variant="contained" sx={{ marginTop: 2 }}>
          Create Invoice
        </Button>
      </Link>

      {invoices.length === 0 ? (
        <Typography>No invoices available.</Typography>
      ) : (
        <Grid container spacing={2}>
          {invoices.map((invoice) => (
            <Grid item xs={12} sm={6} md={4} key={invoice.Id}>
              <Box
              >
                <Typography variant="h6">
                  Invoice #: {invoice.InvoiceNumber}
                </Typography>
                <Typography>Customer: {invoice.CustomerName}</Typography>
                <Typography>
                  Billing Address: {invoice.BillingAddress}
                </Typography>
                <Typography>
                  Shipping Address: {invoice.ShippingAddress}
                </Typography>
                <Typography>GSTIN: {invoice.GSTIN}</Typography>
                <Typography>Total Amount: {invoice.TotalAmount}</Typography>

                <Link
                  to={`/invoice/edit/${invoice.Id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="outlined" sx={{ marginTop: 2 }}>
                    Edit
                  </Button>
                </Link>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default InvoiceList;
