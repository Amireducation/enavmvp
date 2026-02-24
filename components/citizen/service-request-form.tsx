import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export interface ServiceRequestFormProps {
  serviceId: string;
  serviceName: string;
  onSubmit?: (data: ServiceRequestData) => void;
}

export interface ServiceRequestData {
  serviceId: string;
  description: string;
  requiredDocuments: File[];
  preferredLanguage: string;
}

export function ServiceRequestForm({ serviceId, serviceName, onSubmit }: ServiceRequestFormProps) {
  const [formData, setFormData] = useState({
    description: '',
    preferredLanguage: 'english',
    documents: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const maxSize = 5 * 1024 * 1024; // 5MB

      const validFiles = newFiles.filter(file => {
        if (file.size > maxSize) {
          setErrors(prev => ({ ...prev, documents: `${file.name} exceeds 5MB limit` }));
          return false;
        }
        return true;
      });

      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...validFiles]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a description of your request';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      onSubmit?.({
        serviceId,
        description: formData.description,
        requiredDocuments: formData.documents,
        preferredLanguage: formData.preferredLanguage
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({ description: '', preferredLanguage: 'english', documents: [] });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to submit request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Request Service</h2>
          <p className="text-muted-foreground">{serviceName}</p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">Request submitted successfully</h3>
              <p className="text-sm text-green-800">
                Your service request has been received. You will receive a confirmation email shortly.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 bg-destructive/10 border border-destructive rounded-lg p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-destructive text-sm">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Request Description
            </label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Please describe your service request in detail. Include relevant information about your situation..."
              rows={5}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-input focus:ring-primary'
              }`}
            />
            <div className="flex justify-between mt-2">
              <p className={`text-sm ${errors.description ? 'text-destructive' : 'text-muted-foreground'}`}>
                {errors.description || `${formData.description.length}/1000 characters`}
              </p>
            </div>
          </div>

          {/* Language Preference */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Preferred Communication Language
            </label>
            <select
              value={formData.preferredLanguage}
              onChange={handleLanguageChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="english">English</option>
              <option value="amharic">አማርኛ (Amharic)</option>
              <option value="oromo">Afaan Oromo</option>
            </select>
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Supporting Documents (Optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-foreground font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, PDF up to 5MB each
              </p>
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />

            {/* Uploaded Files List */}
            {formData.documents.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-foreground">Uploaded Files:</h4>
                {formData.documents.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Service Request'}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-xs text-foreground leading-relaxed">
            By submitting this request, you acknowledge that the information provided is accurate and complete.
            You will receive a confirmation email with your request tracking number. You can track your request
            status anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
