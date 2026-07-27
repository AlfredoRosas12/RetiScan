import 'package:flutter/material.dart';
import '../config/api_config.dart';
import '../models/analysis.dart';
import '../services/analysis_service.dart';

class HistoryScreen extends StatefulWidget {
  @override
  _HistoryScreenState createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  List<Animation<Offset>> _slideAnimations = [];
  List<Animation<double>> _fadeAnimations = [];

  final AnalysisService _analysisService = AnalysisService();
  List<Analysis> _analyses = [];
  bool _isLoading = true;

  // -- Paginación --
  int _currentPage = 1;
  List<Analysis> _paginatedAnalyses = [];
  int get _effectiveItemsPerPage {
    final width = MediaQuery.of(context).size.width;
    return width >= 1000 ? 15 : 10;
  }
  int get _totalPages => (_analyses.isEmpty) ? 1 : (_analyses.length / _effectiveItemsPerPage).ceil();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 400),
      vsync: this,
    );
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final analyses = await _analysisService.getMyAnalyses();
      if (mounted) {
        setState(() {
          _analyses = analyses;
          _isLoading = false;
        });
        _paginate();
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _paginate() {
    final itemsPerPage = _effectiveItemsPerPage;
    final startIndex = (_currentPage - 1) * itemsPerPage;
    final endIndex = startIndex + itemsPerPage;
    setState(() {
      _paginatedAnalyses = _analyses.sublist(
        startIndex,
        endIndex > _analyses.length ? _analyses.length : endIndex,
      );
    });
    _setupAnimations();
    _controller.forward(from: 0);
  }

  void _changePage(int newPage) {
    if (newPage >= 1 && newPage <= _totalPages) {
      setState(() {
        _currentPage = newPage;
      });
      _paginate();
    }
  }

  void _setupAnimations() {
    _slideAnimations = List.generate(
      _paginatedAnalyses.length,
      (index) => Tween<Offset>(
        begin: Offset(0.3, 0),
        end: Offset.zero,
      ).animate(
        CurvedAnimation(
          parent: _controller,
          curve: Interval(
            (index * 0.05).clamp(0.0, 0.99),
            (0.5 + index * 0.05).clamp(0.0, 1.0),
            curve: Curves.easeOutCubic,
          ),
        ),
      ),
    );

    _fadeAnimations = List.generate(
      _paginatedAnalyses.length,
      (index) => Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(
          parent: _controller,
          curve: Interval(
            (index * 0.05).clamp(0.0, 0.99),
            (0.5 + index * 0.05).clamp(0.0, 1.0),
            curve: Curves.easeIn,
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  // ══════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════

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

  IconData _getStatusIcon(String status) {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return Icons.check_circle;
      case 'PENDING':
      case 'PROCESSING':
        return Icons.hourglass_empty;
      case 'FAILED':
        return Icons.error;
      default:
        return Icons.info;
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return Colors.green;
      case 'PENDING':
      case 'PROCESSING':
        return Colors.orange;
      case 'FAILED':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Color _getGradeColor(String grade) {
    switch (grade) {
      case 'Normal':
      case 'No_DR':
        return Colors.green;
      case 'Mild':
        return Colors.orange;
      case 'Moderate':
        return Colors.deepOrange;
      case 'Severe':
      case 'Proliferate_DR':
        return Colors.red;
      default:
        return Colors.green;
    }
  }

  String _formatLesionName(String name) {
    return name
        .replaceAll('_', ' ')
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(' ');
  }

  String _formatDate(DateTime date) {
    return "${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}";
  }

  String _formatTime(DateTime date) {
    return "${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}";
  }

  // ══════════════════════════════════════════════
  //  BUILD — LayoutBuilder responsive
  // ══════════════════════════════════════════════

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= 1000;
        if (isDesktop) return _buildDesktopContent();
        return _buildMobileContent();
      },
    );
  }

  // ══════════════════════════════════════════════
  //  HEADER compartido
  // ══════════════════════════════════════════════

  Widget _buildHeader() {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(context).colorScheme.primary.withOpacity(0.1),
            Theme.of(context).colorScheme.secondary.withOpacity(0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              Icons.timeline,
              color: Theme.of(context).colorScheme.primary,
              size: 28,
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Total de Análisis',
                  style: TextStyle(
                    fontSize: 14,
                    color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  '${_analyses.length} registros',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).textTheme.headlineMedium?.color,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ══════════════════════════════════════════════
  //  EMPTY STATE
  // ══════════════════════════════════════════════

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.history,
            size: 64,
            color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.2),
          ),
          SizedBox(height: 16),
          Text(
            'No tienes análisis registrados aún',
            style: TextStyle(
              color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5),
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  // ══════════════════════════════════════════════
  //  LAYOUT MÓVIL (timeline alternada)
  // ══════════════════════════════════════════════

  Widget _buildMobileContent() {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: 800),
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: _isLoading
                  ? Center(child: CircularProgressIndicator())
                  : _analyses.isEmpty
                      ? _buildEmptyState()
                      : Column(
                          children: [
                            Expanded(
                              child: ListView.builder(
                                padding: EdgeInsets.all(16),
                                itemCount: _paginatedAnalyses.length,
                                itemBuilder: (context, index) {
                                  final analysis = _paginatedAnalyses[index];
                                  return SlideTransition(
                                    position: _slideAnimations[index],
                                    child: FadeTransition(
                                      opacity: _fadeAnimations[index],
                                      child: _buildMobileHistoryCard(analysis, index),
                                    ),
                                  );
                                },
                              ),
                            ),
                            _buildPaginationControls(),
                          ],
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMobileHistoryCard(Analysis analysis, int index) {
    final statusColor = _getStatusColor(analysis.status);
    final statusIcon = _getStatusIcon(analysis.status);
    final isLeft = index % 2 == 0;

    return Container(
      margin: EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          if (!isLeft) Expanded(child: SizedBox()),
          if (!isLeft) _buildTimelineDot(statusColor),
          if (!isLeft) SizedBox(width: 16),
          Expanded(
            flex: 2,
            child: Container(
              decoration: BoxDecoration(
                color: Theme.of(context).cardTheme.color,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: statusColor.withOpacity(0.1),
                    blurRadius: 15,
                    offset: Offset(0, 5),
                  ),
                ],
                border: Border.all(
                  color: statusColor.withOpacity(0.2),
                  width: 1,
                ),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(16),
                  onTap: () => _showAnalysisDetails(analysis),
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: statusColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(
                                statusIcon,
                                color: statusColor,
                                size: 20,
                              ),
                            ),
                            SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    _formatDate(analysis.createdAt),
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: Theme.of(context).textTheme.bodyLarge?.color,
                                    ),
                                  ),
                                  SizedBox(height: 2),
                                  Text(
                                    _formatTime(analysis.createdAt),
                                    style: TextStyle(
                                      color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 12),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: statusColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: statusColor.withOpacity(0.3),
                              width: 1,
                            ),
                          ),
                          child: Text(
                            analysis.status,
                            style: TextStyle(
                              color: statusColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          if (isLeft) SizedBox(width: 16),
          if (isLeft) _buildTimelineDot(statusColor),
          if (isLeft) Expanded(child: SizedBox()),
        ],
      ),
    );
  }

  Widget _buildTimelineDot(Color color) {
    return Container(
      width: 12,
      height: 12,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(
          color: Theme.of(context).colorScheme.surface,
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 8,
            spreadRadius: 2,
          ),
        ],
      ),
    );
  }

  // ══════════════════════════════════════════════
  //  LAYOUT ESCRITORIO (cards horizontales)
  // ══════════════════════════════════════════════

  Widget _buildDesktopContent() {
  return Padding(
    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 28),
    child: Column(
      children: [
        _buildHeader(),
        SizedBox(height: 24),
        Expanded(
          child: _isLoading
              ? Center(child: CircularProgressIndicator())
              : _analyses.isEmpty
                  ? _buildEmptyState()
                  : Column(
                      children: [
                        Expanded(
                          child: Scrollbar(
                            thumbVisibility: true,
                            child: ListView.builder(
                              padding: EdgeInsets.only(right: 8), // espacio para scrollbar
                              itemCount: _paginatedAnalyses.length,
                              itemBuilder: (context, index) {
                                final analysis = _paginatedAnalyses[index];
                                return SlideTransition(
                                  position: _slideAnimations[index],
                                  child: FadeTransition(
                                    opacity: _fadeAnimations[index],
                                    child: _buildDesktopHistoryCard(analysis),
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                        _buildPaginationControls(),
                      ],
                    ),
        ),
      ],
    ),
  );
}

  Widget _buildDesktopHistoryCard(Analysis analysis) {
    final statusColor = _getStatusColor(analysis.status);
    final grade = analysis.aiResult?['grade'] ?? 'Normal';
    final translatedGrade = _translateGrade(grade);
    final confidence = analysis.aiResult?['confidence'];
    final gradeColor = _getGradeColor(grade);
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7);

    return Container(
      margin: EdgeInsets.only(bottom: 12),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => _showAnalysisDetails(analysis),
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardTheme.color,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: statusColor.withOpacity(0.15),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: statusColor.withOpacity(0.05),
                  blurRadius: 10,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                _buildTimelineDot(statusColor),
                SizedBox(width: 20),
                SizedBox(
                  width: 140,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _formatDate(analysis.createdAt),
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: Theme.of(context).textTheme.bodyLarge?.color,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        _formatTime(analysis.createdAt),
                        style: TextStyle(
                          color: textSecondary,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(width: 16),
                _buildGradeBadge(translatedGrade, gradeColor),
                SizedBox(width: 16),
                if (analysis.eye != null) ...[
                  _buildEyeBadge(analysis.eye!),
                  SizedBox(width: 16),
                ],
                if (confidence != null) ...[
                  Text(
                    '${(confidence * 100).toInt()}%',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context).textTheme.bodyLarge?.color,
                    ),
                  ),
                  SizedBox(width: 16),
                ],
                Spacer(),
                _buildStatusBadge(analysis.status, statusColor),
                SizedBox(width: 12),
                Icon(
                  Icons.chevron_right,
                  color: textSecondary,
                  size: 20,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGradeBadge(String grade, Color color) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3), width: 1),
      ),
      child: Text(
        grade,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }

  Widget _buildEyeBadge(String eye) {
    final label = eye == 'LEFT' ? 'OI' : 'OD';
    final color = Theme.of(context).colorScheme.secondary;
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3), width: 1),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status, Color color) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3), width: 1),
      ),
      child: Text(
        status,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }

  // ══════════════════════════════════════════════
  //  MODAL DETALLES
  // ══════════════════════════════════════════════

  void _showAnalysisDetails(Analysis analysis) {
    final statusColor = _getStatusColor(analysis.status);
    final grade = analysis.aiResult?['grade'] ?? 'Normal';
    final confidence = analysis.aiResult?['confidence'];
    final lesions = analysis.aiResult?['lesions_detected'] as Map<String, dynamic>? ?? {};

    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        child: Padding(
          padding: EdgeInsets.all(24),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: statusColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(_getStatusIcon(analysis.status), color: statusColor, size: 24),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Detalles del Análisis',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Theme.of(context).textTheme.bodyLarge?.color,
                            ),
                          ),
                          Text(
                            '${_formatDate(analysis.createdAt)} ${_formatTime(analysis.createdAt)}',
                            style: TextStyle(
                              fontSize: 13,
                              color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.6),
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                _buildDetailRow('Estado', analysis.status, statusColor),
                SizedBox(height: 12),
                _buildDetailRow('Grado DR', _translateGrade(grade), _getGradeColor(grade)),
                SizedBox(height: 12),
                if (confidence != null)
                  _buildDetailRow('Confianza IA', '${(confidence * 100).toInt()}%', Colors.blue),
                if (confidence != null) SizedBox(height: 12),
                if (analysis.eye != null)
                  _buildDetailRow('Ojo analizado', analysis.eye == 'LEFT' ? 'Izquierdo' : 'Derecho', Colors.purple),
                if (analysis.eye != null) SizedBox(height: 16),
                if (lesions.isNotEmpty) ...[
                  Text(
                    'Lesiones Detectadas',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).textTheme.bodyLarge?.color,
                    ),
                  ),
                  SizedBox(height: 8),
                  ...lesions.entries.map((entry) => Padding(
                    padding: EdgeInsets.only(bottom: 6),
                    child: Row(
                      children: [
                        Icon(
                          entry.value == true ? Icons.warning_amber_rounded : Icons.check_circle_outline,
                          size: 16,
                          color: entry.value == true ? Colors.orange : Colors.green,
                        ),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            '${_formatLesionName(entry.key)}: ${entry.value == true ? 'Detectado' : 'No detectado'}',
                            style: TextStyle(
                              fontSize: 13,
                              color: Theme.of(context).textTheme.bodyMedium?.color,
                            ),
                          ),
                        ),
                      ],
                    ),
                  )),
                ],
                SizedBox(height: 16),
                if (analysis.imageUri != null) ...[
                  Text(
                    'Imagen',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).textTheme.bodyLarge?.color,
                    ),
                  ),
                  SizedBox(height: 8),
                  Container(
                    height: 150,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      color: Theme.of(context).dividerColor.withOpacity(0.1),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        ApiConfig.imageUrl(analysis.imageUri),
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Center(
                          child: Icon(Icons.image_not_supported, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.3)),
                        ),
                      ),
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

  Widget _buildDetailRow(String label, String value, Color valueColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
          ),
        ),
        Container(
          padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: valueColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            value,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: valueColor,
            ),
          ),
        ),
      ],
    );
  }

  // ══════════════════════════════════════════════
  //  PAGINACIÓN
  // ══════════════════════════════════════════════

  Widget _buildPaginationControls() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
        border: Border(top: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.1))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Página $_currentPage de $_totalPages',
            style: TextStyle(
              color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
              fontSize: 14,
            ),
          ),
          Row(
            children: [
              IconButton(
                icon: Icon(Icons.chevron_left),
                onPressed: _currentPage > 1 ? () => _changePage(_currentPage - 1) : null,
                color: Theme.of(context).colorScheme.primary,
                disabledColor: Theme.of(context).dividerColor.withOpacity(0.3),
              ),
              IconButton(
                icon: Icon(Icons.chevron_right),
                onPressed: _currentPage < _totalPages ? () => _changePage(_currentPage + 1) : null,
                color: Theme.of(context).colorScheme.primary,
                disabledColor: Theme.of(context).dividerColor.withOpacity(0.3),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
