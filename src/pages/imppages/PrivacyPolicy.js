import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="privacy-updated">Last updated: July 18, 2025</p>

      <div className="privacy-content">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to our social media platform (“we,” “our,” or “us”). This Privacy Policy explains how we collect, use, and protect your personal data when you use our website and mobile app (“the Platform”), which functions similarly to Instagram.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We collect the following information when you use our services:</p>
          <ul>
            <li>Personal details like name, email, phone number</li>
            <li>Profile information and media uploads (photos, videos, etc.)</li>
            <li>Device and usage data, including IP address and location</li>
            <li>Messages and comments shared within the app</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the data to:</p>
          <ul>
            <li>Personalize your experience</li>
            <li>Improve our services</li>
            <li>Send notifications and updates</li>
            <li>Monitor and protect against abuse</li>
          </ul>
        </section>

        <section>
          <h2>4. Sharing of Information</h2>
          <p>
            We do not sell your personal information. We may share your data with service providers, law enforcement (when required), or during business transfers such as mergers or acquisitions.
          </p>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information. However, no system is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>6. Your Choices</h2>
          <p>
            You can manage your profile settings, delete your account, or opt out of notifications at any time from the app or website settings.
          </p>
        </section>

        <section>
          <h2>7. Children’s Privacy</h2>
          <p>
            Our services are not intended for users under the age of 13. We do not knowingly collect data from children.
          </p>
        </section>

        <section>
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy occasionally. Updates will be posted on this page with the new effective date.
          </p>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this policy, contact us at: <a href="mailto:support@yourapp.com">support@yourapp.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
