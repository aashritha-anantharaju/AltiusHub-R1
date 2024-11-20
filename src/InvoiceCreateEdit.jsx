import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { useInvoiceContext } from "./InvoiceContext";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate, useParams } from "react-router-dom";

const InvoiceCreateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createInvoice, updateInvoice, getInvoiceById, nextInvoiceNumber } =
    useInvoiceContext();

  const [form, setForm] = useState({
    Id: uuidv4(),
    Date: "",
    InvoiceNumber: nextInvoiceNumber,
    CustomerName: "",
    BillingAddress: "",
    ShippingAddress: "",
    GSTIN: "",
    Items: [{ Id: uuidv4(), itemName: "", quantity: 1, price: 0, amount: 0 }],
    BillSundrys: [{ Id: uuidv4(), billSundryName: "", amount: 0 }],
    TotalAmount: 0,
  });

  useEffect(() => {
    if (id) {
      const invoice = getInvoiceById(id);
      if (invoice) {
        setForm(invoice);
      } else {
        alert("Invoice not found!");
        navigate("/invoice/create");
      }
    }
  }, [id, getInvoiceById, navigate]);

  const validateForm = () => {
    if (!form.Date) return "Date is required.";
    if (new Date(form.Date) < new Date())
      return "Backdate entry is not allowed.";
    if (!form.CustomerName) return "Customer name is required.";
    if (!form.BillingAddress) return "Billing address is required.";
    if (!form.ShippingAddress) return "Shipping address is required.";
    if (!form.GSTIN) return "GSTIN is required.";
    if (form.Items.length === 0) return "At least one item is required.";

    const itemErrors = form.Items.some(
      (item) => !item.itemName || item.quantity <= 0 || item.price <= 0
    );
    if (itemErrors) return "Invalid items in the invoice.";

    return null;
  };

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      Items: [
        ...prev.Items,
        { Id: uuidv4(), itemName: "", quantity: 1, price: 0, amount: 0 },
      ],
    }));
  };

  const handleRemoveItem = (id) => {
    setForm((prev) => ({
      ...prev,
      Items: prev.Items.filter((item) => item.Id !== id),
    }));
  };

  const handleAddBillSundry = () => {
    setForm((prev) => ({
      ...prev,
      BillSundrys: [
        ...prev.BillSundrys,
        { Id: uuidv4(), billSundryName: "", amount: 0 },
      ],
    }));
  };

  const handleRemoveBillSundry = (id) => {
    setForm((prev) => ({
      ...prev,
      BillSundrys: prev.BillSundrys.filter((bill) => bill.Id !== id),
    }));
  };

  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const totalAmount =
      form.Items.reduce((sum, item) => sum + item.amount, 0) +
      form.BillSundrys.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);

    const invoiceData = { ...form, TotalAmount: totalAmount };

    if (id) {
      updateInvoice(invoiceData);
      alert("Invoice updated successfully!");
    } else {
      createInvoice(invoiceData);
      alert("Invoice created successfully!");
    }

    navigate("/invoice/list");
  };

  return (
    <Box p={3}>
      <Typography variant="h4">Create / Edit Invoice</Typography>

      <TextField
        fullWidth
        label="Invoice Date"
        type="date"
        value={form.Date}
        onChange={(e) => setForm({ ...form, Date: e.target.value })}
        InputLabelProps={{ shrink: true }}
        required
      />

      <TextField
        fullWidth
        label="Customer Name"
        value={form.CustomerName}
        onChange={(e) => setForm({ ...form, CustomerName: e.target.value })}
        required
      />

      <TextField
        fullWidth
        label="Billing Address"
        value={form.BillingAddress}
        onChange={(e) => setForm({ ...form, BillingAddress: e.target.value })}
        required
      />

      <TextField
        fullWidth
        label="Shipping Address"
        value={form.ShippingAddress}
        onChange={(e) => setForm({ ...form, ShippingAddress: e.target.value })}
        required
      />

      <TextField
        fullWidth
        label="GSTIN"
        value={form.GSTIN}
        onChange={(e) => setForm({ ...form, GSTIN: e.target.value })}
        required
      />

      <Typography variant="h6">Items</Typography>
      {form.Items.map((item, index) => (
        <Grid container spacing={2} key={item.Id} alignItems="center">
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Item Name"
              value={item.itemName}
              onChange={(e) =>
                setForm((prev) => {
                  const items = [...prev.Items];
                  items[index].itemName = e.target.value;
                  return { ...prev, Items: items };
                })
              }
              required
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) =>
                setForm((prev) => {
                  const items = [...prev.Items];
                  items[index].quantity = parseFloat(e.target.value);
                  items[index].amount =
                    items[index].quantity * items[index].price;
                  return { ...prev, Items: items };
                })
              }
              required
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={item.price}
              onChange={(e) =>
                setForm((prev) => {
                  const items = [...prev.Items];
                  items[index].price = parseFloat(e.target.value);
                  items[index].amount =
                    items[index].quantity * items[index].price;
                  return { ...prev, Items: items };
                })
              }
              required
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={item.amount}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => handleRemoveItem(item.Id)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddItem}
      >
        Add Item
      </Button>

      <Typography variant="h6">Bill Sundrys</Typography>
      {form.BillSundrys.map((bill, index) => (
        <Grid container spacing={2} key={bill.Id} alignItems="center">
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Bill Sundry Name"
              value={bill.billSundryName}
              onChange={(e) =>
                setForm((prev) => {
                  const bills = [...prev.BillSundrys];
                  bills[index].billSundryName = e.target.value;
                  return { ...prev, BillSundrys: bills };
                })
              }
              required
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={bill.amount}
              onChange={(e) =>
                setForm((prev) => {
                  const bills = [...prev.BillSundrys];
                  bills[index].amount = e.target.value;
                  return { ...prev, BillSundrys: bills };
                })
              }
              required
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => handleRemoveBillSundry(bill.Id)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddBillSundry}
      >
        Add Bill Sundry
      </Button>

      <Box mt={3}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceCreateEdit;
