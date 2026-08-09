import 'dart:io' if (dart.library.js) 'dart:html' as html;
import 'package:flutter/foundation.dart';
import 'package:permission_handler/permission_handler.dart';

class PermissionService {
  static Future<bool> requestCameraPermission() async {
    if (kIsWeb) {
      return true;
    }
    final status = await Permission.camera.request();
    return status.isGranted;
  }

  static Future<bool> requestStoragePermission() async {
    if (kIsWeb) {
      return true;
    }
    final status = await Permission.storage.request();
    return status.isGranted;
  }

  static Future<bool> checkNotificationPermissionStatus() async {
    if (kIsWeb) {
      try {
        return html.Notification.permission == 'granted';
      } catch (e) {
        return false;
      }
    }
    return await Permission.notification.isGranted;
  }

  static Future<bool> requestNotificationPermission() async {
    if (kIsWeb) {
      try {
        final permission = await html.Notification.requestPermission();
        return permission == 'granted';
      } catch (e) {
        return false;
      }
    }
    final status = await Permission.notification.request();
    return status.isGranted;
  }
}
