'use client';

import { useMemo } from 'react';
import { treatments } from '@/data/treatments';
import { clinics } from '@/data/clinics';
import { clinicTreatments } from '@/data/clinic-treatments';
import { Treatment, Clinic, SearchResult } from '@/types';

export function useSearch(query: string): SearchResult {
  const searchResult = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return {
        treatments: [],
        clinics: [],
        query: '',
        resultType: 'mixed' as const,
      };
    }

    // Search treatments
    const matchedTreatments = treatments.filter((treatment) => {
      const nameMatch = treatment.name.toLowerCase().includes(trimmedQuery);
      const descriptionMatch = treatment.description
        .toLowerCase()
        .includes(trimmedQuery);
      const categoryMatch = treatment.categories.some((category) =>
        category.toLowerCase().includes(trimmedQuery)
      );

      return nameMatch || descriptionMatch || categoryMatch;
    });

    // Search clinics
    const matchedClinics = clinics.filter((clinic) => {
      const nameMatch = clinic.name.toLowerCase().includes(trimmedQuery);
      const locationMatch = clinic.location
        .toLowerCase()
        .includes(trimmedQuery);
      const descriptionMatch = clinic.description
        .toLowerCase()
        .includes(trimmedQuery);
      const specialtyMatch = clinic.specialties.some((specialty) =>
        specialty.toLowerCase().includes(trimmedQuery)
      );

      return nameMatch || locationMatch || descriptionMatch || specialtyMatch;
    });

    // Find clinics that offer the matched treatments
    let relatedClinics: Clinic[] = [];
    if (matchedTreatments.length > 0) {
      const treatmentIds = matchedTreatments.map((t) => t.id);
      const relatedClinicIds = clinicTreatments
        .filter((ct) => treatmentIds.includes(ct.treatmentId))
        .map((ct) => ct.clinicId);

      relatedClinics = clinics.filter((clinic) =>
        relatedClinicIds.includes(clinic.id)
      );
    }

    // Determine result type
    let resultType: 'treatment' | 'clinic' | 'mixed';

    if (matchedTreatments.length > 0 && matchedClinics.length === 0) {
      // Only treatments found (Case 1: treatment keyword)
      resultType = 'treatment';
      return {
        treatments: matchedTreatments,
        clinics: relatedClinics,
        query: trimmedQuery,
        resultType,
      };
    } else if (matchedTreatments.length === 0 && matchedClinics.length > 0) {
      // Only clinics found (Case 2: clinic name)
      resultType = 'clinic';
      return {
        treatments: [],
        clinics: matchedClinics,
        query: trimmedQuery,
        resultType,
      };
    } else if (matchedTreatments.length > 0 && matchedClinics.length > 0) {
      // Both found - prioritize treatments and show related clinics
      resultType = 'mixed';
      // Combine matched clinics with related clinics, removing duplicates
      const allClinics = [
        ...matchedClinics,
        ...relatedClinics.filter(
          (rc) => !matchedClinics.some((mc) => mc.id === rc.id)
        ),
      ];
      return {
        treatments: matchedTreatments,
        clinics: allClinics,
        query: trimmedQuery,
        resultType,
      };
    } else {
      // No results
      resultType = 'mixed';
      return {
        treatments: [],
        clinics: [],
        query: trimmedQuery,
        resultType,
      };
    }
  }, [query]);

  return searchResult;
}

// Hook for autocomplete - returns only treatments, limited to 10
export function useAutocomplete(query: string): Treatment[] {
  const autocompleteResults = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return [];
    }

    // Search only treatments for autocomplete
    const matchedTreatments = treatments.filter((treatment) => {
      const nameMatch = treatment.name.toLowerCase().includes(trimmedQuery);
      const categoryMatch = treatment.categories.some((category) =>
        category.toLowerCase().includes(trimmedQuery)
      );

      return nameMatch || categoryMatch;
    });

    // Limit to 10 results
    return matchedTreatments.slice(0, 10);
  }, [query]);

  return autocompleteResults;
}
