'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAnalysisStore } from '@/store/analysisStore';

const ValidationPage: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!analysis) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Geen actieve analyse.</p>
        </div>
      </Layout>
    );
  }

  const allElements = [
    ...analysis.legalElements.map(el => ({
      id: el.id,
      title: el.title,
      type: 'Legal Element',
      status: 'not_checked' as const,
    })),
    ...analysis.serviceVariants.flatMap(v =>
      v.serviceElements.map(el => ({
        id: el.id,
        title: el.title,
        type: 'Service Element',
        status: el.validationStatus,
      }))
    ),
  ];

  const statusOptions = [
    { value: 'not_checked', label: 'Niet gecontroleerd', color: 'gray' },
    { value: 'needs_legal_review', label: 'Juridische controle nodig', color: 'yellow' },
    { value: 'legally_checked', label: 'Gecontroleerd door jurist', color: 'green' },
    { value: 'service_checked', label: 'Gecontroleerd met uitvoering', color: 'blue' },
    { value: 'stakeholder_checked', label: 'Gecontroleerd met stakeholders', color: 'purple' },
    { value: 'rejected', label: 'Afgewezen', color: 'red' },
  ];

  const filteredElements = statusFilter === 'all'
    ? allElements
    : allElements.filter(el => el.status === statusFilter);

  const statusCounts = statusOptions.reduce((acc, option) => {
    acc[option.value] = allElements.filter(el => el.status === option.value).length;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'gray';
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Validatie</h2>
          <p className="text-gray-600">
            Markeer juridische en service elementen voor validatie.
          </p>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statusOptions.map(option => (
            <div key={option.value} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className={`text-2xl font-bold text-${option.color}-600`}>
                {statusCounts[option.value]}
              </div>
              <p className="text-xs text-gray-600 mt-1">{option.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              statusFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Alle
          </button>
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-lg transition ${
                statusFilter === option.value
                  ? `bg-${option.color}-600 text-white`
                  : `bg-gray-200 text-gray-700 hover:bg-gray-300`
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredElements.map(element => {
            const color = getStatusColor(element.status);
            return (
              <div
                key={element.id}
                className={`p-4 bg-white rounded-lg border-l-4 border-${color}-600`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{element.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{element.type}</p>
                  </div>
                  <span className={`text-xs bg-${color}-100 text-${color}-800 px-2 py-1 rounded`}>
                    {getStatusLabel(element.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-lg text-yellow-900 mb-2">⚠️ Validatiewaarschuwing</h3>
          <p className="text-sm text-yellow-800">
            Dit prototype ondersteunt validatiemarkering. Alle elementen moeten geverifieerd worden door:
            - Juridisch experts
            - Uitvoeringsmedewerkers
            - Stakeholders
            voordat ze in productie gaan.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default ValidationPage;
