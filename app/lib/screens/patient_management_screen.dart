import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'dart:math' as math;
import 'package:another_flushbar/flushbar.dart';
import '../services/patient_service.dart';
import '../services/analysis_service.dart';
import '../models/patient.dart';
import '../models/analysis.dart';
import '../services/theme_service.dart';
import '../config/input_sanitizer.dart';
import '../widgets/responsive_wrapper.dart';
import '../widgets/glassmorphic_card.dart';
import '../widgets/animated_button.dart';
import '../widgets/patient_details_modal.dart';

class PatientManagementScreen extends StatefulWidget {
  @override
  _PatientManagementScreenState createState() => _PatientManagementScreenState();
}

class _PatientManagementScreenState extends State<PatientManagementScreen> {
  final PatientService _patientService = PatientService();
  bool _isLoading = false;

  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _paternalSurnameController = TextEditingController();
  final _maternalSurnameController = TextEditingController();

  String? _tempUsername;
  String? _tempPassword;
  
  List<Patient> _allPatients = [];
  List<Patient> _filteredPatients = [];
  bool _isLoadingPatients = true;

  // Búsqueda y Paginación
  String _searchQuery = '';
  int _currentPage = 1;
  final int _itemsPerPage = 10;
  final _searchController = TextEditingController();
  final _searchFocusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _searchFocusNode.addListener(() => setState(() {}));
    _loadPatients();
  }

  Future<void> _loadPatients() async {
    setState(() => _isLoadingPatients = true);
    try {
      final list = await _patientService.getPatients();
      setState(() {
        _allPatients = list;
        _filterAndPaginatePatients();
        _isLoadingPatients = false;
      });
    } catch (e) {
      setState(() => _isLoadingPatients = false);
      _showErrorFlushbar('Error al cargar pacientes: $e');
    }
  }

  void _filterAndPaginatePatients() {
    List<Patient> filtered = _allPatients;
    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      filtered = _allPatients.where((p) {
        final fullName = p.fullName.toLowerCase();
        final email = (p.email ?? '').toLowerCase();
        return fullName.contains(q) || email.contains(q);
      }).toList();
    }
    setState(() {
      _filteredPatients = filtered;
      // Reset to page 1 if query changes to avoid empty pages
      final totalPages = (_filteredPatients.length / _itemsPerPage).ceil();
      if (_currentPage > totalPages && totalPages > 0) {
        _currentPage = totalPages;
      } else if (totalPages == 0) {
        _currentPage = 1;
      }
    });
  }

  void _showSuccessFlushbar(String message) {
    Flushbar(
      title: 'Éxito',
      message: message,
      icon: Icon(Icons.check_circle, size: 28, color: Colors.greenAccent),
      backgroundColor: Color(0xFF1E1E2E),
      borderColor: Colors.greenAccent.withOpacity(0.5),
      borderWidth: 1.5,
      borderRadius: BorderRadius.circular(12),
      margin: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      flushbarPosition: FlushbarPosition.TOP,
      duration: Duration(seconds: 4),
      boxShadows: [BoxShadow(color: Colors.greenAccent.withOpacity(0.2), blurRadius: 12)],
      titleColor: Colors.white,
      messageColor: Colors.white70,
    ).show(context);
  }

  void _showErrorFlushbar(String message) {
    Flushbar(
      title: 'Error',
      message: message,
      icon: Icon(Icons.error_outline, size: 28, color: Colors.redAccent),
      backgroundColor: Color(0xFF1E1E2E),
      borderColor: Colors.redAccent.withOpacity(0.5),
      borderWidth: 1.5,
      borderRadius: BorderRadius.circular(12),
      margin: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      flushbarPosition: FlushbarPosition.TOP,
      duration: Duration(seconds: 4),
      boxShadows: [BoxShadow(color: Colors.redAccent.withOpacity(0.2), blurRadius: 12)],
      titleColor: Colors.white,
      messageColor: Colors.white70,
    ).show(context);
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _paternalSurnameController.dispose();
    _maternalSurnameController.dispose();
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  Future<void> _createPatient() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _tempUsername = null;
      _tempPassword = null;
    });

    final firstName = _firstNameController.text.trim();
    final paternalSurname = _paternalSurnameController.text.trim();
    final maternalSurname = _maternalSurnameController.text.trim();

    try {
      final result = await _patientService.createPatient(
        firstName: firstName,
        paternalSurname: paternalSurname,
        maternalSurname: maternalSurname,
      );

      setState(() {
        _isLoading = false;
        _tempUsername = result['username'];
        _tempPassword = result['tempPassword'];
      });

      _firstNameController.clear();
      _paternalSurnameController.clear();
      _maternalSurnameController.clear();
      _showSuccessFlushbar('Paciente creado con éxito.');
      
      // Recargar lista
      _loadPatients();
    } catch (e) {
      setState(() => _isLoading = false);
      _showErrorFlushbar(e.toString().replaceAll('Exception: ', ''));
    }
  }

  String _generateRandomPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#%^&*';
    final random = math.Random();
    return String.fromCharCodes(Iterable.generate(
      8, (_) => chars.codeUnitAt(random.nextInt(chars.length))));
  }

  int _selectedTab = 0;

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;
        
    // Widget puro sin Scaffold propio (HomeScreen ya provee la shell)
    return Column(
      children: [
        // Toggle segmentado
        Container(
          padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
          color: Theme.of(context).scaffoldBackgroundColor,
          child: Container(
            decoration: BoxDecoration(
              color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 10, offset: Offset(0, 4)),
              ],
            ),
            padding: EdgeInsets.all(4),
            child: Row(
              children: [
                Expanded(
                  child: InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: () => setState(() => _selectedTab = 0),
                    child: AnimatedContainer(
                      duration: Duration(milliseconds: 200),
                      curve: Curves.easeInOut,
                      padding: EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: _selectedTab == 0 ? primaryColor : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.people, size: 18, color: _selectedTab == 0 ? Theme.of(context).colorScheme.onPrimary : Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5)),
                          SizedBox(width: 8),
                          Text(
                            'Directorio',
                            style: TextStyle(
                              color: _selectedTab == 0 ? Theme.of(context).colorScheme.onPrimary : Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5),
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: () => setState(() => _selectedTab = 1),
                    child: AnimatedContainer(
                      duration: Duration(milliseconds: 200),
                      curve: Curves.easeInOut,
                      padding: EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: _selectedTab == 1 ? primaryColor : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.person_add, size: 18, color: _selectedTab == 1 ? Theme.of(context).colorScheme.onPrimary : Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5)),
                          SizedBox(width: 8),
                          Text(
                            'Nuevo Paciente',
                            style: TextStyle(
                              color: _selectedTab == 1 ? Theme.of(context).colorScheme.onPrimary : Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5),
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        // Contenido
        Expanded(
          child: _selectedTab == 0 ? _buildDashboardTab() : _buildCreationTab(),
        ),
      ],
    );
  }

  Widget _buildDashboardTab() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= 800;

        return Container(
          color: Theme.of(context).scaffoldBackgroundColor,
          child: SingleChildScrollView(
            padding: EdgeInsets.all(isDesktop ? 32 : 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildStatsHeader(isDesktop),
                _buildFilterRow(isDesktop),
                Text('Pacientes (${_filteredPatients.length})', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Theme.of(context).textTheme.bodyLarge?.color)),
                SizedBox(height: 16),
                _buildPatientesTable(isDesktop),
              ],
            ),
          ),
        );
      }
    );
  }

  Widget _buildStatsHeader(bool isDesktop) {
    if (!isDesktop) return SizedBox.shrink();

    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;
    int totalPacientes = _allPatients.length;
    int totalAnalisis = _allPatients.fold(0, (sum, p) => sum + p.totalAnalyses);
    // Simulación de estados para llenar el dashboard
    int estadoNormal = totalPacientes > 0 ? (totalPacientes * 0.8).round() : 0;
    int requierenAtencion = totalPacientes - estadoNormal;

    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        children: [
          Expanded(child: _buildMetricCard('Total Pacientes', '$totalPacientes', Icons.people, Colors.blue)),
          SizedBox(width: 16),
          Expanded(child: _buildMetricCard('Análisis Totales', '$totalAnalisis', Icons.bar_chart, Colors.purple)),
          SizedBox(width: 16),
          Expanded(child: _buildMetricCard('Estado Normal', '$estadoNormal', Icons.check_circle, Colors.green)),
          SizedBox(width: 16),
          Expanded(child: _buildMetricCard('Requieren Atención', '$requierenAtencion', Icons.warning, Colors.orange)),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color baseColor) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: AnimatedContainer(
        duration: Duration(milliseconds: 200),
        curve: Curves.easeInOut,
        padding: EdgeInsets.symmetric(vertical: 20, horizontal: 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [baseColor, baseColor.withOpacity(0.7)],
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: baseColor.withOpacity(0.3), blurRadius: 12, offset: Offset(0, 6)),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: Colors.white, size: 26),
            ),
            SizedBox(height: 12),
            Text(value, style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
            SizedBox(height: 4),
            Text(title, style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 12), textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }

  // Estado de ordenamiento
  String _sortBy = 'name';
  bool _sortAscending = true;

  void _applySorting() {
    setState(() {
      _filteredPatients.sort((a, b) {
        int comparison;
        switch (_sortBy) {
          case 'age':
            comparison = a.age.compareTo(b.age);
            break;
          case 'analyses':
            comparison = a.totalAnalyses.compareTo(b.totalAnalyses);
            break;
          case 'lastVisit':
            final dateA = a.lastVisit ?? DateTime(2000);
            final dateB = b.lastVisit ?? DateTime(2000);
            comparison = dateA.compareTo(dateB);
            break;
          default: // name
            comparison = a.fullName.compareTo(b.fullName);
        }
        return _sortAscending ? comparison : -comparison;
      });
    });
  }

  Widget _buildFilterRow(bool isDesktop) {
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7);
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;

    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        children: [
          Expanded(
            child: AnimatedContainer(
              duration: Duration(milliseconds: 200),
              decoration: BoxDecoration(
                color: Theme.of(context).scaffoldBackgroundColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _searchFocusNode.hasFocus
                      ? primaryColor
                      : Theme.of(context).dividerColor.withOpacity(0.2),
                ),
                boxShadow: _searchFocusNode.hasFocus
                    ? [BoxShadow(color: primaryColor.withOpacity(0.15), blurRadius: 8, offset: Offset(0, 2))]
                    : [],
              ),
              child: TextField(
                controller: _searchController,
                focusNode: _searchFocusNode,
                onChanged: (val) {
                  setState(() {
                    _searchQuery = val;
                    _filterAndPaginatePatients();
                  });
                },
                style: TextStyle(color: Theme.of(context).textTheme.bodyLarge?.color),
                decoration: InputDecoration(
                  hintText: 'Buscar paciente por nombre o email...',
                  hintStyle: TextStyle(color: textSecondary, fontSize: 14),
                  prefixIcon: Icon(Icons.search, color: textSecondary),
                  suffixIcon: _searchQuery.isNotEmpty 
                    ? IconButton(
                        icon: Icon(Icons.clear, color: textSecondary, size: 20),
                        onPressed: () {
                          _searchController.clear();
                          setState(() {
                            _searchQuery = '';
                            _filterAndPaginatePatients();
                          });
                        },
                      )
                    : null,
                  border: InputBorder.none,
                  isDense: true,
                  contentPadding: EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
          ),
          SizedBox(width: 8),
          PopupMenuButton<String>(
            icon: Container(
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Theme.of(context).scaffoldBackgroundColor,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.2)),
              ),
              child: Icon(Icons.filter_list, color: primaryColor, size: 20),
            ),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            onSelected: (value) {
              if (value == 'toggle_order') {
                _sortAscending = !_sortAscending;
              } else {
                _sortBy = value;
              }
              _applySorting();
            },
            itemBuilder: (context) => [
              PopupMenuItem(value: 'name', child: Row(children: [
                Icon(Icons.sort_by_alpha, size: 18, color: _sortBy == 'name' ? primaryColor : null),
                SizedBox(width: 8), Text('Ordenar por Nombre'),
              ])),
              PopupMenuItem(value: 'age', child: Row(children: [
                Icon(Icons.cake, size: 18, color: _sortBy == 'age' ? primaryColor : null),
                SizedBox(width: 8), Text('Ordenar por Edad'),
              ])),
              PopupMenuItem(value: 'analyses', child: Row(children: [
                Icon(Icons.bar_chart, size: 18, color: _sortBy == 'analyses' ? primaryColor : null),
                SizedBox(width: 8), Text('Ordenar por Análisis'),
              ])),
              PopupMenuItem(value: 'lastVisit', child: Row(children: [
                Icon(Icons.calendar_today, size: 18, color: _sortBy == 'lastVisit' ? primaryColor : null),
                SizedBox(width: 8), Text('Ordenar por Última Visita'),
              ])),
              PopupMenuDivider(),
              PopupMenuItem(value: 'toggle_order', child: Row(children: [
                Icon(_sortAscending ? Icons.arrow_upward : Icons.arrow_downward, size: 18),
                SizedBox(width: 8), Text(_sortAscending ? 'Descendente' : 'Ascendente'),
              ])),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPatientesTable(bool isDesktop) {
    if (_isLoadingPatients) {
      return Padding(padding: EdgeInsets.all(48), child: Center(child: CircularProgressIndicator()));
    }
    
    if (_filteredPatients.isEmpty) {
      return Padding(
        padding: EdgeInsets.all(48),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.people_outline, size: 56, color: Theme.of(context).dividerColor.withOpacity(0.3)),
              SizedBox(height: 16),
              Text(
                'No hay pacientes que coincidan con la búsqueda.',
                style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5), fontSize: 15),
              ),
              if (_searchQuery.isNotEmpty) ...[
                SizedBox(height: 16),
                TextButton.icon(
                  onPressed: () {
                    _searchController.clear();
                    setState(() {
                      _searchQuery = '';
                      _filterAndPaginatePatients();
                    });
                  },
                  icon: Icon(Icons.clear_all, size: 18),
                  label: Text('Limpiar búsqueda'),
                ),
              ],
            ],
          ),
        ),
      );
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBgColor = isDark ? Color(0xFF23325B) : (Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface);
    final primaryColor = isDark ? Theme.of(context).colorScheme.secondary : Theme.of(context).colorScheme.primary;

    // Calcular Paginación
    final totalFiltered = _filteredPatients.length;
    final totalPages = (totalFiltered / _itemsPerPage).ceil();
    final startIndex = (_currentPage - 1) * _itemsPerPage;
    final endIndex = math.min(startIndex + _itemsPerPage, totalFiltered);
    final pagedPatients = _filteredPatients.sublist(startIndex, endIndex);

    Widget buildPaginationControls() {
      if (totalPages <= 1) return SizedBox.shrink();
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              icon: Icon(Icons.chevron_left),
              onPressed: _currentPage > 1 ? () {
                setState(() => _currentPage--);
              } : null,
            ),
            Text('Página $_currentPage de $totalPages', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Theme.of(context).textTheme.bodyMedium?.color)),
            IconButton(
              icon: Icon(Icons.chevron_right),
              onPressed: _currentPage < totalPages ? () {
                setState(() => _currentPage++);
              } : null,
            ),
          ],
        ),
      );
    }

    if (!isDesktop) {
      // Vista móvil: Lista de tarjetas
      return Column(
        children: [
          ListView.separated(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: pagedPatients.length,
            separatorBuilder: (_, __) => SizedBox(height: 12),
            itemBuilder: (context, index) {
              final patient = pagedPatients[index];

          return InkWell(
            onTap: () => _showPatientDetailsModal(patient),
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: cardBgColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 4, offset: Offset(0, 2))
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: primaryColor.withOpacity(0.1),
                    child: Icon(Icons.person, color: primaryColor, size: 28),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          patient.fullName,
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Theme.of(context).textTheme.bodyLarge?.color),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        SizedBox(height: 2),
                        Text(
                          patient.email ?? 'Sin correo',
                          style: TextStyle(fontSize: 13, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7)),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        SizedBox(height: 4),
                        Text("${patient.age} años • ${patient.totalAnalyses} análisis", style: TextStyle(fontSize: 12, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.6))),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      _buildHealthStatusBadge(patient.healthStatus ?? 'Normal'),
                      SizedBox(height: 8),
                      Text(
                        patient.lastVisit != null ? "${patient.lastVisit!.day.toString().padLeft(2, '0')}/${patient.lastVisit!.month.toString().padLeft(2, '0')}/${patient.lastVisit!.year}" : "Sin visitas", 
                        style: TextStyle(fontSize: 11, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5))
                      ),
                    ],
                  ),
                  Icon(Icons.chevron_right, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.3), size: 24),
                ],
              ),
            ),
          );
        },
          ),
          buildPaginationControls(),
        ],
      );
    }

    // Vista Escritorio (Tabla moderna)
    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            color: cardBgColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 12, offset: Offset(0, 4)),
            ],
          ),
          child: Column(
            children: [
              _buildDesktopTableHeader(primaryColor),
              ...pagedPatients.asMap().entries.map((entry) {
                final index = entry.key;
                final patient = entry.value;
                final isLast = index == pagedPatients.length - 1;
                return _buildDesktopTableRow(patient, primaryColor, isLast);
              }),
            ],
          ),
        ),
        buildPaginationControls(),
        Padding(
          padding: EdgeInsets.only(top: 8, bottom: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.touch_app, size: 14, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.4)),
              SizedBox(width: 6),
              Text(
                'Haz clic en un paciente para ver sus detalles',
                style: TextStyle(
                  fontSize: 12,
                  color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.4),
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDesktopTableHeader(Color primaryColor) {
    final headerStyle = TextStyle(
      color: Theme.of(context).textTheme.bodySmall?.color?.withOpacity(0.6) ?? Colors.grey,
      fontWeight: FontWeight.w700,
      fontSize: 11,
      letterSpacing: 0.8,
    );

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
          colors: [
            primaryColor.withOpacity(0.08),
            primaryColor.withOpacity(0.03),
          ],
        ),
        borderRadius: BorderRadius.only(topLeft: Radius.circular(16), topRight: Radius.circular(16)),
        border: Border(bottom: BorderSide(color: primaryColor.withOpacity(0.12))),
      ),
      child: Row(
        children: [
          Expanded(flex: 1, child: Text('PACIENTE', style: headerStyle)),
          Expanded(flex: 1, child: Text('EMAIL', style: headerStyle)),
          SizedBox(width: 16),
          SizedBox(width: 60, child: Text('EDAD', style: headerStyle, textAlign: TextAlign.center)),
          SizedBox(width: 16),
          SizedBox(width: 60, child: Text('ANÁLISIS', style: headerStyle, textAlign: TextAlign.center)),
          SizedBox(width: 24),
          SizedBox(width: 110, child: Text('ESTADO', style: headerStyle, textAlign: TextAlign.center)),
          SizedBox(width: 24),
          SizedBox(width: 130, child: Text('ÚLTIMA VISITA', style: headerStyle)),
          SizedBox(width: 20),
        ],
      ),
    );
  }

  Widget _buildDesktopTableRow(Patient patient, Color primaryColor, bool isLast) {
    final statusColor = _getHealthStatusColor(patient.healthStatus ?? 'Normal');
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey;
    final initials = patient.fullName.split(' ').where((w) => w.isNotEmpty).take(2).map((w) => w[0].toUpperCase()).join();

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: InkWell(
        onTap: () => _showPatientDetailsModal(patient),
        child: AnimatedContainer(
          duration: Duration(milliseconds: 200),
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            border: isLast ? null : Border(bottom: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.06))),
          ),
          child: Row(
            children: [
              Expanded(
                flex: 1,
                child: Row(
                  children: [
                    Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [statusColor, statusColor.withOpacity(0.6)],
                        ),
                        boxShadow: [
                          BoxShadow(color: statusColor.withOpacity(0.3), blurRadius: 6, offset: Offset(0, 2)),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          initials.isNotEmpty ? initials : 'P',
                          style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        patient.fullName,
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5, color: textPrimary),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                flex: 1,
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: 250),
                  child: Text(
                    patient.email ?? '-',
                    style: TextStyle(fontSize: 12.5, color: textSecondary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
              SizedBox(width: 16),
              SizedBox(
                width: 60,
                child: Text(
                  '${patient.age}',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary),
                  textAlign: TextAlign.center,
                ),
              ),
              SizedBox(width: 16),
              SizedBox(
                width: 60,
                child: Text(
                  '${patient.totalAnalyses}',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary),
                  textAlign: TextAlign.center,
                ),
              ),
              SizedBox(width: 24),
              SizedBox(
                width: 110,
                child: Center(child: _buildHealthStatusBadge(patient.healthStatus ?? 'Normal')),
              ),
              SizedBox(width: 24),
              SizedBox(
                width: 130,
                child: Row(
                  children: [
                    Icon(Icons.event_rounded, size: 14, color: textSecondary),
                    SizedBox(width: 4),
                    Text(
                      patient.lastVisit != null
                          ? "${patient.lastVisit!.day.toString().padLeft(2, '0')}/${patient.lastVisit!.month.toString().padLeft(2, '0')}/${patient.lastVisit!.year}"
                          : "Sin visitas",
                      style: TextStyle(fontSize: 12, color: textSecondary),
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right_rounded, color: textSecondary.withOpacity(0.4), size: 20),
            ],
          ),
        ),
      ),
    );
  }

  Color _getHealthStatusColor(String status) {
    switch (status) {
      case 'Normal': return Colors.green;
      case 'Leve': return Colors.orange;
      case 'Moderado': return Colors.deepOrange;
      case 'Severo': return Colors.red;
      default: return Colors.green;
    }
  }

  Widget _buildCreationTab() {
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey;

    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      child: Center(
        child: ResponsiveWrapper(
          maxWidth: 700,
          child: SingleChildScrollView(
            padding: EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Crear Nuevo Paciente',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: textPrimary),
                ),
                SizedBox(height: 8),
                Text(
                  'Genera credenciales temporales para un nuevo paciente. Deberá cambiar su contraseña al iniciar sesión.',
                  style: TextStyle(fontSize: 14, color: textSecondary),
                ),
                SizedBox(height: 24),
                Container(
                  padding: EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        TextFormField(
                          controller: _firstNameController,
                          inputFormatters: [InputSanitizer.nameOnly],
                          maxLength: 50,
                          style: TextStyle(color: textPrimary),
                          decoration: InputDecoration(
                            labelText: 'Nombre(s)',
                            labelStyle: TextStyle(color: textSecondary),
                            prefixIcon: Icon(Icons.person, color: primaryColor),
                            counterStyle: TextStyle(color: textSecondary),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.1))),
                            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.1))),
                            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: primaryColor)),
                            filled: true,
                            fillColor: Theme.of(context).scaffoldBackgroundColor,
                          ),
                          validator: (val) => InputSanitizer.validateName(val, campo: 'Nombre'),
                        ),
                        SizedBox(height: 16),
                        TextFormField(
                          controller: _paternalSurnameController,
                          inputFormatters: [InputSanitizer.nameOnly],
                          maxLength: 50,
                          style: TextStyle(color: textPrimary),
                          decoration: InputDecoration(
                            labelText: 'Apellido Paterno',
                            labelStyle: TextStyle(color: textSecondary),
                            prefixIcon: Icon(Icons.badge, color: primaryColor),
                            counterStyle: TextStyle(color: textSecondary),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.1))),
                            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.1))),
                            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: primaryColor)),
                            filled: true,
                            fillColor: Theme.of(context).scaffoldBackgroundColor,
                          ),
                          validator: (val) => InputSanitizer.validateName(val, campo: 'Apellido Paterno'),
                        ),
                        SizedBox(height: 16),
                        TextFormField(
                          controller: _maternalSurnameController,
                          inputFormatters: [InputSanitizer.nameOnly],
                          maxLength: 50,
                          style: TextStyle(color: textPrimary),
                          decoration: InputDecoration(
                            labelText: 'Apellido Materno (Opcional)',
                            labelStyle: TextStyle(color: textSecondary),
                            prefixIcon: Icon(Icons.badge_outlined, color: primaryColor),
                            counterStyle: TextStyle(color: textSecondary),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.1))),
                            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.1))),
                            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: primaryColor)),
                            filled: true,
                            fillColor: Theme.of(context).scaffoldBackgroundColor,
                          ),
                        ),
                        SizedBox(height: 24),
                        AnimatedButton(
                          text: 'Crear y Generar Contraseña',
                          icon: Icons.add_circle_outline,
                          backgroundColor: primaryColor,
                          state: _isLoading ? ButtonState.loading : ButtonState.idle,
                          onPressed: _isLoading ? null : _createPatient,
                        ),
                      ],
                    ),
                  ),
                ),
                if (_tempUsername != null && _tempPassword != null) ...[
                  SizedBox(height: 24),
                  Container(
                    padding: EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent.withOpacity(0.08) : Colors.cyan.withOpacity(0.1),
                      border: Border.all(color: Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent.withOpacity(0.3) : Colors.cyan.withOpacity(0.4)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.check_circle, color: Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent : Colors.cyan.shade700),
                            SizedBox(width: 8),
                            Text('Credenciales Generadas', style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent : Colors.cyan.shade700, fontSize: 16)),
                          ],
                        ),
                        SizedBox(height: 16),
                        Text('Usuario/Correo: $_tempUsername', style: TextStyle(fontSize: 15, color: textPrimary)),
                        SizedBox(height: 8),
                        Text('Contraseña: $_tempPassword', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textPrimary)),
                        SizedBox(height: 16),
                        Text('Proporciona estos datos al paciente para que inicie sesión.', style: TextStyle(color: Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent.withOpacity(0.7) : Colors.cyan.shade800, fontSize: 13)),
                        SizedBox(height: 20),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                icon: Icon(Icons.person_outline, size: 18),
                                label: Text('Copiar Usuario'),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent : Colors.cyan.shade700,
                                  side: BorderSide(color: Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent.withOpacity(0.5) : Colors.cyan.shade700.withOpacity(0.5)),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  padding: EdgeInsets.symmetric(vertical: 12),
                                ),
                                onPressed: () {
                                  Clipboard.setData(ClipboardData(text: _tempUsername!));
                                  _showSuccessFlushbar('Usuario copiado al portapapeles');
                                },
                              ),
                            ),
                            SizedBox(width: 12),
                            Expanded(
                              child: OutlinedButton.icon(
                                icon: Icon(Icons.lock_outline, size: 18),
                                label: Text('Copiar Contraseña'),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent : Colors.cyan.shade700,
                                  side: BorderSide(color: Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent.withOpacity(0.5) : Colors.cyan.shade700.withOpacity(0.5)),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  padding: EdgeInsets.symmetric(vertical: 12),
                                ),
                                onPressed: () {
                                  Clipboard.setData(ClipboardData(text: _tempPassword!));
                                  _showSuccessFlushbar('Contraseña copiada al portapapeles');
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showPatientDetailsModal(Patient patient) {
    showDialog(
      context: context,
      builder: (context) => PatientDetailsModal(patient: patient),
    );
  }

  Widget _buildInfoCard(IconData icon, String title, String value, BuildContext context) {
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;
        
    return Container(
      margin: EdgeInsets.only(bottom: 12),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: primaryColor, size: 20),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontSize: 12, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.6))),
                SizedBox(height: 4),
                Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Theme.of(context).textTheme.bodyLarge?.color)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnalysisCard(String date, String description, String status, Color statusColor, BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
      ),
      child: IntrinsicHeight(
        child: Row(
          children: [
            Container(width: 4, decoration: BoxDecoration(color: statusColor, borderRadius: BorderRadius.circular(2))),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(date, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Theme.of(context).textTheme.bodyLarge?.color)),
                  SizedBox(height: 4),
                  Text(description, style: TextStyle(fontSize: 14, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7))),
                ],
              ),
            ),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(status, style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHealthStatusBadge(String status) {
    Color statusColor;
    switch (status) {
      case 'Normal':
        statusColor = Colors.green;
        break;
      case 'Leve':
        statusColor = Colors.orange;
        break;
      case 'Moderado':
        statusColor = Colors.deepOrange;
        break;
      case 'Severo':
        statusColor = Colors.red;
        break;
      default:
        statusColor = Colors.green;
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: statusColor.withOpacity(0.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: statusColor.withOpacity(0.3)),
      ),
      child: Text(status, style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold)),
    );
  }

  void _showEditPatientModal(Patient patient) {
    final phoneController = TextEditingController(text: patient.phone);
    final emailController = TextEditingController(text: patient.email);
    String? selectedGender = patient.gender;
    DateTime? selectedBirthDate = patient.birthDate;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setStateModal) {
            final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
            final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey;
            final primaryColor = Theme.of(context).brightness == Brightness.dark 
                ? Theme.of(context).colorScheme.secondary 
                : Theme.of(context).colorScheme.primary;
            bool isSaving = false;

            return Dialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              backgroundColor: Theme.of(context).scaffoldBackgroundColor,
              insetPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              child: Container(
                width: double.infinity,
                constraints: BoxConstraints(maxWidth: 500, maxHeight: MediaQuery.of(context).size.height * 0.9),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Header (App bar like)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                      child: Row(
                        children: [
                          IconButton(
                            icon: Icon(Icons.close, color: textPrimary),
                            onPressed: isSaving ? null : () => Navigator.of(context).pop(),
                          ),
                          SizedBox(width: 8),
                          Text('Editar Paciente', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: textPrimary)),
                        ],
                      ),
                    ),
                    SizedBox(height: 16),
                    
                    Flexible(
                      child: SingleChildScrollView(
                        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            TextFormField(
                              controller: phoneController,
                              style: TextStyle(color: textPrimary),
                              decoration: InputDecoration(
                                labelText: 'Teléfono',
                                labelStyle: TextStyle(color: textSecondary),
                                prefixIcon: Icon(Icons.phone, color: primaryColor),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                            ),
                            SizedBox(height: 16),
                            TextFormField(
                              controller: emailController,
                              style: TextStyle(color: textPrimary),
                              decoration: InputDecoration(
                                labelText: 'Correo (Opcional)',
                                labelStyle: TextStyle(color: textSecondary),
                                prefixIcon: Icon(Icons.email, color: primaryColor),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                            ),
                            SizedBox(height: 16),
                            DropdownButtonFormField<String>(
                              value: selectedGender,
                              dropdownColor: Theme.of(context).cardColor,
                              style: TextStyle(color: textPrimary),
                              decoration: InputDecoration(
                                labelText: 'Género',
                                labelStyle: TextStyle(color: textSecondary),
                                prefixIcon: Icon(Icons.transgender, color: primaryColor),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              items: ['MASCULINO', 'FEMENINO', 'OTRO'].map((String value) {
                                return DropdownMenuItem<String>(
                                  value: value,
                                  child: Text(value),
                                );
                              }).toList(),
                              onChanged: (val) => setStateModal(() => selectedGender = val),
                            ),
                            SizedBox(height: 16),
                            ElevatedButton.icon(
                              icon: Icon(Icons.calendar_today, size: 18),
                              label: Text(
                                selectedBirthDate == null
                                    ? 'Seleccionar Fecha de Nac.'
                                    : "${selectedBirthDate!.day}/${selectedBirthDate!.month}/${selectedBirthDate!.year}",
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Theme.of(context).cardColor,
                                foregroundColor: textPrimary,
                                elevation: 0,
                                side: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.1)),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                padding: EdgeInsets.symmetric(vertical: 16, horizontal: 16),
                                alignment: Alignment.centerLeft,
                                minimumSize: Size(double.infinity, 50),
                              ),
                              onPressed: () async {
                                final date = await showDatePicker(
                                  context: context,
                                  initialDate: selectedBirthDate ?? DateTime(2000),
                                  firstDate: DateTime(1900),
                                  lastDate: DateTime.now(),
                                );
                                if (date != null) setStateModal(() => selectedBirthDate = date);
                              },
                            ),
                            SizedBox(height: 32),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                TextButton(
                                  onPressed: isSaving ? null : () => Navigator.of(context).pop(),
                                  child: Text('Cancelar', style: TextStyle(color: textSecondary)),
                                ),
                                SizedBox(width: 8),
                                ElevatedButton(
                                  onPressed: isSaving ? null : () async {
                                    setStateModal(() => isSaving = true);
                                    try {
                                      await _patientService.updatePatient(patient.id, {
                                        'phone': phoneController.text.trim(),
                                        'email': emailController.text.trim(),
                                        'gender': selectedGender,
                                        if (selectedBirthDate != null)
                                          'birthDate': selectedBirthDate!.toIso8601String().split('T').first,
                                      });
                                      await _loadPatients();
                                      if (!context.mounted) return;
                                      Navigator.of(context).pop();
                                      _showSuccessFlushbar('Paciente actualizado correctamente');
                                      
                                      try {
                                        final modifiedPatient = _allPatients.firstWhere((p) => p.id == patient.id);
                                        _showPatientDetailsModal(modifiedPatient);
                                      } catch (_) {}
                                    } catch (e) {
                                      if (!context.mounted) return;
                                      _showErrorFlushbar('Error: ${e.toString().replaceAll('Exception: ', '')}');
                                      setStateModal(() => isSaving = false);
                                    }
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: primaryColor,
                                    foregroundColor: Theme.of(context).colorScheme.onPrimary,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                  ),
                                  child: isSaving
                                      ? SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                      : Text('Guardar'),
                                ),
                              ],
                            ),
                            SizedBox(height: 16),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
