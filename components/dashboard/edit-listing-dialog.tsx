'use client';

import { useState } from 'react';
import { Listing } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EditListingDialogProps {
  listing: Listing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (listing: Listing) => Promise<void>;
}

export function EditListingDialog({ listing, open, onOpenChange, onSave }: EditListingDialogProps) {
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    price: listing.price,
    location: listing.location,
    carModel: listing.carModel,
    carYear: listing.carYear,
    mileage: listing.mileage,
    fuelType: listing.fuelType,
    transmission: listing.transmission,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedListing = {
        ...listing,
        ...formData,
      };
      await onSave(updatedListing);
    } catch (error) {
      console.error('Failed to update listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
          <DialogDescription>
            Update the details for this car rental listing.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price per Day ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carModel">Car Model</Label>
              <Input
                id="carModel"
                value={formData.carModel}
                onChange={(e) => handleInputChange('carModel', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carYear">Year</Label>
              <Input
                id="carYear"
                type="number"
                value={formData.carYear}
                onChange={(e) => handleInputChange('carYear', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 