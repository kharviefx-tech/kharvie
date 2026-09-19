# Kharvie Store Release Package

## App identity
- App name: Kharvie
- Bundle ID / Android application ID: `com.kharvie.music`
- Version: `1.0.0`
- Website: https://kharviefx-tech.github.io/kharvie/
- Official artist: Kharvie (Victor Avannah)
- Category: Music / Entertainment

## Architecture
The native iOS and Android shells use the same Kharvie web application and Supabase-backed settings/content layer. This keeps the public website, PWA and store apps aligned instead of maintaining separate content databases.

## Android
Google Play requires new apps to be published as Android App Bundles (AAB). New apps submitted from August 31, 2026 must target Android 16 / API 36 or higher.

Recommended release configuration:
- Application ID: `com.kharvie.music`
- versionCode: `1`
- versionName: `1.0.0`
- targetSdk: `36`
- minSdk: `23`
- Build output: `app-release.aab`
- Play App Signing: enabled

## iOS
Create the App Store Connect record with:
- Bundle ID: `com.kharvie.music`
- Name: `Kharvie`
- Version: `1.0`
- Primary category: Music
- Distribution: App Store

Apple's current submission requirements require current SDK/Xcode compliance, app metadata, age rating, privacy details and an uploaded build before review.

## Required store assets
Prepare these before submission:
- 1024x1024 master app icon
- iPhone screenshots
- iPad screenshots if iPad support is enabled
- Android phone screenshots
- Android tablet screenshots if supported
- Feature graphic for Google Play
- Privacy policy URL
- Support/contact URL
- Store description and keywords
- Age/content rating information

## Release checklist
1. Install Node.js and run `npm install`.
2. Run `npm run build`.
3. Run `npx cap add android` and `npx cap add ios` once in a local development environment.
4. Run `npx cap sync` after web changes.
5. Android: build a signed release AAB with target API 36.
6. iOS: open the generated Xcode project, set the Apple Developer Team, signing and capabilities, then archive/upload to App Store Connect.
7. Test the production builds before submission.
8. Complete store metadata, privacy, ratings and screenshots.
9. Submit to Google Play review and Apple App Review.

## Important
The repository now contains the cross-platform app configuration, but store signing certificates, Apple Developer credentials, Google Play signing credentials and the actual store submissions must be performed through the respective developer accounts. Those credentials should never be committed to this repository.
