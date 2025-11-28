import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../config/navigation.dart';
import '../data/services/api_service.dart';

class FirebaseNotificationService {
  static final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  static final FlutterLocalNotificationsPlugin _flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  static Future<void> initialize() async {
    try {
      if (kIsWeb) {
        debugPrint('Skipping Firebase initialization on Web');
        return;
      }
      await Firebase.initializeApp();
      
      // 1. Request permission
      await _requestPermission();

      // 2. Setup Local Notifications (for foreground display)
      await _setupLocalNotifications();

      // 3. Get FCM token with timeout
      String? token = await _firebaseMessaging.getToken().timeout(
        const Duration(seconds: 5),
        onTimeout: () {
          debugPrint('FCM token fetch timed out');
          return null;
        },
      );

      // 4. Send to backend if logged in
      if (token != null) {
        await _sendTokenToBackend(token);
      }

      // 5. Listen for token refresh
      _firebaseMessaging.onTokenRefresh.listen(_sendTokenToBackend);

      // 6. Setup handlers
      FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
      FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageOpenedApp);
      
      // Check if app was opened from a terminated state
      RemoteMessage? initialMessage = await _firebaseMessaging.getInitialMessage();
      if (initialMessage != null) {
        _handleMessageOpenedApp(initialMessage);
      }
    } catch (e) {
      debugPrint('Error initializing Firebase Notification Service: $e');
    }
  }

  static Future<void> _requestPermission() async {
    await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
  }

  static Future<void> _setupLocalNotifications() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    final InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
    );

    await _flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        // Handle local notification tap
      },
    );
  }

  static Future<void> _handleForegroundMessage(RemoteMessage message) async {
    if (message.notification != null) {
      // Show local notification
      const AndroidNotificationDetails androidPlatformChannelSpecifics =
          AndroidNotificationDetails(
        'high_importance_channel', // id
        'High Importance Notifications', // title
        importance: Importance.max,
        priority: Priority.high,
      );
      const NotificationDetails platformChannelSpecifics =
          NotificationDetails(android: androidPlatformChannelSpecifics);

      await _flutterLocalNotificationsPlugin.show(
        message.hashCode,
        message.notification?.title,
        message.notification?.body,
        platformChannelSpecifics,
        payload: message.data['link'], // Use link as payload
      );
    }
  }

  static void _handleMessageOpenedApp(RemoteMessage message) {
    // Navigate based on message.data['link'] or 'type'
    if (message.data.containsKey('link')) {
      String link = message.data['link'];
      // Remove leading slash if present to match named routes convention if needed
      // But usually named routes start with /
      navigatorKey.currentState?.pushNamed(link);
    }
  }

  static Future<void> _sendTokenToBackend(String token) async {
    // Check if user is logged in
    // Note: You might need to expose a method in AuthService to check login status or get token
    // For now, we assume ApiService handles auth headers and we just call the endpoint
    
    try {
      final apiService = ApiService();
      await apiService.put('/profile/fcm-token', {'token': token});
    } catch (e) {
      // Ignore error
    }
  }
}
