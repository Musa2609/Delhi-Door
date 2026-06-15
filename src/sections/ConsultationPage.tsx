import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronDown, Globe, Phone, Mail, User, Building, Briefcase, FileText, CheckCircle2, Download, Search, Lock } from 'lucide-react';
import { Magnet } from '../components/Magnet';

interface ConsultationPageProps {
  onBack: () => void;
}

interface LeadData {
  id: string;
  timestamp: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  businessType: string;
  services: string[];
  description: string;
  budget: string;
  customBudget?: string;
  timeline: string;
  status: string;
}

const BUSINESS_TYPES = [
  'Restaurant',
  'Cafe',
  'Gym',
  'Doctor / Clinic',
  'Dentist',
  'Real Estate',
  'Coaching Institute',
  'Interior Design',
  'Construction',
  'E-commerce',
  'Salon',
  'Photography',
  'Agency',
  'Other'
];

const SERVICES = [
  'Business Website',
  'Website Redesign',
  'Landing Page',
  'Google Business Profile Optimization',
  'Website Maintenance',
  'SEO',
  'Branding',
  'Other'
];

const BUDGETS = [
  'Under ₹4,000',
  '₹4,000 – ₹8,000',
  '₹8,000 – ₹12,000',
  '₹12,000 – ₹20,000',
  '₹20,000+',
  'Not Sure Yet'
];

const TIMELINES = [
  'ASAP',
  'Within 1 Week',
  'Within 2 Weeks',
  'Within 1 Month',
  'Flexible'
];

const STATUSES = ['New Lead', 'Contacted', 'Proposal Sent', 'Closed Won', 'Closed Lost'];

export const ConsultationPage: React.FC<ConsultationPageProps> = ({ onBack }) => {
  // Form fields state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [customBudget, setCustomBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Form handling state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin and authorization state
  const [showAdmin, setShowAdmin] = useState(false);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Search, Filter & Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Monitor Shift+A keypress for toggling admin dashboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch leads database helper
  const fetchLeads = async (pass: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        headers: {
          'Authorization': pass
        }
      });
      const data = await response.json();
      if (response.ok) {
        setLeads(data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  // Admin Login Verify
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    setIsVerifying(true);
    setAuthError('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAdminPassword(passwordInput);
        fetchLeads(passwordInput);
      } else {
        setAuthError(data.error || 'Invalid admin password.');
      }
    } catch (err) {
      setAuthError('Connection error. Is the backend server running?');
    } finally {
      setIsVerifying(false);
    }
  };

  // Update Lead Status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': adminPassword
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Form validation
  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = 'Full name is required';
    if (!company.trim()) tempErrors.company = 'Company name is required';
    
    if (!email.trim()) {
      tempErrors.email = 'Business email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    
    if (!phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{7,15}$/.test(phone.trim())) {
      tempErrors.phone = 'Please enter a valid phone number';
    }

    if (!businessType) tempErrors.businessType = 'Please select your business type';
    if (selectedServices.length === 0) tempErrors.services = 'Please select at least one service';
    if (!description.trim()) {
      tempErrors.description = 'Please tell us briefly about your business';
    } else if (description.trim().length < 10) {
      tempErrors.description = 'Project description should be at least 10 characters';
    }
    if (!budget) tempErrors.budget = 'Please select your budget range';
    if (!timeline) tempErrors.timeline = 'Please select your timeline';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleToggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter(s => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        name,
        company,
        email,
        phone,
        website,
        businessType,
        services: selectedServices,
        description,
        budget,
        customBudget,
        timeline,
        website_trap: honeypot // Spam bot honeypot field
      };

      const response = await fetch('http://localhost:5000/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setErrors({ submit: data.error || 'Failed to submit request. Please try again.' });
      }
    } catch (err) {
      setErrors({ submit: 'Connection error. Is the backend server running?' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['ID', 'Timestamp', 'Name', 'Company', 'Email', 'Phone', 'Website', 'Business Type', 'Services Required', 'Description', 'Budget', 'Timeline', 'Status'];
    const rows = leads.map(l => [
      l.id,
      l.timestamp,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.company.replace(/"/g, '""')}"`,
      l.email,
      l.phone,
      l.website || 'N/A',
      l.businessType,
      `"${l.services.join(', ')}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      l.customBudget ? `"${l.budget} (Custom: ${l.customBudget.replace(/"/g, '""')})"` : l.budget,
      l.timeline,
      l.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `delhi_doors_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Client-Side Search, Filter and Sort Logic
  const filteredAndSortedLeads = leads
    .filter(lead => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.description.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === '' || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <section className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] relative flex flex-col justify-between overflow-x-hidden py-10 px-6 sm:px-10 md:px-16 selection:bg-[#B600A8]/30 selection:text-white select-none">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[5%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-[#7621B0]/10 to-[#B600A8]/8 blur-[100px] opacity-70" />
        <div className="absolute bottom-[5%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-[#0052D4]/8 to-[#4364F7]/5 blur-[120px] opacity-60" />
      </div>

      {/* Floating Noise Filter */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-[1]" />

      {/* Header Bar */}
      <div className="w-full flex justify-between items-center z-10 max-w-6xl mx-auto mb-16">
        <Magnet>
          <button
            onClick={onBack}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#D7E2EA] font-medium uppercase tracking-widest text-[10px] sm:text-xs hover:bg-white/10 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#B600A8]" />
            Back to Website
          </button>
        </Magnet>

        <button
          onClick={() => setShowAdmin(prev => !prev)}
          className="text-white/30 hover:text-white/60 text-xs uppercase tracking-widest transition-colors duration-300 cursor-pointer"
        >
          {showAdmin ? 'Close Panel' : 'Leads Console (Shift+A)'}
        </button>
      </div>

      {/* Main Core Content Panel */}
      <div className="flex-grow flex items-center justify-center w-full z-10 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {showAdmin && !adminPassword ? (
            /* ============================================================== */
            /* ADMIN LOGIN VIEW */
            /* ============================================================== */
            <motion.div
              key="admin-login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center bg-[#FFFFFF]/3 border border-white/5 rounded-3xl p-8 sm:p-12 md:p-16 backdrop-blur-xl max-w-md w-full"
            >
              <Lock className="w-12 h-12 text-[#B600A8] mx-auto mb-6" />
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#D7E2EA] mb-2">
                Leads Console Access
              </h2>
              <p className="text-xs text-white/50 mb-8 uppercase tracking-widest leading-relaxed">
                Please enter the administrator password to view lead submissions.
              </p>
              
              <form onSubmit={handleAdminLogin} className="flex flex-col gap-5 text-left">
                <div className="flex flex-col gap-2">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Enter Password"
                    className="w-full bg-[#FFFFFF]/5 border border-white/10 rounded-xl px-5 py-4 text-[#D7E2EA] placeholder-white/20 focus:outline-none focus:border-[#B600A8] focus:ring-2 focus:ring-[#B600A8]/10 transition-all duration-300 backdrop-blur-md"
                  />
                  {authError && <span className="text-xs text-red-400 mt-1">{authError}</span>}
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying...' : 'Unlock Console'}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : showAdmin && adminPassword ? (
            /* ============================================================== */
            /* ADMIN DASHBOARD VIEW */
            /* ============================================================== */
            <motion.div
              key="admin-dashboard"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#FFFFFF]/3 border border-white/5 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-xl"
            >
              {/* Header section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/15 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#D7E2EA]">
                    Leads Database
                  </h2>
                  <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">
                    Showing {filteredAndSortedLeads.length} of {leads.length} lead{leads.length === 1 ? '' : 's'}
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-[#D7E2EA] hover:bg-white/10 transition-all active:scale-95 cursor-pointer font-medium uppercase tracking-wider"
                >
                  <Download className="w-4 h-4 text-[#B600A8]" />
                  Export CSV
                </button>
              </div>

              {/* Search, Filter & Sort Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, company..."
                    className="w-full bg-white/5 border border-white/10 focus:border-[#B600A8] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#D7E2EA] placeholder-white/30 focus:outline-none transition-colors"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#B600A8] rounded-xl px-4 py-2.5 text-xs text-[#D7E2EA] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0C0C0C]">All Statuses</option>
                    {STATUSES.map((status, idx) => (
                      <option key={idx} value={status} className="bg-[#0C0C0C]">{status}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>

                {/* Date Sorting */}
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#B600A8] rounded-xl px-4 py-2.5 text-xs text-[#D7E2EA] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="desc" className="bg-[#0C0C0C]">Date: Newest First</option>
                    <option value="asc" className="bg-[#0C0C0C]">Date: Oldest First</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm uppercase tracking-widest">No consultation requests received yet.</p>
                </div>
              ) : filteredAndSortedLeads.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <p className="text-sm uppercase tracking-widest">No leads match your active filters.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredAndSortedLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white/5 border border-white/5 rounded-2xl p-5 relative overflow-hidden text-left"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                        {/* Contact Person & Company Name */}
                        <div>
                          <p className="text-white/40 uppercase tracking-widest text-[10px] mb-0.5">Contact info</p>
                          <h4 className="text-base sm:text-lg font-bold text-white leading-tight">{lead.name}</h4>
                          <p className="text-white/60 font-light mt-0.5">{lead.company}</p>
                          <div className="flex flex-col gap-1 mt-2 text-white/70">
                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#B600A8]" />{lead.email}</span>
                            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#B600A8]" />{lead.phone}</span>
                            {lead.website && (
                              <span className="flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-[#B600A8]" />
                                <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="underline hover:text-white">
                                  {lead.website}
                                </a>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Project Description details */}
                        <div>
                          <p className="text-white/40 uppercase tracking-widest text-[10px] mb-0.5">Project details</p>
                          <p className="text-[#D7E2EA] font-light italic leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                            "{lead.description}"
                          </p>
                        </div>
                      </div>

                      {/* Requested Services */}
                      <div className="mt-3">
                        <p className="text-white/40 uppercase tracking-widest text-[9px] mb-1">Services required</p>
                        <div className="flex flex-wrap gap-1.5">
                          {lead.services.map((s, i) => (
                            <span key={i} className="bg-white/5 text-white/70 px-2 py-0.5 rounded text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Row: Budget, Timeline, Date & Status dropdown */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] uppercase tracking-widest">
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-[#B600A8]/20 border border-[#B600A8]/30 px-2.5 py-1 rounded-full text-white">
                            Type: {lead.businessType}
                          </span>
                          <span className="bg-[#BE4C00]/20 border border-[#BE4C00]/30 px-2.5 py-1 rounded-full text-white">
                            Budget: {lead.budget}{lead.customBudget ? ` (${lead.customBudget})` : ''}
                          </span>
                          <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white/80">
                            Timeline: {lead.timeline}
                          </span>
                        </div>

                        {/* Lead Status Select box */}
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 text-[9px] uppercase tracking-widest font-medium">Status:</span>
                          <div className="relative">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                              className={`bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-[#B600A8] cursor-pointer text-[10px] uppercase tracking-widest font-medium ${
                                lead.status === 'New Lead' ? 'border-[#B600A8]/45 text-[#B600A8]' :
                                lead.status === 'Contacted' ? 'border-blue-500/45 text-blue-400' :
                                lead.status === 'Proposal Sent' ? 'border-orange-500/45 text-orange-400' :
                                lead.status === 'Closed Won' ? 'border-green-500/45 text-green-400' :
                                'border-red-500/45 text-red-400'
                              }`}
                            >
                              <option value="New Lead" className="bg-[#0C0C0C]">New Lead</option>
                              <option value="Contacted" className="bg-[#0C0C0C]">Contacted</option>
                              <option value="Proposal Sent" className="bg-[#0C0C0C]">Proposal Sent</option>
                              <option value="Closed Won" className="bg-[#0C0C0C]">Closed Won</option>
                              <option value="Closed Lost" className="bg-[#0C0C0C]">Closed Lost</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-white/30 mt-3 text-right">
                        Submitted: {new Date(lead.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : !isSubmitted ? (
            /* ============================================================== */
            /* BOOKING FORM VIEW */
            /* ============================================================== */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col gap-10"
            >
              {/* Form Header */}
              <div className="text-center">
                <h1 className="hero-heading font-black uppercase tracking-tight leading-none text-[clamp(2.5rem,7vw,90px)]">
                  Let&apos;s Build Something Great
                </h1>
                <p className="text-white/70 font-light mt-6 text-sm sm:text-base md:text-lg max-w-xl mx-auto uppercase tracking-wide leading-relaxed">
                  Tell us about your business and project. We&apos;ll review your requirements and get back to you with the best solution.
                </p>
              </div>

              {/* Honeypot Field (Hidden from view for spam protection) */}
              <input
                type="text"
                name="website_trap"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Form Grid */}
              <div className="flex flex-col gap-8 mt-6">
                {/* Submit Error alert */}
                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-xs sm:text-sm text-left">
                    {errors.submit}
                  </div>
                )}

                {/* Row 1: Full Name & Company Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2.5 text-left">
                    <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#B600A8]" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full bg-[#FFFFFF]/5 border rounded-xl px-5 py-4 text-[#D7E2EA] placeholder-white/20 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-md ${
                        errors.name 
                          ? 'border-red-500/50 focus:ring-red-500/10' 
                          : 'border-white/10 focus:border-[#B600A8] focus:ring-[#B600A8]/10'
                      }`}
                    />
                    {errors.name && <span className="text-xs text-red-400 mt-1">{errors.name}</span>}
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col gap-2.5 text-left">
                    <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#B600A8]" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        if (errors.company) setErrors({ ...errors, company: '' });
                      }}
                      placeholder="e.g. Delhi Ventures"
                      className={`w-full bg-[#FFFFFF]/5 border rounded-xl px-5 py-4 text-[#D7E2EA] placeholder-white/20 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-md ${
                        errors.company 
                          ? 'border-red-500/50 focus:ring-red-500/10' 
                          : 'border-white/10 focus:border-[#B600A8] focus:ring-[#B600A8]/10'
                      }`}
                    />
                    {errors.company && <span className="text-xs text-red-400 mt-1">{errors.company}</span>}
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col gap-2.5 text-left">
                    <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#B600A8]" />
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="e.g. contact@delhiventures.com"
                      className={`w-full bg-[#FFFFFF]/5 border rounded-xl px-5 py-4 text-[#D7E2EA] placeholder-white/20 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-md ${
                        errors.email 
                          ? 'border-red-500/50 focus:ring-red-500/10' 
                          : 'border-white/10 focus:border-[#B600A8] focus:ring-[#B600A8]/10'
                      }`}
                    />
                    {errors.email && <span className="text-xs text-red-400 mt-1">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2.5 text-left">
                    <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#B600A8]" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full bg-[#FFFFFF]/5 border rounded-xl px-5 py-4 text-[#D7E2EA] placeholder-white/20 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-md ${
                        errors.phone 
                          ? 'border-red-500/50 focus:ring-red-500/10' 
                          : 'border-white/10 focus:border-[#B600A8] focus:ring-[#B600A8]/10'
                      }`}
                    />
                    {errors.phone && <span className="text-xs text-red-400 mt-1">{errors.phone}</span>}
                  </div>
                </div>

                {/* Row 3: Website URL (Optional) */}
                <div className="flex flex-col gap-2.5 text-left">
                  <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#B600A8]" />
                    Website URL <span className="text-white/30 text-[10px] font-light lowercase tracking-normal ml-1">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. www.delhiventures.com"
                    className="w-full bg-[#FFFFFF]/5 border border-white/10 focus:border-[#B600A8] focus:ring-2 focus:ring-[#B600A8]/10 rounded-xl px-5 py-4 text-[#D7E2EA] placeholder-white/20 focus:outline-none transition-all duration-300 backdrop-blur-md"
                  />
                </div>

                {/* Row 4: What business do you run? */}
                <div className="flex flex-col gap-2.5 text-left">
                  <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#B600A8]" />
                    What business do you run?
                  </label>
                  <div className="relative w-full">
                    <select
                      value={businessType}
                      onChange={(e) => {
                        setBusinessType(e.target.value);
                        if (errors.businessType) setErrors({ ...errors, businessType: '' });
                      }}
                      className={`w-full bg-[#FFFFFF]/5 border rounded-xl px-5 py-4 text-[#D7E2EA] focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-md appearance-none cursor-pointer ${
                        errors.businessType
                          ? 'border-red-500/50 focus:ring-red-500/10'
                          : 'border-white/10 focus:border-[#B600A8] focus:ring-[#B600A8]/10'
                      }`}
                    >
                      <option value="" disabled className="bg-[#0C0C0C] text-white/30">Select Business Category</option>
                      {BUSINESS_TYPES.map((type, idx) => (
                        <option key={idx} value={type} className="bg-[#0C0C0C] text-[#D7E2EA]">{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                  {errors.businessType && <span className="text-xs text-red-400 mt-1">{errors.businessType}</span>}
                </div>

                {/* Row 5: Services Required (Checkboxes) */}
                <div className="flex flex-col gap-3.5 text-left border-y border-white/5 py-8 my-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5 mb-2">
                    <Check className="w-3.5 h-3.5 text-[#B600A8]" />
                    Services Required
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SERVICES.map((service, idx) => {
                      const isChecked = selectedServices.includes(service);
                      return (
                        <label
                          key={idx}
                          className="flex items-center gap-3.5 cursor-pointer group select-none text-[#D7E2EA] py-1"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              handleToggleService(service);
                              if (errors.services) setErrors({ ...errors, services: '' });
                            }}
                            className="sr-only"
                          />
                          <motion.div
                            animate={{
                              borderColor: isChecked ? 'rgba(182, 0, 168, 1)' : 'rgba(255, 255, 255, 0.1)',
                              backgroundColor: isChecked ? 'rgba(182, 0, 168, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            }}
                            className="w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200"
                          >
                            <AnimatePresence>
                              {isChecked && (
                                <motion.div
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.5, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <Check className="w-3.5 h-3.5 text-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                          <span className="text-sm font-light text-white/80 group-hover:text-white transition-colors">
                            {service}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.services && <span className="text-xs text-red-400 mt-2">{errors.services}</span>}
                </div>

                {/* Row 6: Project Details (Textarea) */}
                <div className="flex flex-col gap-2.5 text-left">
                  <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#B600A8]" />
                    Project Details
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description) setErrors({ ...errors, description: '' });
                    }}
                    placeholder="Tell us about your business and what you would like us to build..."
                    className={`w-full bg-[#FFFFFF]/5 border rounded-xl px-5 py-4 text-[#D7E2EA] placeholder-white/20 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-md resize-none ${
                      errors.description 
                        ? 'border-red-500/50 focus:ring-red-500/10' 
                        : 'border-white/10 focus:border-[#B600A8] focus:ring-[#B600A8]/10'
                    }`}
                  />
                  {errors.description && <span className="text-xs text-red-400 mt-1">{errors.description}</span>}
                </div>

                {/* Row 7: Budget & Timeline Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Budget */}
                  <div className="flex flex-col gap-2.5 text-left">
                    <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5">
                      Budget
                    </label>
                    <div className="relative w-full">
                      <select
                        value={budget}
                        onChange={(e) => {
                          setBudget(e.target.value);
                          if (errors.budget) setErrors({ ...errors, budget: '' });
                        }}
                        className={`w-full bg-[#FFFFFF]/5 border rounded-xl px-5 py-4 text-[#D7E2EA] focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-md appearance-none cursor-pointer ${
                          errors.budget
                            ? 'border-red-500/50 focus:ring-red-500/10'
                            : 'border-white/10 focus:border-[#B600A8] focus:ring-[#B600A8]/10'
                        }`}
                      >
                        <option value="" disabled className="bg-[#0C0C0C] text-white/30">Select Budget Range</option>
                        {BUDGETS.map((b, idx) => (
                          <option key={idx} value={b} className="bg-[#0C0C0C] text-[#D7E2EA]">{b}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                    {errors.budget && <span className="text-xs text-red-400 mt-1">{errors.budget}</span>}

                    {/* Expected Budget (Optional) */}
                    <div className="flex flex-col gap-2.5 mt-4">
                      <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5">
                        Expected Budget <span className="text-white/30 text-[10px] font-light lowercase tracking-normal ml-1">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        placeholder='Example: ₹6,000 or "Not Sure"'
                        className="w-full bg-[#FFFFFF]/5 border border-white/10 focus:border-[#B600A8] focus:ring-2 focus:ring-[#B600A8]/10 rounded-xl px-5 py-4 text-[#D7E2EA] placeholder-white/20 focus:outline-none transition-all duration-300 backdrop-blur-md"
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex flex-col gap-2.5 text-left">
                    <label className="text-xs uppercase tracking-widest font-medium text-white/60 flex items-center gap-1.5">
                      Timeline
                    </label>
                    <div className="relative w-full">
                      <select
                        value={timeline}
                        onChange={(e) => {
                          setTimeline(e.target.value);
                          if (errors.timeline) setErrors({ ...errors, timeline: '' });
                        }}
                        className={`w-full bg-[#FFFFFF]/5 border rounded-xl px-5 py-4 text-[#D7E2EA] focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-md appearance-none cursor-pointer ${
                          errors.timeline
                            ? 'border-red-500/50 focus:ring-red-500/10'
                            : 'border-white/10 focus:border-[#B600A8] focus:ring-[#B600A8]/10'
                        }`}
                      >
                        <option value="" disabled className="bg-[#0C0C0C] text-white/30">Select Timeline</option>
                        {TIMELINES.map((t, idx) => (
                          <option key={idx} value={t} className="bg-[#0C0C0C] text-[#D7E2EA]">{t}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                    {errors.timeline && <span className="text-xs text-red-400 mt-1">{errors.timeline}</span>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative rounded-full text-white font-medium uppercase tracking-widest select-none transition-all active:scale-95 px-12 py-4 text-xs sm:text-sm md:text-base cursor-pointer disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                    boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
                    outline: '2px solid white',
                    outlineOffset: '-3px',
                  }}
                >
                  {isSubmitting ? 'Sending Request...' : 'Request Consultation'}
                </button>
              </div>
            </motion.form>
          ) : (
            /* ============================================================== */
            /* SUCCESS STATE VIEW */
            /* ============================================================== */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center bg-[#FFFFFF]/3 border border-white/5 rounded-3xl p-8 sm:p-12 md:p-16 backdrop-blur-xl max-w-xl w-full"
            >
              <CheckCircle2 className="w-16 h-16 text-[#B600A8] mx-auto mb-8 animate-pulse" />
              <h1 className="hero-heading font-black uppercase tracking-tight text-[3.5rem] sm:text-[4.5rem] leading-none mb-6">
                Thank You
              </h1>
              <p className="text-white/80 font-light text-sm sm:text-base md:text-lg leading-relaxed uppercase tracking-wider mb-10">
                We&apos;ve received your request and will get back to you shortly.
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="w-full flex justify-between items-center text-white/20 text-[10px] uppercase tracking-widest mt-16 border-t border-white/5 pt-6 z-10 max-w-6xl mx-auto">
        <span>© {new Date().getFullYear()} Delhi Doors. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>Digital Growth Agency</span>
          <button
            onClick={() => setShowAdmin(prev => !prev)}
            className="text-white/20 hover:text-white/40 text-[9px] transition-colors cursor-pointer"
            title="Admin Panel Toggle"
          >
            Admin
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConsultationPage;
