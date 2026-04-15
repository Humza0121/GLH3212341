import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-secondary px-4 py-8">
      <div className="max-w-3xl mx-auto bg-card rounded-lg border border-border p-8 animate-fade-in">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/signup"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign Up</Link>
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-6">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground mb-6">Last updated: 24 March 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>Welcome to Greenfield Local Hub. By creating an account and using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
            <p>Users may register as either a <strong>Customer</strong> (to browse and purchase products) or a <strong>Farmer / Producer</strong> (to list and sell products). You are responsible for keeping your login credentials secure and for all activity under your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Ordering and Payments</h2>
            <p>All prices are displayed in GBP and include applicable taxes. Orders are subject to product availability. We reserve the right to cancel orders for out-of-stock items and will notify you promptly if this occurs.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Producer Responsibilities</h2>
            <p>Producers must ensure that all listed products comply with UK food safety regulations. Product descriptions, pricing, and stock levels must be accurate and kept up to date. Greenfield Local Hub is not liable for the quality or safety of third-party products.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Loyalty Programme</h2>
            <p>Customers earn loyalty points on qualifying purchases. Points have no cash value and may be redeemed only through the platform. We reserve the right to modify or discontinue the loyalty programme at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Data Protection and Privacy</h2>
            <p>We collect and process personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. Your data is used solely to operate the platform and will not be shared with third parties without your consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
            <p>Greenfield Local Hub acts as a marketplace connecting customers with local producers. We are not liable for any direct, indirect, or consequential damages arising from the use of the platform or the products purchased through it.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Changes to These Terms</h2>
            <p>We may update these Terms and Conditions from time to time. Continued use of the platform after changes are published constitutes acceptance of the revised terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at <strong>support@greenfieldlocalhub.co.uk</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
