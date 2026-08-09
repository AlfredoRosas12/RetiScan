import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/retiscan_loading_screen.dart';
import 'screens/login_screen.dart';
import 'screens/complete_profile_screen.dart';
import 'screens/home_screen.dart';
import 'services/auth_service.dart';
import 'services/theme_service.dart';
import 'services/notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializar SharedPreferences primero
  await SharedPreferences.getInstance();

  // Esperar a que ThemeService cargue la preferencia del tema
  final themeService = ThemeService();
  await themeService.loadTheme();

  // Inicializar notificaciones (con guard para web en notification_service)
  await NotificationService.initialize();

  runApp(
    ChangeNotifierProvider.value(
      value: themeService,
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  build(BuildContext context) {
    final themeService = Provider.of<ThemeService>(context);

    return MaterialApp(
      title: 'RetiScan',
      theme: themeService.lightTheme,
      darkTheme: themeService.darkTheme,
      themeMode: themeService.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: _SplashWrapper(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class _SplashWrapper extends StatelessWidget {
  final AuthService _authService = AuthService();

  @override
  Widget build(BuildContext context) {
    return RetiScanLoadingScreen(
      statusText: 'INICIALIZANDO',
      onLoad: () => _authService.loadUserFromSession(),
      onNavigate: () {
        final isAuthenticated = _authService.isAuthenticated;
        final user = _authService.currentUser;

        if (!isAuthenticated) return LoginScreen();
        if (user != null && user.isPatient && !user.isVerified) {
          return CompleteProfileScreen();
        }
        return HomeScreen();
      },
    );
  }
}
