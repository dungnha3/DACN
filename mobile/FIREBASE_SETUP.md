# Firebase Setup Guide for Mobile App

To enable Push Notifications, you need to set up a Firebase project.

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the setup steps.

## 2. Add Android App
1. In the Firebase Console, click the **Android** icon.
2. Register the app with package name: `com.enterprise.management.mobile` (or check `android/app/build.gradle` applicationId).
3. Download `google-services.json`.
4. Place the file in `mobile/android/app/google-services.json`.

## 3. Add iOS App (Optional for now)
1. Click the **iOS** icon.
2. Register with Bundle ID.
3. Download `GoogleService-Info.plist`.
4. Place it in `mobile/ios/Runner/`.

## 4. Configure Backend
1. Go to **Project Settings** > **Service accounts**.
2. Click **Generate new private key**.
3. Save the JSON file.
4. Update your Spring Boot backend configuration to point to this file for FCM integration.

## 5. Run the App
After adding the configuration files, you can run the app:
```bash
cd mobile
flutter run
```
