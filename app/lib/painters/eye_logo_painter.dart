import 'package:flutter/material.dart';

class EyeLogoPainter extends CustomPainter {
  final Animation<double> bracketsAnimation;
  final Animation<double> irisAnimation;

  EyeLogoPainter({
    required this.bracketsAnimation,
    required this.irisAnimation,
  }) : super(repaint: Listenable.merge([bracketsAnimation, irisAnimation]));

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2 - 10);

    _drawBrackets(canvas, center);
    _drawEye(canvas, center);
    _drawText(canvas, size);
  }

  void _drawBrackets(Canvas canvas, Offset center) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.4 + (bracketsAnimation.value * 0.6))
      ..strokeWidth = 10
      ..style = PaintingStyle.stroke;

    final bracketSize = 20.0;
    final distance = 80.0;

    // Top-left
    canvas.drawPath(
      Path()
        ..moveTo(center.dx - distance, center.dy - distance + bracketSize)
        ..lineTo(center.dx - distance, center.dy - distance)
        ..lineTo(center.dx - distance + bracketSize, center.dy - distance),
      paint,
    );

    // Top-right
    canvas.drawPath(
      Path()
        ..moveTo(center.dx + distance - bracketSize, center.dy - distance)
        ..lineTo(center.dx + distance, center.dy - distance)
        ..lineTo(center.dx + distance, center.dy - distance + bracketSize),
      paint,
    );

    // Bottom-left
    canvas.drawPath(
      Path()
        ..moveTo(center.dx - distance, center.dy + distance - bracketSize)
        ..lineTo(center.dx - distance, center.dy + distance)
        ..lineTo(center.dx - distance + bracketSize, center.dy + distance),
      paint,
    );

    // Bottom-right
    canvas.drawPath(
      Path()
        ..moveTo(center.dx + distance - bracketSize, center.dy + distance)
        ..lineTo(center.dx + distance, center.dy + distance)
        ..lineTo(center.dx + distance, center.dy + distance - bracketSize),
      paint,
    );
  }

  void _drawEye(Canvas canvas, Offset center) {
    // Outer eye shape (diamond/almond)
    final eyePaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 9
      ..style = PaintingStyle.stroke;

    final eyePath = Path()
      ..moveTo(center.dx - 60, center.dy)
      ..quadraticBezierTo(center.dx - 30, center.dy - 35, center.dx, center.dy - 40)
      ..quadraticBezierTo(center.dx + 30, center.dy - 35, center.dx + 60, center.dy)
      ..quadraticBezierTo(center.dx + 30, center.dy + 35, center.dx, center.dy + 40)
      ..quadraticBezierTo(center.dx - 30, center.dy + 35, center.dx - 60, center.dy);

    canvas.drawPath(eyePath, eyePaint);

    // Iris ring
    final irisPaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 6
      ..style = PaintingStyle.stroke;

    final irisScale = 1.0 + (irisAnimation.value * 0.05);
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.scale(irisScale);
    canvas.translate(-center.dx, -center.dy);
    canvas.drawCircle(center, 42, irisPaint);
    canvas.restore();

    // Pupil
    final pupilPaint = Paint()
      ..color = Color(0xFF001a4d)
      ..style = PaintingStyle.fill;

    final pupilScale = 1.0 - (irisAnimation.value * 0.1);
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.scale(pupilScale);
    canvas.translate(-center.dx, -center.dy);
    canvas.drawCircle(center, 28, pupilPaint);
    canvas.restore();

    // Inner iris
    final innerIrisPaint = Paint()
      ..color = Color(0xFF00ccff).withOpacity(0.8)
      ..style = PaintingStyle.fill;

    canvas.drawCircle(center, 22, innerIrisPaint);

    // Highlight
    final highlightPaint = Paint()
      ..color = Colors.white.withOpacity(0.9)
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(center.dx + 12, center.dy - 17), 6, highlightPaint);
  }

  void _drawText(Canvas canvas, Size size) {
    final textPainter = TextPainter(
      text: TextSpan(
        text: 'RETISCAN',
        style: TextStyle(
          color: Colors.white,
          fontSize: 22,
          fontWeight: FontWeight.bold,
          letterSpacing: 8,
        ),
      ),
      textDirection: TextDirection.ltr,
    );

    textPainter.layout();
    textPainter.paint(
      canvas,
      Offset(
        (size.width - textPainter.width) / 2,
        size.height - 30,
      ),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
