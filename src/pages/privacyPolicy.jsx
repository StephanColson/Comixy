import ReactMarkdown from "react-markdown";
import { GiReturnArrow } from "react-icons/gi";

const PRIVACY_POLICY_MD = `
# Privacy Policy

**Last updated:** 30/09/2026

## Who is responsible for your data
Comyxius is a personal, non-commercial project run by an individual based in Belgium. For any question about your data or this policy, contact: **nightmaredoc@gmail.com**.

## What we collect
When you sign in with Google, Comyxius stores:
- Your Google account username (display name)
- Your Google account email address
- Your assigned role in the app ("user", "mod", or "admin")

We do not collect passwords — authentication is handled entirely by Google. We do not run analytics, tracking scripts, or advertising of any kind.

## Why we collect it
This data is used solely to:
- Identify you when you sign in
- Control what you can see and do in the app, based on your role

## Who else can access it
- **Google** provides the sign-in service and acts as a data processor for the authentication step.
- **Firebase** (a Google product) stores the data described above.
- **Render** hosts the application itself.

Both Firebase and Render operate under their own data processing terms. No data is sold, shared with advertisers, or used for any purpose beyond running this app.

## Where your data is stored
Data may be stored on servers outside the European Economic Area (EEA), depending on Firebase/Render's infrastructure. Both providers rely on Standard Contractual Clauses or equivalent safeguards for such transfers.

## How long we keep it
Your data is kept for as long as your account exists. If you'd like your account and associated data removed, contact us at the email above.

## Your rights
Under the GDPR, you have the right to:
- Access the personal data we hold about you
- Correct inaccurate data
- Request deletion of your data
- Object to or restrict processing
- Lodge a complaint with your national data protection authority (in Belgium: the [Belgian Data Protection Authority (APD/GBA)](https://www.gegevensbeschermingsautoriteit.be))

To exercise any of these rights, contact **nightmaredoc@gmail.com**.

## Changes to this policy
This policy may be updated as the app evolves. Material changes will be reflected here with an updated "Last updated" date.
`;

export function PrivacyPolicyPage(props) {
  const { onBack } = props;
  return (
    <div
      style={{ maxWidth: "50rem", margin: "0 auto", padding: "2rem 1.5rem" }}
    >
      <div
        style={{
          background: "#1a1a1a",
          borderRadius: "12px",
          padding: "2rem",
          color: "#ddd",
        }}
      >
        <button
          type="button"
          className="btn btn-outline-light mb-4"
          onClick={onBack}
        >
          <GiReturnArrow />
        </button>
        <ReactMarkdown>{PRIVACY_POLICY_MD}</ReactMarkdown>
      </div>
    </div>
  );
}
