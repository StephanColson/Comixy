import ReactMarkdown from "react-markdown";
import { GiReturnArrow } from "react-icons/gi";

const TERMS_MD = `
# Terms of Service

**Last updated:** 30/09/2026

## About this app
Comyxius is a personal comic-collection catalog, built and maintained as a hobby project. It is provided **as-is**, without any warranty of availability, accuracy, or fitness for a particular purpose.

## Access
Access is currently invitation-only and limited to people the app owner has personally shared a link with. The owner reserves the right to revoke access at any time, for any reason.

## Acceptable use
Please don't:
- Attempt to access data belonging to other users beyond what the app exposes to your role
- Use the app for any unlawful purpose
- Attempt to disrupt, overload, or reverse-engineer the service

## No warranty
This app is maintained in the developer's free time. There is no guarantee of uptime, data durability, or long-term availability. Back up anything important to you separately if it matters to you.

## Limitation of liability
To the fullest extent permitted by law, the developer is not liable for any loss or damage arising from your use of, or inability to use, this app — including loss of data.

## Changes
These terms may change as the app evolves. Continued use after a change means you accept the updated terms.

## Contact
Questions about these terms: **nightmaredoc@gmail.com**.
`;

export function TermsOfServicePage(props) {
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

        <ReactMarkdown>{TERMS_MD}</ReactMarkdown>
      </div>
    </div>
  );
}
