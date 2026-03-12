'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Globe, Users, Award, MessageCircle, Star, TrendingUp } from 'lucide-react';

interface Partner {
  id: string;
  businessName: string;
  businessType: string;
  sector: string;
  location: string;
  website?: string;
  verificationStatus: string;
  rating: number;
  reviewCount: number;
  description: string;
  employeeCount?: number;
  since: string;
}

export function B2BMarketplace() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/b2b/partners');
      if (response.ok) {
        const data = await response.json();
        setPartners(data.businesses || []);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = partners;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sector filter
    if (selectedSector !== 'all') {
      filtered = filtered.filter(p => p.sector === selectedSector);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.businessType === selectedType);
    }

    // Apply sorting
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.since).getTime() - new Date(a.since).getTime());
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    setFilteredPartners(filtered);
  }, [partners, searchTerm, selectedSector, selectedType, sortBy]);

  const sectors = ['Technology', 'Finance', 'Healthcare', 'Education', 'Logistics', 'Manufacturing'];
  const businessTypes = ['Startup', 'SME', 'Large Enterprise', 'Government Contractor'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">B2B Partner Marketplace</h2>
        <p className="text-gray-600">Discover and collaborate with vetted business partners</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sector Filter */}
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Business Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Business Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {businessTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-600">
            Showing {filteredPartners.length} of {partners.length} partners
          </p>
        </CardContent>
      </Card>

      {/* Partners Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading partners...</p>
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No partners found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{partner.businessName}</CardTitle>
                    <CardDescription>{partner.sector}</CardDescription>
                  </div>
                  {partner.verificationStatus === 'verified' && (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <Award className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {partner.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(partner.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{partner.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({partner.reviewCount})</span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  {partner.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {partner.location}
                    </div>
                  )}
                  {partner.website && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Globe className="w-4 h-4" />
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                  {partner.employeeCount && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      {partner.employeeCount} employees
                    </div>
                  )}
                </div>

                {/* Business Type Badge */}
                <div>
                  <Badge variant="outline">{partner.businessType}</Badge>
                </div>
              </CardContent>

              {/* Actions */}
              <div className="p-4 border-t flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contact
                </Button>
                <Button className="flex-1" size="sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Collaborate
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
