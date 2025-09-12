'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPoliciesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Terms & Policies</h1>
        <p className="text-muted-foreground">
          Please read these terms carefully before using our services.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              By accessing or using the AI Assistant services, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you disagree with any part of these terms, you may not 
              access the services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Use of Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You agree to use our services only for lawful purposes and in accordance with these Terms. You 
              agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Violate any applicable local, national, or international law or regulation
              </li>
              <li>
                Transmit any material that is unlawful, harmful, threatening, abusive, harassing, tortious, 
                defamatory, vulgar, obscene, libelous, invasive of another&apos;s privacy, or hateful
              </li>
              <li>
                Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation 
                with a person or entity
              </li>
              <li>
                Interfere with or disrupt the services or servers or networks connected to the services
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The services and their entire contents, features, and functionality are owned by AI Assistant, 
              its licensors, or other providers of such material and are protected by United States and 
              international copyright, trademark, patent, trade secret, and other intellectual property 
              or proprietary rights laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
              your personal information. By using our services, you consent to the collection and use of 
              information in accordance with our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Disclaimer of Warranties</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. AI Assistant 
              expressly disclaims all warranties of any kind, whether express or implied, including, but not 
              limited to, the implied warranties of merchantability, fitness for a particular purpose, and 
              non-infringement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              In no event shall AI Assistant, its affiliates, or their licensors, service providers, employees, 
              agents, officers, or directors be liable for any direct, indirect, incidental, special, 
              consequential, or punitive damages, including without limitation, loss of profits, data, use, 
              goodwill, or other intangible losses, resulting from your access to or use of or inability to 
              access or use the services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms 
              taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              AI Assistant Support<br />
              Email: support@aiassistant.com<br />
              Phone: +1 (555) 123-4567
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}