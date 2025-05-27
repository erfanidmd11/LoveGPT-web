# LoveGPT Shared Data

This project contains shared data and utilities used by the LoveGPT application, including gender-specific Zodiac profiles, personality data, and helper functions for generating personalized user stories.

## Folder Structure

- **lib/**: Contains Zodiac-related data, including detailed profiles for each Zodiac sign and gender.
- **types/**: Contains TypeScript types used for defining data structures like Zodiac profiles.
- **zodiac.ts**: Contains utility functions for retrieving Zodiac-related information.
- **zodiacPersonalityMap.ts**: Maps gender-specific Zodiac profiles used in generating personalized content for ARIA.

## How to Use

1. **Install Dependencies**:
   This module is a shared resource that is used in both the web and mobile parts of LoveGPT. To use it, simply install it as a local dependency in your web or mobile project.

   ```bash
   npm install lovegpt-shared
