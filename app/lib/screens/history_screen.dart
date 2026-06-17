import 'package:flutter/material.dart';
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
  int _itemsPerPage = 10;
  List<Analysis> _paginatedAnalyses = [];
  int get _totalPages => (_analyses.isEmpty) ? 1 : (_analyses.length / _itemsPerPage).ceil();

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
    final startIndex = (_currentPage - 1) * _itemsPerPage;
    final endIndex = startIndex + _itemsPerPage;
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

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: 800),
        child: Column(
          children: [
            Container(
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
            ),
            Expanded(
              child: _isLoading
                  ? Center(child: CircularProgressIndicator())
                  : _analyses.isEmpty
                      ? Center(child: Text('No tienes análisis registrados aún', style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.5))))
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
                                      child: _buildHistoryCard(analysis, index),
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

  Widget _buildHistoryCard(Analysis analysis, int index) {
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
                  onTap: () {},
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
                                    "${analysis.createdAt.day.toString().padLeft(2, '0')}/${analysis.createdAt.month.toString().padLeft(2, '0')}/${analysis.createdAt.year}",
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: Theme.of(context).textTheme.bodyLarge?.color,
                                    ),
                                  ),
                                  SizedBox(height: 2),
                                  Text(
                                    "${analysis.createdAt.hour.toString().padLeft(2, '0')}:${analysis.createdAt.minute.toString().padLeft(2, '0')}",
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
                          padding:
                              EdgeInsets.symmetric(horizontal: 12, vertical: 6),
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