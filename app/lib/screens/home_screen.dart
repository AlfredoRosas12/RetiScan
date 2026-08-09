import 'package:flutter/material.dart';
import 'capture_screen.dart';
import 'recommendations_screen.dart';
import 'history_screen.dart';
import 'profile_screen.dart';
import 'settings_screen.dart';
import 'patient_management_screen.dart';
import 'retiscan_loading_screen.dart';
import 'login_screen.dart';
import '../services/auth_service.dart';
import '../services/patient_service.dart';
import '../services/analysis_service.dart';
import '../models/analysis.dart';
import '../widgets/dashboard_charts.dart';

// Las referencias de color se obtendrán ahora directamente del Theme
// para soportar tanto modo claro como modo oscuro dinámicamente.

// HOME SCREEN (Shell de navegación)
class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  int _currentIndex = 0;
  final AuthService _authService = AuthService();

  // Pantallas según rol y plataforma
  // Callback para navegar entre pantallas desde HomeContent
  void _navigateToTab(int index) {
    setState(() => _currentIndex = index);
  }

  List<Widget> _getScreens({required bool isDesktop}) {
    if (_authService.isDoctor) {
      if (isDesktop) {
        return [
          HomeContent(onNavigate: _navigateToTab),
          CaptureScreen(),
          PatientManagementScreen(),
          ProfileScreen(),
          SettingsScreen(),
        ];
      } else {
        return [
          HomeContent(onNavigate: _navigateToTab),
          CaptureScreen(),
          PatientManagementScreen(),
          ProfileScreen(),
        ];
      }
    } else {
      if (isDesktop) {
        return [
          HomeContent(onNavigate: _navigateToTab),
          RecommendationsScreen(),
          HistoryScreen(),
          ProfileScreen(),
          SettingsScreen(),
        ];
      } else {
        return [
          HomeContent(onNavigate: _navigateToTab),
          RecommendationsScreen(),
          HistoryScreen(),
          ProfileScreen(),
        ];
      }
    }
  }

  // Items de navegación
  List<_NavItem> _getNavItems({required bool isDesktop}) {
    if (_authService.isDoctor) {
      if (isDesktop) {
        return [
          _NavItem(Icons.dashboard_outlined, Icons.dashboard, 'Inicio'),
          _NavItem(Icons.camera_alt_outlined, Icons.camera_alt, 'Captura'),
          _NavItem(Icons.people_outline, Icons.people, 'Pacientes'),
          _NavItem(Icons.person_outline, Icons.person, 'Perfil'),
        ];
      } else {
        return [
          _NavItem(Icons.dashboard_outlined, Icons.dashboard, 'Inicio'),
          _NavItem(Icons.camera_alt_outlined, Icons.camera_alt, 'Captura'),
          _NavItem(Icons.people_outline, Icons.people, 'Pacientes'),
          _NavItem(Icons.person_outline, Icons.person, 'Perfil'),
        ];
      }
    } else {
      if (isDesktop) {
        return [
          _NavItem(Icons.dashboard_outlined, Icons.dashboard, 'Inicio'),
          _NavItem(Icons.recommend_outlined, Icons.recommend, 'Recomendaciones'),
          _NavItem(Icons.history_outlined, Icons.history, 'Histórico'),
          _NavItem(Icons.person_outline, Icons.person, 'Perfil'),
        ];
      } else {
        return [
          _NavItem(Icons.dashboard_outlined, Icons.dashboard, 'Inicio'),
          _NavItem(Icons.recommend_outlined, Icons.recommend, 'Recs.'),
          _NavItem(Icons.history_outlined, Icons.history, 'Histórico'),
          _NavItem(Icons.person_outline, Icons.person, 'Perfil'),
        ];
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= 800;
        final screens = _getScreens(isDesktop: isDesktop);
        final navItems = _getNavItems(isDesktop: isDesktop);
        // Clamp index if switching between layouts with different item counts
        if (_currentIndex >= screens.length) {
          _currentIndex = 0;
        }
        if (isDesktop) {
          return _buildDesktopLayout(screens, navItems);
        }
        return _buildMobileLayout(screens, navItems);
      },
    );
  }

  // LAYOUT ESCRITORIO (Sidebar + contenido)
  Widget _buildDesktopLayout(List<Widget> screens, List<_NavItem> navItems) {
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;
    final bgColor = Theme.of(context).scaffoldBackgroundColor;
    final cardColor = Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = isDark ? Colors.white70 : (Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey);

    return Scaffold(
      backgroundColor: bgColor,
      body: Row(
        children: [
          // Sidebar
          Container(
            width: 260,
            decoration: BoxDecoration(
              color: cardColor,
              border: Border(
                right: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.1)),
              ),
            ),
            child: Column(
              children: [
                SizedBox(height: 40),
                // Logo + Badge (Imagen 4)
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24),
                  child: Row(
                    children: [
                      Image.asset('assets/ilustrator/OJO_RETISCAN.png', width: 32, height: 32),
                      SizedBox(width: 12),
                      Text(
                        'RetiScan',
                        style: TextStyle(
                          color: textPrimary,
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                          letterSpacing: 0.5,
                        ),
                      ),
                      SizedBox(width: 10),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: primaryColor.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          _authService.isDoctor ? 'Médico' : 'Paciente',
                          style: TextStyle(
                            color: primaryColor,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 40),
                // Nav items
                ...navItems.asMap().entries.map((entry) {
                  final i = entry.key;
                  final item = entry.value;
                  final isSelected = _currentIndex == i;
                  return Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () => setState(() => _currentIndex = i),
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          decoration: BoxDecoration(
                            color: isSelected ? primaryColor.withOpacity(0.15) : Colors.transparent,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                isSelected ? item.activeIcon : item.icon,
                                color: isSelected ? primaryColor : textSecondary,
                                size: 22,
                              ),
                              SizedBox(width: 14),
                              Text(
                                item.label,
                                style: TextStyle(
                                  color: isSelected ? primaryColor : textSecondary,
                                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                                  fontSize: 15,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
                Spacer(),
                Divider(color: Theme.of(context).dividerColor.withOpacity(0.1), indent: 24, endIndent: 24),
                // Ajustes
                _buildSidebarFooterItem(Icons.settings_outlined, 'Ajustes', () {
                  setState(() => _currentIndex = screens.length - 1);
                }, textSecondary),
                // Cerrar Sesión
                _buildSidebarFooterItem(Icons.logout, 'Cerrar Sesión', () {
                  Navigator.of(context).pushReplacement(
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
                }, Theme.of(context).colorScheme.error),
                SizedBox(height: 24),
              ],
            ),
          ),
          // Contenido principal
          Expanded(
            child: _currentIndex == 0
                ? Scrollbar(
                    thumbVisibility: true,
                    child: SingleChildScrollView(
                      child: AnimatedSwitcher(
                        duration: Duration(milliseconds: 300),
                        child: screens[_currentIndex],
                      ),
                    ),
                  )
                : AnimatedSwitcher(
                    duration: Duration(milliseconds: 300),
                    child: screens[_currentIndex],
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildSidebarFooterItem(IconData icon, String label, VoidCallback onTap, Color iconColor) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                Icon(icon, color: iconColor, size: 22),
                SizedBox(width: 14),
                Text(label, style: TextStyle(color: iconColor, fontSize: 15)),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // LAYOUT MÓVIL (AppBar + BottomNav + FAB)
  Widget _buildMobileLayout(List<Widget> screens, List<_NavItem> navItems) {
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;
    final bgColor = Theme.of(context).scaffoldBackgroundColor;
    final cardColor = Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = isDark ? Colors.white70 : (Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey);

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: bgColor,
        elevation: 0,
        title: Row(
          children: [
            Image.asset('assets/ilustrator/OJO_RETISCAN.png', width: 28, height: 28),
            SizedBox(width: 10),
            Text(
              'RetiScan',
              style: TextStyle(
                color: textPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
            ),
            SizedBox(width: 8),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: primaryColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                _authService.isDoctor ? 'Médico' : 'Paciente',
                style: TextStyle(
                  fontSize: 11,
                  color: primaryColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        actions: [
          Builder(
            builder: (context) => IconButton(
              icon: Icon(Icons.settings_outlined, color: textSecondary),
              onPressed: () => Scaffold.of(context).openEndDrawer(),
            ),
          ),
        ],
      ),
      endDrawer: Drawer(child: SettingsScreen()),
      body: AnimatedSwitcher(
        duration: Duration(milliseconds: 300),
        child: screens[_currentIndex],
      ),
      // TODO: FAB central - Pendiente de implementación futura
      // floatingActionButton: _authService.isDoctor
      //     ? FloatingActionButton(
      //         onPressed: () {
      //           Navigator.push(context, MaterialPageRoute(builder: (_) => CaptureScreen()));
      //         },
      //         backgroundColor: primaryColor,
      //         elevation: 8,
      //         shape: CircleBorder(),
      //         child: Icon(Icons.camera_alt, color: Theme.of(context).colorScheme.onPrimary, size: 28),
      //       )
      //     : null,
      // floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      // Animated Bottom Nav - Estilo Meniscus
      bottomNavigationBar: AnimatedBottomNav(
        currentIndex: _currentIndex,
        items: navItems,
        onTap: (index) => setState(() => _currentIndex = index),
        activeColor: primaryColor,
        inactiveColor: textSecondary,
        backgroundColor: cardColor,
      ),
    );
  }
}

// Helper class para items de navegación
class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  _NavItem(this.icon, this.activeIcon, this.label);
}

// Animated Bottom Navigation Bar - Estilo Meniscus
class AnimatedBottomNav extends StatelessWidget {
  final int currentIndex;
  final List<_NavItem> items;
  final Function(int) onTap;
  final Color activeColor;
  final Color inactiveColor;
  final Color backgroundColor;

  const AnimatedBottomNav({
    Key? key,
    required this.currentIndex,
    required this.items,
    required this.onTap,
    required this.activeColor,
    required this.inactiveColor,
    required this.backgroundColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.fromLTRB(24, 0, 24, 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
           // Barra principal con íconos + labels integrados
           Container(
             height: 60,
             padding: EdgeInsets.symmetric(horizontal: 16),
             decoration: BoxDecoration(
               color: backgroundColor,
               borderRadius: BorderRadius.circular(30),
               boxShadow: [
                 BoxShadow(
                   color: Colors.black.withOpacity(0.2),
                   blurRadius: 24,
                   offset: Offset(0, 8),
                 ),
               ],
             ),
             child: Row(
               mainAxisAlignment: MainAxisAlignment.spaceAround,
               children: List.generate(items.length, (index) {
                 final item = items[index];
                 final isSelected = currentIndex == index;
                 return GestureDetector(
                   onTap: () => onTap(index),
                   behavior: HitTestBehavior.opaque,
                    child: SizedBox(
                      width: 56,
                      height: 60,
                     child: Stack(
                       clipBehavior: Clip.none,
                       alignment: Alignment.center,
                       children: [
                          // Glow circular (solo visible cuando está seleccionado)
                          AnimatedPositioned(
                            duration: Duration(milliseconds: 300),
                            curve: Curves.easeOutCubic,
                            top: isSelected ? 6 : 14,
                           child: AnimatedOpacity(
                             duration: Duration(milliseconds: 250),
                             opacity: isSelected ? 1.0 : 0.0,
                             child: Container(
                               width: 44,
                               height: 44,
                               decoration: BoxDecoration(
                                 shape: BoxShape.circle,
                                 color: Colors.transparent,
                                 boxShadow: [
                                   BoxShadow(
                                     color: activeColor.withOpacity(0.4),
                                     blurRadius: 10,
                                     spreadRadius: 0,
                                   ),
                                   BoxShadow(
                                     color: activeColor.withOpacity(0.2),
                                     blurRadius: 20,
                                     spreadRadius: 2,
                                   ),
                                 ],
                               ),
                             ),
                           ),
                         ),
                          // Ícono (se mueve hacia arriba cuando está seleccionado)
                          AnimatedPositioned(
                            duration: Duration(milliseconds: 300),
                            curve: Curves.easeOutCubic,
                            top: isSelected ? 6 : 14,
                           child: AnimatedOpacity(
                             duration: Duration(milliseconds: 200),
                             opacity: isSelected ? 1.0 : 0.0,
                             child: AnimatedContainer(
                               duration: Duration(milliseconds: 200),
                               padding: EdgeInsets.all(6),
                               decoration: isSelected
                                   ? BoxDecoration(
                                       color: activeColor,
                                       shape: BoxShape.circle,
                                     )
                                   : null,
                               child: Icon(
                                 item.activeIcon,
                                 color: Colors.white,
                                 size: 22,
                               ),
                             ),
                           ),
                         ),
                          // Label (visible cuando NO está seleccionado)
                          AnimatedPositioned(
                            duration: Duration(milliseconds: 300),
                            curve: Curves.easeOutCubic,
                            top: isSelected ? 12 : 14,
                           child: AnimatedOpacity(
                             duration: Duration(milliseconds: 200),
                             opacity: isSelected ? 0.0 : 1.0,
                             child: Text(
                               item.label,
                               style: TextStyle(
                                 color: inactiveColor,
                                 fontSize: 11,
                                 fontWeight: FontWeight.w600,
                               ),
                             ),
                           ),
                         ),
                       ],
                     ),
                   ),
                 );
               }),
             ),
           ),
         ],
      ),
    );
  }
}

// Widget individual de cada tab (ya no se usa, integrado en AnimatedBottomNav)
class _NavItemWidget extends StatelessWidget {
  final _NavItem item;
  final bool isSelected;
  final Color activeColor;
  final Color inactiveColor;
  final VoidCallback onTap;

  const _NavItemWidget({
    Key? key,
    required this.item,
    required this.isSelected,
    required this.activeColor,
    required this.inactiveColor,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox.shrink();
  }
}

// HOME CONTENT (Dashboard principal)
class HomeContent extends StatefulWidget {
  final Function(int)? onNavigate;

  const HomeContent({this.onNavigate});

  @override
  _HomeContentState createState() => _HomeContentState();
}

class _HomeContentState extends State<HomeContent>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late List<Animation<Offset>> _slideAnimations;
  final AuthService _authService = AuthService();
  
  String? _realName;
  bool _isLoadingName = false;
  
  // Pacientes recientes reales (solo para el médico)
  List<dynamic> _recentPatients = [];
  bool _isLoadingPatients = false;
  int _totalPatientsCount = 0;
  int _doctorTotalAnalyses = 0;
  int _doctorAnalysesHoy = 0;
  int _doctorPendientes = 0;
  List<Analysis> _allDoctorAnalyses = []; // Para la gráfica

  // Análisis del paciente (solo para el paciente)
  List<Analysis> _patientAnalyses = [];
  bool _isLoadingAnalyses = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 600),
      vsync: this,
    );

    _slideAnimations = List.generate(
      6,
      (index) => Tween<Offset>(
        begin: Offset(0, 0.2),
        end: Offset.zero,
      ).animate(
        CurvedAnimation(
          parent: _controller,
          curve: Interval(
            index * 0.12,
            1.0,
            curve: Curves.easeOut,
          ),
        ),
      ),
    );

    _controller.forward();
    _fetchRealName();
    // Si es médico, cargar los últimos 3 pacientes reales
    if (_authService.isDoctor) {
      _fetchRecentPatients();
    } else {
      _fetchPatientAnalyses();
    }
  }

  Future<void> _fetchRecentPatients() async {
    if (mounted) setState(() => _isLoadingPatients = true);
    try {
      final patients = await PatientService().getPatients();
      
      int totalCount = 0;
      int todayCount = 0;
      int pendingCount = 0;
      List<Analysis> allAnalyses = [];
      
      // Obtenemos los análisis en paralelo
      await Future.wait(patients.map((p) async {
        totalCount += p.totalAnalyses;
        try {
          final analyses = await AnalysisService().getAnalysesByPatient(p.id);
          allAnalyses.addAll(analyses);
          final now = DateTime.now();
          for (var a in analyses) {
            if (a.isPending || a.isProcessing) pendingCount++;
            if (a.createdAt.year == now.year && 
                a.createdAt.month == now.month && 
                a.createdAt.day == now.day) {
              todayCount++;
            }
          }
        } catch (_) {}
      }));

      if (mounted) {
        setState(() {
          _totalPatientsCount = patients.length;
          _doctorTotalAnalyses = totalCount;
          _doctorAnalysesHoy = todayCount;
          _doctorPendientes = pendingCount;
          _allDoctorAnalyses = allAnalyses;
          _recentPatients = patients.take(3).toList();
        });
      }
    } catch (e) {
      debugPrint('Error cargando pacientes recientes: $e');
    } finally {
      if (mounted) setState(() => _isLoadingPatients = false);
    }
  }

  Future<void> _fetchPatientAnalyses() async {
    if (mounted) setState(() => _isLoadingAnalyses = true);
    try {
      final analyses = await AnalysisService().getMyAnalyses();
      if (mounted) {
        setState(() {
          _patientAnalyses = analyses;
        });
      }
    } catch (e) {
      debugPrint('Error cargando análisis del paciente: $e');
    } finally {
      if (mounted) setState(() => _isLoadingAnalyses = false);
    }
  }

  Future<void> _fetchRealName() async {
    final user = _authService.currentUser;
    if (user == null) return;
    
    // Si ya tenemos el nombre en el User, lo usamos
    if (user.name != null && user.name!.isNotEmpty) {
      if (mounted) {
        setState(() => _realName = user.name);
      }
      return;
    }

    // Buscamos en el perfil del paciente
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
        debugPrint('Error fetch real name in home: $e');
      } finally {
        if (mounted) setState(() => _isLoadingName = false);
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = _authService.currentUser;
    final isDoctor = user?.isDoctor ?? false;
    final userName = _realName ?? user?.fullName ?? user?.email ?? 'Usuario';

    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final isDesktop = constraints.maxWidth >= 1000;
          if (isDesktop) {
            return _buildDesktopContent(userName, isDoctor);
          }
          return _buildMobileContent(userName, isDoctor);
        },
      ),
    );
  }

  // LAYOUT MÓVIL (< 1000px) — Columna vertical
  Widget _buildMobileContent(String userName, bool isDoctor) {
    final hPadding = MediaQuery.of(context).size.width < 600 ? 16.0 : 24.0;

    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: 900),
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: hPadding, vertical: 24),
          child: SizedBox(
            width: double.infinity,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _animated(0, _buildWelcomeCard(context, userName, isDoctor)),
                SizedBox(height: 24),
                _animated(1, _buildStatsRow(context, isDoctor)),
                SizedBox(height: 28),
                _animated(2, _buildChartCard(context, isDoctor)),
                SizedBox(height: 28),
                _buildListSection(isDoctor),
                SizedBox(height: 28),
                _buildQuickActionsSection(isDoctor),
                SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // LAYOUT ESCRITORIO (>= 1000px) — 2 columnas
  Widget _buildDesktopContent(String userName, bool isDoctor) {
  return Padding(
    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 28),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _animated(0, _buildWelcomeCard(context, userName, isDoctor)),
        SizedBox(height: 28),
        _animated(1, _buildStatsRow(context, isDoctor)),
        SizedBox(height: 32),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 55,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _animated(2, _buildChartCard(context, isDoctor)),
                  SizedBox(height: 28),
                  _buildQuickActionsSection(isDoctor),
                ],
              ),
              ),
            SizedBox(width: 28),
            Expanded(
              flex: 45,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildListSection(isDoctor),
                ],
              ),
            ),
          ],
        ),
        SizedBox(height: 24),
      ],
    ),
  );
}

  // Secciones reutilizables
  Widget _buildListSection(bool isDoctor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _animated(3, _buildSectionTitle(isDoctor ? 'Pacientes Recientes' : 'Últimos Análisis')),
        SizedBox(height: 12),
        if (isDoctor) ...[
          if (_isLoadingPatients)
            _animated(4, Center(child: Padding(
              padding: EdgeInsets.all(20),
              child: CircularProgressIndicator(),
            )))
          else if (_recentPatients.isEmpty)
            _animated(4, Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Center(child: Text('No hay pacientes registrados aún.', style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5)))),
            ))
          else
            ..._recentPatients.map((p) {
              final name = p.fullName ?? '—';
              final date = p.lastVisit != null
                  ? '${p.lastVisit!.day} ${_monthName(p.lastVisit!.month)} ${p.lastVisit!.year}'
                  : 'Sin visitas';
              return _animated(4, _buildPatientCard(name, 'Activo', date));
            }).toList(),
        ] else ...[
          if (_isLoadingAnalyses)
            _animated(4, Center(child: Padding(
              padding: EdgeInsets.all(20),
              child: CircularProgressIndicator(),
            )))
          else if (_patientAnalyses.isEmpty)
            _animated(4, Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Center(child: Text('Aún no tienes análisis.', style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5)))),
            ))
          else
            ..._patientAnalyses.take(3).map((a) {
              final grade = _translateGrade(a.aiResult?['grade']);
              final date = '${a.createdAt.day} ${_monthName(a.createdAt.month)} ${a.createdAt.year}';
              return _animated(4, _buildAnalysisCard(date, grade));
            }).toList(),
        ],
      ],
    );
  }

  Widget _buildQuickActionsSection(bool isDoctor) {
    final actions = <Widget>[];

    if (isDoctor) {
      actions.add(_animated(5, _buildQuickAction(Icons.camera_alt_outlined, 'Realizar captura de retina', () {
        widget.onNavigate?.call(1); // Navigate to CaptureScreen (index 1)
      })));
      actions.add(_animated(5, _buildQuickAction(Icons.people_outlined, 'Gestionar pacientes', () {
        widget.onNavigate?.call(2); // Navigate to PatientManagementScreen (index 2)
      })));
    } else {
      actions.add(_animated(5, _buildQuickAction(Icons.history_outlined, 'Ver análisis', () {
        widget.onNavigate?.call(2); // Navigate to HistoryScreen (index 2)
      })));
      actions.add(_animated(5, _buildQuickAction(Icons.recommend_outlined, 'Ver recomendaciones', () {
        widget.onNavigate?.call(1); // Navigate to RecommendationsScreen (index 1)
      })));
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Acciones Rápidas'),
        SizedBox(height: 12),
        ...actions,
      ],
    );
  }

  // Traducción de las enfermedades
  String _translateGrade(String? grade) {
    switch (grade) {
      case 'No_DR': return 'Normal';
      case 'Mild': return 'Leve';
      case 'Moderate': return 'Moderado';
      case 'Severe': return 'Severo';
      case 'Proliferate_DR': return 'Proliferativa';
      default: return grade ?? 'Normal';
    }
  }

  // Convierte número de mes a nombre en español
  String _monthName(int month) {
    const names = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return names[month - 1];
  }

  Widget _animated(int index, Widget child) {
    return SlideTransition(
      position: _slideAnimations[index % _slideAnimations.length],
      child: FadeTransition(
        opacity: _controller,
        child: child,
      ),
    );
  }

  // Tarjeta de bienvenida
  Widget _buildWelcomeCard(BuildContext context, String name, bool isDoctor) {
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;
    final secondaryColor = Theme.of(context).colorScheme.secondary;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [primaryColor, secondaryColor],
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: primaryColor.withOpacity(0.35),
            blurRadius: 24,
            offset: Offset(0, 12),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            right: -30,
            top: -30,
            child: Opacity(
              opacity: 0.08,
              child: Image.asset('assets/ilustrator/OJO_RETISCAN.png', width: 120, height: 120),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                isDoctor ? '¡Bienvenido, Doctor!' : '¡Bienvenido!',
                style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 14),
              ),
              SizedBox(height: 6),
              _isLoadingName
                  ? SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : Text(
                      name,
                      style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
              SizedBox(height: 16),
              Text(
                isDoctor
                    ? 'Panel de gestión de pacientes y análisis'
                    : 'Tu salud visual es nuestra prioridad',
                style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 14),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Stats Row (contextualizado)
  Widget _buildStatsRow(BuildContext context, bool isDoctor) {
    final isDesktop = MediaQuery.of(context).size.width >= 1000;
    final spacing = isDesktop ? 16.0 : (MediaQuery.of(context).size.width < 600 ? 8.0 : 12.0);

    if (isDoctor) {
      return Row(
        children: [
          Expanded(child: _buildStatCard(Icons.people, 'Pacientes', _isLoadingPatients ? '...' : '$_totalPatientsCount')),
          SizedBox(width: spacing),
          Expanded(child: _buildStatCard(Icons.analytics_outlined, 'Análisis Hoy', _isLoadingPatients ? '...' : '$_doctorAnalysesHoy')),
          SizedBox(width: spacing),
          Expanded(child: _buildStatCard(Icons.pending_actions, 'Pendientes', _isLoadingPatients ? '...' : '$_doctorPendientes')),
        ],
      );
    }
    
    // Patient Stats
    final totalAnalyses = _isLoadingAnalyses ? '...' : '${_patientAnalyses.length}';
    final lastStatus = _patientAnalyses.isNotEmpty 
        ? _translateGrade(_patientAnalyses.first.aiResult?['grade'])
        : '—';
    final nextRev = _patientAnalyses.isNotEmpty 
        ? '${_patientAnalyses.first.createdAt.add(Duration(days: 365)).day} ${_monthName(_patientAnalyses.first.createdAt.add(Duration(days: 365)).month)}'
        : '—';

    return Row(
      children: [
        Expanded(child: _buildStatCard(Icons.visibility, 'Mis Análisis', totalAnalyses)),
        SizedBox(width: spacing),
        Expanded(child: _buildStatCard(Icons.check_circle_outline, 'Estado', lastStatus)),
        SizedBox(width: spacing),
        Expanded(child: _buildStatCard(Icons.calendar_today, 'Próxima Rev.', nextRev)),
      ],
    );
  }

  Widget _buildStatCard(IconData icon, String title, String value) {
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;

    return Container(
      padding: EdgeInsets.symmetric(vertical: 20, horizontal: 14),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: primaryColor.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: primaryColor, size: 22),
          ),
          SizedBox(height: 12),
          Text(title, style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7), fontSize: 11), textAlign: TextAlign.center),
          SizedBox(height: 6),
          Text(value, style: TextStyle(color: Theme.of(context).textTheme.bodyLarge?.color, fontSize: 18, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildChartCard(BuildContext context, bool isDoctor) {
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;
    final isDesktop = MediaQuery.of(context).size.width >= 1000;

    return Container(
      padding: EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                isDoctor ? 'Análisis por Mes' : 'Mi Progreso',
                style: TextStyle(color: Theme.of(context).textTheme.bodyLarge?.color, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(DateTime.now().year.toString(), style: TextStyle(color: primaryColor, fontSize: 12, fontWeight: FontWeight.w600)),
              ),
            ],
          ),
          SizedBox(height: 20),
          SizedBox(
            height: isDesktop ? 220 : 180,
            child: DashboardCharts(analyses: isDoctor ? _allDoctorAnalyses : _patientAnalyses),
          ),
          SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildLegendDot(Colors.yellow, isDoctor ? 'Normales' : 'Análisis'),
              SizedBox(width: 24),
              _buildLegendDot(Colors.green, isDoctor ? 'Con hallazgos' : 'Hallazgos'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegendDot(Color color, String label) {
    return Row(
      children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        SizedBox(width: 6),
        Text(label, style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 12)),
      ],
    );
  }

  // Títulos de sección
  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.8)),
    );
  }

  Widget _buildAnalysisCard(String date, String status) {
    final isNormal = status == 'Normal';
    final statusColor = isNormal ? Color(0xFF04B5A2) : Color(0xFFFEB33B);

    return Container(
      margin: EdgeInsets.only(bottom: 10),
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: statusColor.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isNormal ? Icons.check_circle : Icons.warning_amber_rounded,
              color: statusColor,
              size: 22,
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(date, style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: Theme.of(context).textTheme.bodyLarge?.color)),
                SizedBox(height: 4),
                Text('Estado: $status', style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7), fontSize: 13)),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(status.toUpperCase(), style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  // Tarjeta de paciente (doctor)
  Widget _buildPatientCard(String name, String status, String date) {
    final statusColor = status == 'Normal' ? Color(0xFF04B5A2)
        : status == 'Leve' ? Color(0xFFFEB33B)
        : Theme.of(context).colorScheme.error;

    return Container(
      margin: EdgeInsets.only(bottom: 10),
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.2),
            child: Icon(Icons.person, color: Theme.of(context).colorScheme.primary, size: 22),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: Theme.of(context).textTheme.bodyLarge?.color)),
                SizedBox(height: 4),
                Text(date, style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7), fontSize: 13)),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(status.toUpperCase(), style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  // Acciones rápidas
  Widget _buildQuickAction(IconData icon, String text, VoidCallback onTap) {
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;

    return Padding(
      padding: EdgeInsets.only(bottom: 10),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: primaryColor.withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: primaryColor.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: primaryColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: primaryColor, size: 20),
          ),
          SizedBox(width: 14),
          Expanded(
            child: Text(text, style: TextStyle(color: Theme.of(context).textTheme.bodyLarge?.color, fontSize: 14)),
          ),
          Icon(Icons.arrow_forward_ios, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5), size: 14),
        ],
      ),
    ),
    ),
    );
  }
}
