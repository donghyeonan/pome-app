# Translation Files

This directory contains translation files for the Pome application's internationalization (i18n) support.

## Supported Languages

- **en.json** - English (default)
- **ko.json** - Korean (coming in Phase 4)
- **zh.json** - Chinese (coming in Phase 4)
- **ja.json** - Japanese (coming in Phase 4)

## Translation Key Naming Conventions

### Structure

Translation keys are organized hierarchically by feature/section:

```
{
  "featureName": {
    "keyName": "Translation text"
  }
}
```

### Naming Rules

1. **Use camelCase** for key names (e.g., `searchPlaceholder`, `noResults`)
2. **Group by feature** - organize keys by the feature or page they belong to
3. **Be descriptive** - key names should clearly indicate what they represent
4. **Avoid abbreviations** - use full words for clarity
5. **Use consistent terminology** - maintain the same terms across features

### Feature Categories

- **common** - Shared UI elements (buttons, labels, messages)
- **nav** - Navigation elements (menu items, tabs)
- **home** - Homepage content
- **auth** - Authentication (login, logout, registration)
- **treatments** - Treatment-related content
- **clinics** - Clinic-related content
- **search** - Search functionality
- **saved** - Saved items feature
- **profile** - User profile and settings
- **errors** - Error messages
- **validation** - Form validation messages

### Examples

✅ **Good:**
```json
{
  "treatments": {
    "priceRange": "Price Range",
    "sortByPopularity": "Popularity",
    "noTreatments": "No treatments found"
  }
}
```

❌ **Bad:**
```json
{
  "treatments": {
    "pr": "Price Range",
    "sort_pop": "Popularity",
    "no_results": "No treatments found"
  }
}
```

## Using Translations in Components

### Server Components

```typescript
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');
  
  return <h1>{t('title')}</h1>;
}
```

### Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function SearchInput() {
  const t = useTranslations('search');
  
  return <input placeholder={t('searchPlaceholder')} />;
}
```

### With Parameters

For dynamic content, use placeholders:

```json
{
  "search": {
    "resultsFor": "Results for \"{query}\"",
    "resultsCount": "{count} results found"
  }
}
```

```typescript
const t = useTranslations('search');
t('resultsFor', { query: 'Botox' }); // "Results for "Botox""
t('resultsCount', { count: 5 }); // "5 results found"
```

## Translation Workflow for Future Languages

### Phase 4: Adding New Languages

1. **Copy en.json** as a template for the new language
2. **Translate all values** while keeping keys unchanged
3. **Maintain structure** - ensure the JSON structure matches exactly
4. **Test thoroughly** - verify all translations display correctly
5. **Review context** - ensure translations fit UI constraints (length, tone)

### Translation Guidelines

- **Maintain tone** - Keep the friendly, professional tone
- **Consider length** - Some languages are more verbose; ensure UI can accommodate
- **Cultural sensitivity** - Adapt content for cultural appropriateness
- **Technical terms** - Use standard medical/cosmetic terminology
- **Consistency** - Use the same translation for repeated terms

### Quality Checklist

- [ ] All keys from en.json are present
- [ ] No keys are missing or extra
- [ ] Translations fit within UI constraints
- [ ] Special characters are properly encoded
- [ ] Placeholders (e.g., {query}) are preserved
- [ ] JSON syntax is valid
- [ ] File is saved with UTF-8 encoding

## Adding New Translation Keys

When adding new features:

1. **Add to en.json first** - Define the English version
2. **Choose appropriate category** - Place in the correct feature section
3. **Follow naming conventions** - Use camelCase and descriptive names
4. **Document if needed** - Add comments in this README for complex keys
5. **Update other languages** - Mark as TODO for future translation

## Notes

- Never hardcode user-facing text in components
- Always use translation keys, even for single words
- Keep translations concise and clear
- Test with different languages to ensure UI adapts properly
