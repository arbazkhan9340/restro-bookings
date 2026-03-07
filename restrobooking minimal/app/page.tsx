"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full bg-background text-foreground min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/resmio-logo.png" alt="Resmio.in Logo" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-semibold">Resmio.in</span>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden space-x-8 md:flex">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium hover:text-primary transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium hover:text-primary transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="text-sm font-medium hover:text-primary transition-colors">FAQ</button>
            </nav>
            {/* Mobile Navigation Toggle */}
            <button className="md:hidden p-2 rounded hover:bg-muted" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="space-y-4 border-t border-border py-4 md:hidden">
              <button onClick={() => scrollToSection('features')} className="block text-sm font-medium hover:text-primary transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="block text-sm font-medium hover:text-primary transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="block text-sm font-medium hover:text-primary transition-colors">FAQ</button>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center py-20 bg-gradient-to-b from-background to-muted" id="hero">
        <div className="text-center max-w-2xl mx-auto">
          <img src="/resmio-logo.png" alt="Resmio.in Logo" className="mx-auto h-16 w-16 rounded-lg mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">The Easiest Way to Manage Restaurant Reservations</h1>
          <p className="text-lg text-muted-foreground mb-8">Resmio.in helps restaurants in India accept, manage, and optimize table bookings online. Secure payments, instant notifications, and a beautiful dashboard—no coding required.</p>
          <a href="https://restrobookings-r80zlbtp8-arbazkhanjrw1-1208s-projects.vercel.app/sign-up" className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition">Get Started</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background" id="features">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-muted/50 shadow">
              <h3 className="font-semibold text-xl mb-2">Online Reservations</h3>
              <p className="text-muted-foreground">Let guests book tables 24/7 from your website or social media.</p>
            </div>
            <div className="p-6 rounded-lg bg-muted/50 shadow">
              <h3 className="font-semibold text-xl mb-2">Razorpay Payments</h3>
              <p className="text-muted-foreground">Collect advance payments securely with India’s leading payment gateway.</p>
            </div>
            <div className="p-6 rounded-lg bg-muted/50 shadow">
              <h3 className="font-semibold text-xl mb-2">Owner Dashboard</h3>
              <p className="text-muted-foreground">Track bookings, manage tables, and view analytics in real time.</p>
            </div>
            <div className="p-6 rounded-lg bg-muted/50 shadow">
              <h3 className="font-semibold text-xl mb-2">Instant Notifications</h3>
              <p className="text-muted-foreground">Get notified instantly for every new reservation and guest update.</p>
            </div>
            <div className="p-6 rounded-lg bg-muted/50 shadow">
              <h3 className="font-semibold text-xl mb-2">Customizable Widgets</h3>
              <p className="text-muted-foreground">Easily embed and style the booking form to match your brand.</p>
            </div>
            <div className="p-6 rounded-lg bg-muted/50 shadow">
              <h3 className="font-semibold text-xl mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">Hosted on Vercel with enterprise-grade security and uptime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/50" id="pricing">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="flex justify-center">
            <div className="bg-background rounded-lg shadow p-8 flex flex-col items-center max-w-md w-full">
              <h3 className="font-semibold text-xl mb-2">All-in-One Plan</h3>
              <p className="text-4xl font-bold mb-2">₹1499<span className="text-base font-normal">/mo</span></p>
              <ul className="text-muted-foreground mb-6 space-y-2 text-center">
                <li>Unlimited reservations</li>
                <li>Owner dashboard</li>
                <li>Email & priority support</li>
                <li>Razorpay payments</li>
                <li>Social Media integrations</li>
                <li>Custom Widgets</li>
              </ul>
              <a href="#" className="px-6 py-2 bg-primary text-white rounded font-semibold hover:bg-primary/90 transition">Start Free Trial</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background" id="faq">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold mb-2">Is Resmio.in only for Indian restaurants?</h4>
              <p className="text-muted-foreground">Currently, we focus on Indian restaurants and support INR payments via Razorpay.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-muted-foreground">Yes, you can cancel your subscription at any time from your dashboard.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Do you offer support?</h4>
              <p className="text-muted-foreground">Absolutely! We offer email and priority support depending on your plan.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How do I get started?</h4>
              <p className="text-muted-foreground">Click “Get Started” above to begin your free trial. No credit card required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-2">
              <img src="/resmio-logo.png" alt="Resmio.in Logo" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-semibold">Resmio.in</span>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy', 'Status'] }
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold">{col.title}</h4>
                <ul className="mt-4 space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Resmio.in. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
