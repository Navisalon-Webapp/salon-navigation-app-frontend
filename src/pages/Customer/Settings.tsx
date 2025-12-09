import EmailSubscriptions from "./EmailSubscriptions";
import PaymentMethodForm from "../../components/PaymentMethodForm";

export default function CustomerSettings() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <header>
        <h1 style={{ margin: 0, color: "#372C2E" }}>Settings</h1>
        <p style={{ marginTop: 6, color: "#6B6B6B" }}>
          Manage your preferences for notifications and communication.
        </p>
      </header>

      <section>
        <EmailSubscriptions />
      </section>

      <section>
        <PaymentMethodForm />
      </section>
    </div>
  );
}
