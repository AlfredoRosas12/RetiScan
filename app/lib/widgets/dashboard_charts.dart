import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import '../models/analysis.dart';

class DashboardCharts extends StatelessWidget {
  final List<Analysis>? analyses;

  DashboardCharts({this.analyses});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = isDark
        ? Theme.of(context).colorScheme.secondary
        : Theme.of(context).colorScheme.primary;

    if (analyses == null || analyses!.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.pie_chart_outline, size: 54, color: Theme.of(context).dividerColor.withOpacity(0.4)),
            SizedBox(height: 16),
            Text(
              'Aún no hay datos para graficar',
              style: TextStyle(
                color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.6),
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      );
    }

    final chartData = _calculateData();

    return SfCircularChart(
      margin: EdgeInsets.zero,
      tooltipBehavior: TooltipBehavior(enable: true),
      series: <CircularSeries>[
        DoughnutSeries<_ChartData, String>(
          dataSource: chartData,
          xValueMapper: (_ChartData data, _) => data.category,
          yValueMapper: (_ChartData data, _) => data.value,
          pointColorMapper: (_ChartData data, _) => data.color,
          innerRadius: '65%',
          radius: '85%',
          dataLabelSettings: DataLabelSettings(
            isVisible: true,
            labelPosition: ChartDataLabelPosition.outside,
            textStyle: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.8),
            ),
            connectorLineSettings: ConnectorLineSettings(
              length: '12%',
              color: Theme.of(context).dividerColor.withOpacity(0.3),
            ),
          ),
          enableTooltip: true,
          animationDuration: 800,
          explode: true,
          explodeIndex: 0,
          explodeOffset: '5%',
          strokeColor: Theme.of(context).scaffoldBackgroundColor,
          strokeWidth: 2,
        ),
      ],
    );
  }

  List<_ChartData> _calculateData() {
    if (analyses == null || analyses!.isEmpty) {
      return [];
    }

    int normal = 0, mild = 0, moderate = 0, severe = 0, proliferative = 0;
    for (var a in analyses!) {
      final grade = (a.aiResult?['grade'] ?? 'Normal').toString().toLowerCase();
      if (grade.contains('normal')) normal++;
      else if (grade.contains('mild') || grade.contains('leve')) mild++;
      else if (grade.contains('moderate') || grade.contains('moderado')) moderate++;
      else if (grade.contains('severe') || grade.contains('grave')) severe++;
      else if (grade.contains('proliferative') || grade.contains('proliferativa')) proliferative++;
    }

    final data = <_ChartData>[];
    if (normal > 0) data.add(_ChartData('Normal', normal.toDouble(), Colors.cyanAccent));
    if (mild > 0) data.add(_ChartData('Leve', mild.toDouble(), Colors.pinkAccent));
    if (moderate > 0) data.add(_ChartData('Moderado', moderate.toDouble(), Colors.amber));
    if (severe > 0) data.add(_ChartData('Grave', severe.toDouble(), Colors.redAccent));
    if (proliferative > 0) data.add(_ChartData('Proliferativa', proliferative.toDouble(), Colors.deepPurpleAccent));

    return data;
  }
}

class _ChartData {
  final String category;
  final double value;
  final Color color;
  _ChartData(this.category, this.value, this.color);
}
