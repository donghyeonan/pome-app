# Translation Workflow for Future Phases

This document outlines the process for adding new language translations to the Pome application.

## Overview

The Pome app uses `next-intl` for internationalization. Currently, only English (en) is fully implemented. This guide will help translators add Korean (ko), Chinese (zh), and Japanese (ja) translations in Phase 4.

## Prerequisites

- Access to the `messages/` directory
- Understanding of JSON file format
- Familiarity with the target language
- Knowledge of medical/cosmetic terminology in the target language

## Translation Process

### Step 1: Prepare Your Environment

1. Open the `messages/` directory
2. Locate the placeholder file for your target language:
   - `ko.json` for Korean
   - `zh.json` for Chinese
   - `ja.json` for Japanese
3. Open `en.json` as your reference

### Step 2: Copy the Structure

1. Copy the entire structure from `en.json`
2. Paste it into your target language file
3. Remove the `_translationGuide` section (it's only for reference)
4. Keep all JSON keys exactly as they are in English

### Step 3: Translate the Values

**Important Rules:**

✅ **DO:**
- Translate only the text values (after the colon)
- Preserve all placeholders like `{query}`, `{count}`, etc.
- Maintain the same JSON structure
- Use appropriate formality for the culture
- Keep medical terminology accurate
- Test that translations fit in the UI

❌ **DON'T:**
- Change any JSON keys
- Remove or add new keys
- Modify placeholders
- Break JSON syntax
- Use machine translation without review

### Step 4: Handle Special Cases

#### Placeholders

Preserve placeholders exactly as they appear:

```json
// English
"resultsFor": "Results for \"{query}\""

// Korean - Keep {query} unchanged
"resultsFor": "\"{query}\"에 대한 결과"

// Chinese - Keep {query} unchanged
"resultsFor": "\"{query}\"的结果"

// Japanese - Keep {query} unchanged
"resultsFor": "\"{query}\"の検索結果"
```

#### Nested Objects

Maintain the same nesting structure:

```json
{
  "profile": {
    "languageOptions": {
      "en": "English",
      "ko": "한국어 (Korean)",
      "zh": "中文 (Chinese)",
      "ja": "日本語 (Japanese)"
    }
  }
}
```

#### Arrays and Lists

Keep array structures intact:

```json
{
  "profile": {
    "skinTypeOptions": {
      "dry": "건조함",      // Korean
      "oily": "지성",       // Korean
      "combination": "복합성" // Korean
    }
  }
}
```

### Step 5: Quality Assurance

Before submitting your translation:

- [ ] All keys from `en.json` are present
- [ ] No extra or missing keys
- [ ] All placeholders are preserved
- [ ] JSON syntax is valid (use a JSON validator)
- [ ] Translations are culturally appropriate
- [ ] Medical terms are accurate
- [ ] Text length is reasonable for UI
- [ ] File is saved with UTF-8 encoding
- [ ] No hardcoded English text remains

### Step 6: Testing

1. Save your translation file
2. Change the language in the app's profile settings
3. Navigate through all pages
4. Verify:
   - All text displays correctly
   - No English text appears
   - Placeholders are replaced with actual values
   - Text fits within UI elements
   - No layout breaks occur

### Step 7: Submit for Review

1. Have a native speaker review the translations
2. Test on actual devices (mobile, tablet, desktop)
3. Get feedback from the development team
4. Make necessary adjustments
5. Submit the final version

## Translation Guidelines by Language

### Korean (ko)

- Use formal/polite language (존댓말)
- Medical terms should use standard Korean medical terminology
- Consider text length - Korean can be longer than English
- Use appropriate particles (은/는, 이/가, etc.)

### Chinese (zh)

- Use Simplified Chinese (简体中文)
- Keep medical terminology consistent with mainland China standards
- Consider character count - Chinese is typically more concise
- Use appropriate measure words (量词)

### Japanese (ja)

- Use polite form (です/ます体)
- Medical terms should use standard Japanese medical terminology
- Consider text length - Japanese can be longer than English
- Use appropriate particles (は, が, を, etc.)

## Common Translation Challenges

### 1. Button Text Length

Some languages are more verbose. Ensure button text fits:

```json
// English: "Save" (4 chars)
// German: "Speichern" (9 chars)
// Solution: Use shorter alternatives if needed
```

### 2. Gender-Neutral Language

Some languages have gendered nouns. Choose inclusive options:

```json
// Consider using gender-neutral terms where possible
// Or provide both forms if culturally appropriate
```

### 3. Plural Forms

Some languages have complex plural rules:

```json
// English: "1 result" vs "2 results"
// Some languages have different forms for 1, 2-4, 5+
// Use next-intl's plural support if needed
```

### 4. Date and Time Formats

Different cultures format dates differently:

```json
// US: MM/DD/YYYY
// Korea: YYYY.MM.DD
// China: YYYY年MM月DD日
// Ensure date formatting respects locale
```

## Tools and Resources

### Recommended Tools

- **JSON Validator**: https://jsonlint.com/
- **UTF-8 Checker**: Ensure proper encoding
- **Translation Memory**: Consider using CAT tools for consistency

### Medical Terminology Resources

- **Korean**: 대한의학회 의학용어집
- **Chinese**: 中国医学术语
- **Japanese**: 日本医学会医学用語辞典

### Testing Tools

- Browser DevTools for testing different locales
- Mobile device simulators
- Screen readers for accessibility

## Maintenance

### Adding New Keys

When new features are added:

1. Add the English key to `en.json`
2. Mark it as "TODO" in other language files
3. Notify translators of new keys
4. Update all languages before release

### Updating Existing Translations

When translations need updates:

1. Update `en.json` first
2. Add a comment noting the change
3. Update other languages
4. Test all affected pages

## Contact

For questions about the translation process:

- Technical issues: Contact the development team
- Translation questions: Contact the localization team
- Medical terminology: Consult with medical professionals

## Version History

- **v1.0** (Phase 1): English only, infrastructure setup
- **v2.0** (Phase 4): Korean, Chinese, Japanese to be added

---

**Remember**: Quality translations are crucial for user experience. Take your time, ask questions, and test thoroughly!
