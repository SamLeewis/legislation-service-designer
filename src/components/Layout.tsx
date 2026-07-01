'use client';

import React from 'react';
import Link from 'next/link';
import { useAnalysisStore } from '@/store/analysisStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Wetgeving naar Dienstverlening
              </h1>
              <p className="text-sm text-gray-600">
                Prototype voor waarde-gevoelige vertaling van regelgeving
              </p>
            </div>
            <div className="text-right">
              {analysis && (
                <div className="text-sm">
                  <p className="font-semibold">{analysis.projectName}</p>
                  <p className="text-gray-600">Status: {analysis.status}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
          <div className="p-4 space-y-2">
            <NavLink href="/dashboard" label="📊 Dashboard" />
            <NavLink href="/new-analysis" label="➕ Nieuwe analyse" />
            
            {analysis && (
              <>
                <div className="pt-4 border-t mt-4">
                  <p className="text-xs font-semibold text-gray-500 px-4 py-2">ANALYSE</p>
                  <NavLink href="/legal-input" label="📝 Juridische invoer" />
                  <NavLink href="/legal-elements" label="🔍 Juridische elementen" />
                  <NavLink href="/interpretation-points" label="❓ Interpretatiepunten" />
                  <NavLink href="/service-variants" label="🎯 Dienstverlening varianten" />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-500 px-4 py-2">MODELLERING</p>
                  <NavLink href="/dmn-model" label="⚙️ DMN Model" />
                  <NavLink href="/traceability" label="🔗 Traceerbaarheid" />
                  <NavLink href="/communication-preview" label="💬 Communicatie" />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-500 px-4 py-2">SAMENWERKING</p>
                  <NavLink href="/chat" label="🤖 Chat assistent" />
                  <NavLink href="/workshop" label="👥 Workshop" />
                  <NavLink href="/validation" label="✅ Validatie" />
                  <NavLink href="/export" label="📥 Export" />
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4 mt-8">
        <p className="text-sm">
          Prototype voor onderzoeksproject · Alle outputs vereisen juridische validatie
        </p>
      </footer>
    </div>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label }) => (
  <Link href={href}>
    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary rounded transition">
      {label}
    </span>
  </Link>
);
