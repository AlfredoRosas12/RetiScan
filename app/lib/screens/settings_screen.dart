import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';
import '../services/theme_service.dart';
import '../services/patient_service.dart';
import '../services/permission_service.dart';
import 'login_screen.dart';
import 'retiscan_loading_screen.dart';
import 'policy_screen.dart';
import 'terms_of_use_screen.dart';

class SettingsScreen extends StatefulWidget {
  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final AuthService _authService = AuthService();
  bool _notificationsEnabled = true;
  bool _developerMode = false;

  String? _realName;
  bool _isLoadingName = false;

  @override
  void initState() {
    super.initState();
    // Solo carga el estado del modo dev si el usuario es @yada.com
    _loadDeveloperMode();
    _fetchRealName();
    _loadNotificationsPreference();
  }

  Future<void> _loadNotificationsPreference() async {
    final prefs = await SharedPreferences.getInstance();
    final savedPref = prefs.getBool('notifications_enabled') ?? true;

    if (kIsWeb) {
      final actualStatus = await PermissionService.checkNotificationPermissionStatus();
      if (mounted) {
        setState(() {
          _notificationsEnabled = actualStatus;
        });
        await prefs.setBool('notifications_enabled', actualStatus);
      }
    } else {
      if (mounted) {
        setState(() {
          _notificationsEnabled = savedPref;
        });
      }
    }
  }

  Future<void> _saveNotificationsPreference(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notifications_enabled', value);
  }

  Future<void> _fetchRealName() async {
    final user = _authService.currentUser;
    if (user == null) return;
    
    // Si ya tenemos el nombre en el User, usamos ese
    if (user.name != null && user.name!.isNotEmpty) {
      if (mounted) {
        setState(() => _realName = user.name);
      }
      return;
    }

    // De lo contrario intentamos buscar en el perfil del paciente
    if (user.isPatient) {
      if (mounted) setState(() => _isLoadingName = true);
      try {
        final patientService = PatientService();
        final patient = await patientService.getMyRecord();
        if (mounted) {
          setState(() {
            _realName = patient.fullName;
          });
        }
      } catch (e) {
        debugPrint('Error fetch real name: $e');
      } finally {
        if (mounted) setState(() => _isLoadingName = false);
      }
    }
  }

  Future<void> _loadDeveloperMode() async {
    if (!_authService.isDeveloper) return;
    // SharedPreferences solo para el toggle de modo desarrollador
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _developerMode = prefs.getBool('dev_mode') ?? false;
      });
    }
  }

  Future<void> _saveDeveloperMode(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('dev_mode', value);
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 800;

    final bgColor = Theme.of(context).scaffoldBackgroundColor;
    final cardColor = Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface;
    final primaryColor = Theme.of(context).colorScheme.primary;
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey;

    return Container(
      color: bgColor,
      child: Column(
        children: [
          // Drawer Header - Solo mostrar en móvil (no en el drawer de Desktop donde ya hay header)
          if (!isDesktop)
            Container(
              padding: EdgeInsets.fromLTRB(24, 48, 24, 24),
              decoration: BoxDecoration(
                color: cardColor,
                border: Border(bottom: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.1))),
              ),
              child: Row(
                children: [
                  Icon(Icons.settings_outlined, color: primaryColor, size: 28),
                  SizedBox(width: 16),
                  Text(
                    'Ajustes',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: textPrimary,
                    ),
                  ),
                  Spacer(),
                  IconButton(
                    icon: Icon(Icons.close, color: textSecondary),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
          // Settings Content
          Expanded(
            child: ListView(
              children: [
                _buildUserInfoSection(),
                Divider(height: 1, color: Colors.white.withOpacity(0.05)),
                SizedBox(height: 8),
                _buildSettingsSection(),
                Divider(height: 1, color: Colors.white.withOpacity(0.05)),
                SizedBox(height: 8),
                if (_authService.isDeveloper) ...[
                  _buildDeveloperSection(),
                  Divider(height: 1, color: Colors.white.withOpacity(0.05)),
                  SizedBox(height: 8),
                ],
                if (!isDesktop) _buildAccountSection(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUserInfoSection() {
    final user = _authService.currentUser;
    final cardColor = Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface;
    final primaryColor = Theme.of(context).colorScheme.primary;
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey;

    return Container(
      padding: EdgeInsets.all(24),
      margin: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: primaryColor.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 36,
            backgroundColor: primaryColor.withOpacity(0.2),
            child: Icon(
              user?.isDoctor ?? false
                      ? Icons.medical_services
                      : Icons.person,
              size: 32,
              color: primaryColor,
            ),
          ),
          SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _isLoadingName 
                    ? SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2))
                    : Text(
                        _realName ?? user?.fullName ?? user?.email ?? 'Usuario de RetiScan',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: textPrimary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                SizedBox(height: 4),
                Text(
                  user?.email ?? '',
                  style: TextStyle(
                    fontSize: 14,
                    color: textSecondary,
                  ),
                ),
                SizedBox(height: 12),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: primaryColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                        user?.isDoctor ?? false
                            ? 'Médico'
                            : 'Paciente',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context).colorScheme.onPrimary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsSection() {
    final themeService = Provider.of<ThemeService>(context);
    final primaryColor = Theme.of(context).colorScheme.primary;
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: Text(
            'OPCIONES GENERALES',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
              color: textSecondary,
            ),
          ),
        ),
        // Modo dinámico: muestra "Modo Oscuro" cuando está en claro, y viceversa
        ListTile(
          contentPadding: EdgeInsets.symmetric(horizontal: 24),
          leading: Icon(
            themeService.isDarkMode ? Icons.dark_mode : Icons.light_mode,
            color: primaryColor,
          ),
          title: Text(
            themeService.isDarkMode ? 'Modo Claro' : 'Modo Oscuro',
            style: TextStyle(fontWeight: FontWeight.w500, color: textPrimary),
          ),
          trailing: Switch(
            value: themeService.isDarkMode,
            onChanged: (value) {
              themeService.toggleTheme();
            },
            activeColor: primaryColor,
          ),
        ),
        ListTile(
          contentPadding: EdgeInsets.symmetric(horizontal: 24),
          leading: Icon(Icons.notifications_outlined, color: primaryColor),
          title: Text('Notificaciones', style: TextStyle(fontWeight: FontWeight.w500, color: textPrimary)),
          trailing: Switch(
            value: _notificationsEnabled,
            onChanged: (value) async {
              if (value) {
                final hasPermission = await PermissionService.requestNotificationPermission();
                if (hasPermission) {
                  setState(() {
                    _notificationsEnabled = true;
                  });
                  _saveNotificationsPreference(true);
                } else {
                  if (mounted) {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: Text('Permiso requerido'),
                        content: Text(
                          'Las notificaciones están deshabilitadas. Por favor, habilítalas desde la configuración de tu dispositivo para recibir alertas.',
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: Text('Cancelar'),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                              openAppSettings();
                            },
                            child: Text('Configuración'),
                          ),
                        ],
                      ),
                    );
                  }
                  setState(() {
                    _notificationsEnabled = false;
                  });
                  _saveNotificationsPreference(false);
                }
              } else {
                if (kIsWeb) {
                  if (mounted) {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: Text('Desactivar notificaciones'),
                        content: Text(
                          'Para desactivar las notificaciones, debes ir a la configuración de tu navegador:\n\n'
                          '1. Haz clic en el ícono de candado o información junto a la URL\n'
                          '2. Busca la opción de "Notificaciones"\n'
                          '3. Cambia el permiso a "Bloquear"\n\n'
                          'Las notificaciones se desactivarán la próxima vez que recargues la página.',
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: Text('Cerrar'),
                          ),
                        ],
                      ),
                    );
                  }
                } else {
                  setState(() {
                    _notificationsEnabled = false;
                  });
                  _saveNotificationsPreference(false);
                }
              }
            },
            activeColor: primaryColor,
          ),
        ),
        // Privacidad - Navega a PolicyScreen
        ListTile(
          contentPadding: EdgeInsets.symmetric(horizontal: 24),
          leading: Icon(Icons.security_outlined, color: primaryColor),
          title: Text('Privacidad', style: TextStyle(fontWeight: FontWeight.w500, color: textPrimary)),
          trailing: Icon(Icons.arrow_forward_ios, size: 16, color: textSecondary),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => PolicyScreen()),
            );
          },
        ),
        // Términos de Uso - Navega a TermsOfUseScreen
        ListTile(
          contentPadding: EdgeInsets.symmetric(horizontal: 24),
          leading: Icon(Icons.description_outlined, color: primaryColor),
          title: Text('Términos de Uso', style: TextStyle(fontWeight: FontWeight.w500, color: textPrimary)),
          trailing: Icon(Icons.arrow_forward_ios, size: 16, color: textSecondary),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => TermsOfUseScreen()),
            );
          },
        ),
        // TODO: Ayuda y Soporte - Pendiente de implementación futura
        // ListTile(
        //   contentPadding: EdgeInsets.symmetric(horizontal: 24),
        //   leading: Icon(Icons.help_outline, color: primaryColor),
        //   title: Text('Ayuda y Soporte', style: TextStyle(fontWeight: FontWeight.w500, color: textPrimary)),
        //   trailing: Icon(Icons.arrow_forward_ios, size: 16, color: textSecondary),
        //   onTap: () {
        //     // TODO: Implementar navegación a pantalla de Ayuda y Soporte
        //   },
        // ),
      ],
    );
  }

  Widget _buildDeveloperSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: Row(
            children: [
              Icon(Icons.code, size: 16, color: Colors.orangeAccent),
              SizedBox(width: 8),
              Text(
                'OPCIONES DE DESARROLLADOR',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                  color: Colors.orangeAccent,
                ),
              ),
            ],
          ),
        ),
        ListTile(
          contentPadding: EdgeInsets.symmetric(horizontal: 24),
          leading: Icon(Icons.bug_report_outlined, color: Colors.orangeAccent),
          title: Text('Modo Desarrollador', style: TextStyle(fontWeight: FontWeight.w500, color: Colors.white)),
          trailing: Switch(
            value: _developerMode,
            onChanged: (value) {
              setState(() => _developerMode = value);
              _saveDeveloperMode(value);
            },
            activeColor: Colors.orangeAccent,
          ),
        ),
        if (_developerMode) ...[
          Container(
            margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.orangeAccent.withOpacity(0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.orangeAccent.withOpacity(0.2)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.swap_horiz, color: Colors.orangeAccent, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Cambiar Rol',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.orangeAccent,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12),
                Text(
                  'Rol actual: ${_authService.isDoctor ? "Doctor" : "Paciente"}',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                  ),
                ),
                SizedBox(height: 12),
                Text(
                  'Nota: El cambio de rol sólo es posible con cuentas reales en la API.',
                  style: TextStyle(
                    fontSize: 12,
                    color: Color(0xFF9CA3AF),
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
          ListTile(
            leading: Icon(Icons.delete_outline, color: Colors.redAccent),
            title: Text('Cerrar sesión y limpiar datos', style: TextStyle(color: Colors.white)),
            subtitle: Text('Elimina la sesión activa', style: TextStyle(color: Color(0xFF9CA3AF))),
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  backgroundColor: Color(0xFF16213E),
                  title: Text('Limpiar Datos', style: TextStyle(color: Colors.white)),
                  content: Text(
                      '¿Estás seguro? Se cerrará tu sesión y se limpiarán los datos de la app.',
                      style: TextStyle(color: Color(0xFF9CA3AF))),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: Text('Cancelar', style: TextStyle(color: Color(0xFF9CA3AF))),
                    ),
                    TextButton(
                      onPressed: () async {
                        await _authService.clearStorage();
                        Navigator.pop(context);
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                              builder: (context) => LoginScreen()),
                          (route) => false,
                        );
                      },
                      child: Text(
                        'Limpiar',
                        style: TextStyle(color: Colors.redAccent),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ],
    );
  }

  Widget _buildAccountSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: Text(
            'CUENTA',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
              color: Color(0xFF9CA3AF),
            ),
          ),
        ),
        ListTile(
          contentPadding: EdgeInsets.symmetric(horizontal: 24),
          leading: Icon(Icons.exit_to_app, color: Color(0xFFE63946)),
          title: Text(
            'Cerrar Sesión',
            style: TextStyle(color: Color(0xFFE63946), fontWeight: FontWeight.bold),
          ),
          onTap: () {
            Navigator.pushReplacement(
              context,
              PageRouteBuilder(
                pageBuilder: (context, animation, secondaryAnimation) =>
                    RetiScanLoadingScreen(
                      statusText: 'CERRANDO SESIÓN',
                      onLoad: () => _authService.logout(),
                      onNavigate: () => LoginScreen(),
                    ),
                transitionsBuilder: (context, animation, secondaryAnimation, child) {
                  return FadeTransition(opacity: animation, child: child);
                },
                transitionDuration: Duration(milliseconds: 600),
              ),
            );
          },
        ),
        SizedBox(height: 32),
      ],
    );
  }
}