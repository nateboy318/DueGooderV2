export default function RefundPolicyPage() {
  return (
    <>
      <article
        className="prose lg:prose-xl max-w-6xl mx-auto"
        dangerouslySetInnerHTML={{
          __html: `
            <h1>Refund Policy</h1>

            <h2>30-Day Money-Back Guarantee</h2>

            <p>We want you to be completely satisfied with our service. If it doesn't meet your expectations, we offer a full refund within 30 days of purchase.</p>

            <h2>How to Request a Refund</h2>

            <p>You have two options for requesting a refund:</p>

            <ol>
              <li>
                <strong>Contact Support:</strong> Send an email to support@gloow.com or use our contact form with the following information:
                <ul>
                  <li>Order number</li>
                  <li>Purchase email address</li>
                  <li>Reason for the refund (optional)</li>
                </ul>
              </li>
              <li>
                <strong>Stripe Customer Portal:</strong> Access your billing information and initiate a refund directly through the Stripe Customer Portal:
                <ul>
                  <li>Go to Dashboard > Billing</li>
                </ul>
              </li>
            </ol>

            <h2>We're Here to Help</h2>

            <p>While we offer refunds, we're committed to making sure our service works for you. Please reach out to our support team before requesting a refund, and we'll do our best to fix any issues you might have.</p>
          `,
        }}
      ></article>
    </>
  );
} 