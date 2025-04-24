import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InvoiceSkeleton } from "../../components/Invoice/InvoiceSkeleton";

export default function Invoices() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("id");

  useEffect(() => navigate(`/invoices/${orderId}`), [navigate, orderId]);

  return <InvoiceSkeleton />;
}
