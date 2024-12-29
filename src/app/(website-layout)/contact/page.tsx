'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative w-full py-20 overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-[size:14px_14px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/50 via-transparent to-orange-600/50" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold">Get in Touch</h1>
            <p className="text-xl text-white/90 max-w-[600px] mx-auto">
              Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">
                  Fill up the form and our Team will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  {
                    icon: Phone,
                    title: "Call Us",
                    details: ["+91 9877110677"],
                  },
                  {
                    icon: Mail,
                    title: "Email Us",
                    details: ["ssent.hq@gmail.com"],
                  },
                  {
                    icon: MapPin,
                    title: "Visit Us",
                    details: [
                      "SS Enterprises",
                      "Plot No 337, Workyard",
                      "Phase 2, Industrial Business & Park",
                      "Chandigarh, India, 160002",
                    ],
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      {item.details.map((detail, j) => (
                        <p key={j} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="How can we help you?"
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full",
                    "bg-orange-600 hover:bg-orange-700",
                    "text-white font-medium",
                    "transition-colors"
                  )}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 