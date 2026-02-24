import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, AlertCircle } from 'lucide-react';

export interface ServiceBrowserProps {
  onSelectService?: (serviceId: string) => void;
  categories?: string[];
}

export function ServiceBrowser({ onSelectService, categories }: ServiceBrowserProps) {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        const mapped = (data.services || []).map((s: Record<string, unknown>) => ({
          id: s.service_id,
          name: s.name,
          category: s.category || 'General',
          description: s.description,
          processingTime: s.estimated_processing_time || 'N/A',
          cost: Number(s.service_fee) || 0,
          icon: '',
        }));
        setServices(mapped);
        setFilteredServices(mapped);
      } catch (err) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Filter services based on search and category
  useEffect(() => {
    let filtered = services;

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, services]);

  const uniqueCategories = [...new Set(services.map(s => s.category))];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Browse Services</h1>
        <p className="text-muted-foreground">Find and request government services</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 bg-card p-6 rounded-lg border border-border">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category Filter and View Mode */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'border border-input'}`}
              title="Grid view"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'border border-input'}`}
              title="List view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="border border-border rounded-lg p-4 hover:border-primary hover:shadow-lg transition-all cursor-pointer bg-card"
              onClick={() => onSelectService?.(service.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">{service.name.charAt(0)}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {service.category}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {service.description}
              </p>
              <div className="flex justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                <span>⏱ {service.processingTime}</span>
                <span className="font-semibold">
                  {service.cost === 0 ? 'Free' : `ETB ${service.cost}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredServices.length} of {services.length} services
      </div>
    </div>
  );
}
