'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, email address, phone number, and password
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our services, including 
                features accessed, time spent, and preferences
              </li>
              <li>
                <strong>Device Information:</strong> IP address, browser type, operating system, 
                and device identifiers
              </li>
              <li>
                <strong>Communication Data:</strong> Records of support requests and feedback
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Provide, maintain, and improve our services
              </li>
              <li>
                Personalize your experience and customize content
              </li>
              <li>
                Respond to your requests and provide customer support
              </li>
              <li>
                Send you technical notices, updates, and security alerts
              </li>
              <li>
                Monitor and analyze trends, usage, and activities in connection with our services
              </li>
              <li>
                Detect, investigate, and prevent fraudulent transactions and other illegal activities
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personally identifiable information 
              to outside parties except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>With your consent:</strong> We may share information when you give us explicit permission
              </li>
              <li>
                <strong>Service providers:</strong> We may share information with vendors, consultants, 
                and other service providers who need access to such information to carry out work on our behalf
              </li>
              <li>
                <strong>Legal requirements:</strong> We may disclose information if required to do so by law 
                or in response to valid requests by public authorities
              </li>
              <li>
                <strong>Business transfers:</strong> We may share or transfer information in connection with, 
                or during negotiations of, any merger, sale of company assets, financing, or acquisition
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We implement appropriate technical and organizational measures to protect the security 
              of your personal information. However, please note that no method of transmission over 
              the Internet or method of electronic storage is 100% secure.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access:</strong> You can request access to the personal information we hold about you
              </li>
              <li>
                <strong>Correction:</strong> You can request that we correct inaccurate personal information
              </li>
              <li>
                <strong>Deletion:</strong> You can request deletion of your personal information
              </li>
              <li>
                <strong>Objection:</strong> You can object to our processing of your personal information
              </li>
              <li>
                <strong>Portability:</strong> You can request a copy of your personal information in a 
                structured, machine-readable format
              </li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at privacy@aiassistant.com
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes described in this policy, unless a longer retention period 
              is required or permitted by law.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Children&apos;s Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our services are not intended for individuals under the age of 16. We do not knowingly 
              collect personal information from children under 16. If we become aware that a child 
              under 16 has provided us with personal information, we will take steps to delete such 
              information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new privacy policy on this page and updating the &quot;Last Updated&quot; 
              date. You are advised to review this privacy policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              AI Assistant Privacy Team<br />
              Email: privacy@aiassistant.com<br />
              Phone: +1 (555) 123-4568
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}