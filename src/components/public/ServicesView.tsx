import React, { useState } from 'react';
import { Service, NavigationPage } from '../../types';
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  FileText,
  Search,
  Layers,
  ArrowRight,
  CheckCircle2,
  Calendar,
  X,
  Shield,
  PackageCheck,
  ChevronRight,
} from 'lucide-react';

interface ServicesViewProps {
  services: Service[];
  onOpenConsultation: (serviceName?: string) => void;
  selectedService: Service | null;
  onSelectService: (service: Service | null) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onOpenConsultation,
  selectedService,
  onSelectService,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-[#D5A13A]" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-[#D5A13A]" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-[#D5A13A]" />;
      case 'Search':
        return <Search className="w-5 h-5 text-[#D5A13A]" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#D5A13A]" />;
      default:
        return <Briefcase className="w-5 h-5 text-[#D5A13A]" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#10283F] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#D5A13A] text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5 mr-1" />
              Strategic Practice Areas
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Consulting Services & Advisory
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tailored advisory programs designed to strengthen operational resilience, accelerate capital acquisition, and drive sustainable growth in Ethiopia and international markets.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col group hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={service.coverImageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-[#10283F]/90 backdrop-blur-sm flex items-center justify-center shadow">
                    {getIcon(service.icon)}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] font-semibold text-[#D5A13A] uppercase tracking-wider block">
                      Practice Area
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#10283F] group-hover:text-[#b88528] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {service.summary}
                    </p>
                  </div>

                  {service.benefits && service.benefits.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Key Value Delivered:
                      </p>
                      {service.benefits.slice(0, 2).map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-start text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#b88528] mr-2 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectService(service)}
                      className="text-xs font-semibold text-[#10283F] hover:text-[#b88528] flex items-center transition-colors"
                    >
                      Full Scope & Deliverables
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                    <button
                      onClick={() => onOpenConsultation(service.title)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#10283F] bg-[#D5A13A]/20 hover:bg-[#D5A13A] rounded transition-colors"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl text-slate-900 overflow-hidden my-8 border border-slate-300">
            {/* Modal Header Cover */}
            <div className="relative h-56 sm:h-64 bg-[#10283F] overflow-hidden">
              <img
                src={selectedService.coverImageUrl}
                alt={selectedService.title}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10283F] via-[#10283F]/70 to-transparent" />
              <button
                onClick={() => onSelectService(null)}
                className="absolute top-4 right-4 text-white hover:text-[#D5A13A] p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[#D5A13A] text-xs font-bold uppercase tracking-wider block">
                  Practice Area Deep Dive
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  {selectedService.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <h3 className="font-serif text-base font-bold text-[#10283F] mb-2">
                  Service Overview & Strategic Context
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedService.description || selectedService.summary}
                </p>
              </div>

              {selectedService.benefits && selectedService.benefits.length > 0 && (
                <div>
                  <h3 className="font-serif text-base font-bold text-[#10283F] mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-[#b88528]" />
                    Strategic Enterprise Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedService.benefits.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#b88528] shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-snug">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedService.deliverables && selectedService.deliverables.length > 0 && (
                <div>
                  <h3 className="font-serif text-base font-bold text-[#10283F] mb-3 flex items-center">
                    <PackageCheck className="w-4 h-4 mr-2 text-[#b88528]" />
                    Core Tangible Deliverables
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedService.deliverables.map((d, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start space-x-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#10283F] shrink-0 mt-1.5" />
                        <span className="text-xs font-medium text-slate-800 leading-snug">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600">
                Custom engagements tailored to your enterprise scale.
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() => onSelectService(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const title = selectedService.title;
                    onSelectService(null);
                    onOpenConsultation(title);
                  }}
                  className="px-5 py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all flex items-center"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Inquire About This Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
