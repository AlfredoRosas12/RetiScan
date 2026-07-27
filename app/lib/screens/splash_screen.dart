import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:ui' as ui;
import 'dart:math' as math;
import 'login_screen.dart';
import 'home_screen.dart';
import 'complete_profile_screen.dart';
import '../services/auth_service.dart';

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  final AuthService _authService = AuthService();

  // Animation controllers
  late AnimationController _logoController;
  late AnimationController _glitchController;
  late AnimationController _scanRingsController;
  late AnimationController _particlesController;
  late AnimationController _irisGlowController;
  late AnimationController _progressController;
  late AnimationController _fadeOutController;

  // Animations
  late Animation<double> _logoScaleAnimation;
  late Animation<double> _logoOpacityAnimation;
  late Animation<double> _irisGlowAnimation;

  // Progress
  double _progress = 0.0;
  Timer? _progressTimer;
  bool _showProgress = false;
  bool _showScanRings = false;
  bool _showParticles = false;
  bool _isExiting = false;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _startLoadingSequence();
  }

  void _initializeAnimations() {
    // Logo appear with elastic bounce (0-1200ms)
    _logoController = AnimationController(
      duration: Duration(milliseconds: 1200),
      vsync: this,
    );
    _logoScaleAnimation = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(parent: _logoController, curve: Curves.elasticOut),
    );
    _logoOpacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _logoController,
        curve: Interval(0.0, 0.5, curve: Curves.easeOut),
      ),
    );

    // Glitch effect (rapid, subtle)
    _glitchController = AnimationController(
      duration: Duration(milliseconds: 150),
      vsync: this,
    );

    // Scan rings expanding outward
    _scanRingsController = AnimationController(
      duration: Duration(milliseconds: 2500),
      vsync: this,
    );

    // Particles converging toward center
    _particlesController = AnimationController(
      duration: Duration(milliseconds: 2000),
      vsync: this,
    );

    // Iris glow pulse (continuous after activation)
    _irisGlowController = AnimationController(
      duration: Duration(milliseconds: 1800),
      vsync: this,
    );
    _irisGlowAnimation = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(parent: _irisGlowController, curve: Curves.easeInOut),
    );

    // Progress bar animation
    _progressController = AnimationController(
      duration: Duration(milliseconds: 2500),
      vsync: this,
    );

    // Fade out
    _fadeOutController = AnimationController(
      duration: Duration(milliseconds: 500),
      vsync: this,
    );
  }

  void _startLoadingSequence() async {
    // Phase 1: Logo appears with elastic bounce
    _logoController.forward();

    // Phase 2: Glitch flicker (subtle digital effect)
    await Future.delayed(Duration(milliseconds: 600));
    _playGlitch();

    // Phase 3: Scan rings start expanding
    await Future.delayed(Duration(milliseconds: 300));
    setState(() => _showScanRings = true);
    _scanRingsController.repeat();

    // Phase 4: Converging particles appear
    await Future.delayed(Duration(milliseconds: 400));
    setState(() => _showParticles = true);
    _particlesController.forward();

    // Phase 5: Iris glow activates
    await Future.delayed(Duration(milliseconds: 300));
    _irisGlowController.repeat(reverse: true);

    // Phase 6: Progress bar visible
    await Future.delayed(Duration(milliseconds: 500));
    setState(() => _showProgress = true);
    _startProgressAnimation();

    // Load user data
    await _authService.loadUserFromSession();

    // Wait for progress to reach ~100%
    await Future.delayed(Duration(milliseconds: 2800));

    // Phase 7: Exit animation
    _fadeOutController.forward();
    await Future.delayed(Duration(milliseconds: 500));
    _navigateToNextScreen();
  }

  void _playGlitch() async {
    // Quick glitch flickers
    for (int i = 0; i < 3; i++) {
      await Future.delayed(Duration(milliseconds: 80));
      if (mounted) setState(() {});
      await Future.delayed(Duration(milliseconds: 40));
      if (mounted) setState(() {});
    }
  }

  void _startProgressAnimation() {
    const updateInterval = Duration(milliseconds: 30);
    int currentStep = 0;
    const totalSteps = 85; // ~2.55 seconds

    _progressTimer = Timer.periodic(updateInterval, (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      setState(() {
        currentStep++;
        // Accelerating curve
        double remaining = 100 - _progress;
        double step = math.max(0.3, remaining * 0.05);
        _progress = math.min(100, _progress + step);

        if (_progress >= 100 || currentStep >= totalSteps) {
          timer.cancel();
          _progress = 100;
        }
      });
    });
  }

  void _navigateToNextScreen() {
    final user = _authService.currentUser;
    final isAuthenticated = _authService.isAuthenticated;

    Widget nextScreen;
    if (!isAuthenticated) {
      nextScreen = LoginScreen();
    } else if (user != null && user.isPatient && !user.isVerified) {
      nextScreen = CompleteProfileScreen();
    } else {
      nextScreen = HomeScreen();
    }

    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => nextScreen,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: Duration(milliseconds: 600),
      ),
    );
  }

  @override
  void dispose() {
    _logoController.dispose();
    _glitchController.dispose();
    _scanRingsController.dispose();
    _particlesController.dispose();
    _irisGlowController.dispose();
    _progressController.dispose();
    _fadeOutController.dispose();
    _progressTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: AnimatedBuilder(
        animation: _fadeOutController,
        builder: (context, child) {
          return Opacity(
            opacity: 1.0 - (_fadeOutController.value * 0.3),
            child: Stack(
              children: [
                // Deep space gradient background
                Container(
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      center: Alignment.center,
                      radius: 1.5,
                      colors: [
                        Color(0xFF0a1628),
                        Color(0xFF050d1a),
                        Color(0xFF020810),
                      ],
                    ),
                  ),
                ),

                // Subtle animated nebula glow
                AnimatedBuilder(
                  animation: _irisGlowController,
                  builder: (context, child) {
                    return Center(
                      child: Container(
                        width: size.width * 1.2,
                        height: size.height * 1.2,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              Color(0xFF00ccff)
                                  .withOpacity(0.04 + _irisGlowAnimation.value * 0.04),
                              Colors.transparent,
                            ],
                            stops: [0.0, 0.6],
                          ),
                        ),
                      ),
                    );
                  },
                ),

                // Scan rings
                if (_showScanRings)
                  Center(
                    child: AnimatedBuilder(
                      animation: _scanRingsController,
                      builder: (context, child) {
                        return CustomPaint(
                          size: Size(size.width, size.height),
                          painter: _ScanRingsPainter(
                            progress: _scanRingsController.value,
                          ),
                        );
                      },
                    ),
                  ),

                // Converging particles
                if (_showParticles)
                  Center(
                    child: AnimatedBuilder(
                      animation: _particlesController,
                      builder: (context, child) {
                        return CustomPaint(
                          size: Size(size.width, size.height),
                          painter: _ConvergingParticlesPainter(
                            progress: _particlesController.value,
                          ),
                        );
                      },
                    ),
                  ),

                // Main content
                Center(
                  child: FadeTransition(
                    opacity: _logoOpacityAnimation,
                    child: ScaleTransition(
                      scale: _logoScaleAnimation,
                      child: _buildEyeLogo(),
                    ),
                  ),
                ),

                // Progress section at bottom
                if (_showProgress)
                  Positioned(
                    bottom: size.height * 0.12,
                    left: 0,
                    right: 0,
                    child: _buildProgressSection(),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildEyeLogo() {
    return Container(
      width: 240,
      height: 260,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Outer glow ring
          AnimatedBuilder(
            animation: _irisGlowController,
            builder: (context, child) {
              return Container(
                width: 180,
                height: 180,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Color(0xFF00ccff)
                        .withOpacity(0.1 + _irisGlowAnimation.value * 0.2),
                    width: 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Color(0xFF00ccff)
                          .withOpacity(_irisGlowAnimation.value * 0.15),
                      blurRadius: 40,
                      spreadRadius: 10,
                    ),
                  ],
                ),
              );
            },
          ),

          // Eye logo
          CustomPaint(
            size: Size(240, 260),
            painter: _InnovativeEyePainter(
              bracketsAnimation: _irisGlowController,
              irisAnimation: _irisGlowController,
              glitchController: _glitchController,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressSection() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 48),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // "RETISCAN" text
          Text(
            'RETISCAN',
            style: TextStyle(
              fontSize: 14,
              color: Colors.white.withOpacity(0.8),
              letterSpacing: 12,
              fontWeight: FontWeight.w300,
            ),
          ),

          SizedBox(height: 32),

          // Progress bar with glow
          Container(
            height: 2,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.06),
              borderRadius: BorderRadius.circular(2),
            ),
            child: Stack(
              children: [
                FractionallySizedBox(
                  widthFactor: _progress / 100,
                  child: AnimatedContainer(
                    duration: Duration(milliseconds: 30),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Color(0xFF00ccff).withOpacity(0.6),
                          Color(0xFF00ccff),
                          Colors.white.withOpacity(0.9),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(2),
                      boxShadow: [
                        BoxShadow(
                          color: Color(0xFF00ccff).withOpacity(0.6),
                          blurRadius: 8,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                  ),
                ),
                // Glowing tip
                FractionallySizedBox(
                  widthFactor: _progress / 100,
                  child: Align(
                    alignment: Alignment.centerRight,
                    child: Container(
                      width: 6,
                      height: 6,
                      margin: EdgeInsets.only(right: -3),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                            color: Color(0xFF00ccff),
                            blurRadius: 12,
                            spreadRadius: 4,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: 16),

          // Loading text with animated dots
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'INITIALIZING',
                style: TextStyle(
                  fontSize: 9,
                  color: Colors.white.withOpacity(0.4),
                  letterSpacing: 6,
                  fontWeight: FontWeight.w400,
                ),
              ),
              SizedBox(width: 8),
              SizedBox(
                width: 24,
                height: 12,
                child: AnimatedBuilder(
                  animation: _irisGlowController,
                  builder: (context, child) {
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(3, (index) {
                        final delay = index * 0.2;
                        final value =
                            (_irisGlowController.value + delay) % 1.0;
                        final opacity = math.sin(value * math.pi);
                        return Padding(
                          padding: EdgeInsets.symmetric(horizontal: 1.5),
                          child: Container(
                            width: 2,
                            height: 2,
                            decoration: BoxDecoration(
                              color: Color(0xFF00ccff)
                                  .withOpacity(opacity * 0.8),
                              shape: BoxShape.circle,
                            ),
                          ),
                        );
                      }),
                    );
                  },
                ),
              ),
            ],
          ),

          SizedBox(height: 8),

          // Percentage
          Text(
            '${_progress.toInt()}%',
            style: TextStyle(
              fontSize: 11,
              color: Color(0xFF00ccff).withOpacity(0.7),
              fontWeight: FontWeight.w300,
              fontFeatures: [FontFeature.tabularFigures()],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Innovative Eye Painter ──────────────────────────────────────────────────
class _InnovativeEyePainter extends CustomPainter {
  final Animation<double> bracketsAnimation;
  final Animation<double> irisAnimation;
  final AnimationController glitchController;

  _InnovativeEyePainter({
    required this.bracketsAnimation,
    required this.irisAnimation,
    required this.glitchController,
  }) : super(
          repaint: Listenable.merge([
            bracketsAnimation,
            irisAnimation,
            glitchController,
          ]),
        );

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2 - 15);

    // Glitch offset
    final glitchOffset =
        glitchController.isAnimating ? math.sin(glitchController.value * 20) * 2 : 0.0;

    canvas.save();
    canvas.translate(glitchOffset, 0);

    _drawBrackets(canvas, center);
    _drawEye(canvas, center);
    _drawIrisDetails(canvas, center);
    _drawDataLines(canvas, center);

    canvas.restore();
  }

  void _drawBrackets(Canvas canvas, Offset center) {
    final paint = Paint()
      ..color =
          Colors.white.withOpacity(0.3 + (bracketsAnimation.value * 0.4))
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final bracketSize = 16.0;
    final distance = 95.0;

    final corners = [
      // Top-left
      [Offset(-distance, -distance + bracketSize), Offset(-distance, -distance), Offset(-distance + bracketSize, -distance)],
      // Top-right
      [Offset(distance - bracketSize, -distance), Offset(distance, -distance), Offset(distance, -distance + bracketSize)],
      // Bottom-left
      [Offset(-distance, distance - bracketSize), Offset(-distance, distance), Offset(-distance + bracketSize, distance)],
      // Bottom-right
      [Offset(distance - bracketSize, distance), Offset(distance, distance), Offset(distance, distance - bracketSize)],
    ];

    for (final corner in corners) {
      final path = Path()
        ..moveTo(center.dx + corner[0].dx, center.dy + corner[0].dy)
        ..lineTo(center.dx + corner[1].dx, center.dy + corner[1].dy)
        ..lineTo(center.dx + corner[2].dx, center.dy + corner[2].dy);
      canvas.drawPath(path, paint);
    }
  }

  void _drawEye(Canvas canvas, Offset center) {
    // Outer eye shape
    final eyePaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final eyePath = Path()
      ..moveTo(center.dx - 70, center.dy)
      ..quadraticBezierTo(center.dx - 35, center.dy - 42, center.dx, center.dy - 48)
      ..quadraticBezierTo(center.dx + 35, center.dy - 42, center.dx + 70, center.dy)
      ..quadraticBezierTo(center.dx + 35, center.dy + 42, center.dx, center.dy + 48)
      ..quadraticBezierTo(center.dx - 35, center.dy + 42, center.dx - 70, center.dy);

    canvas.drawPath(eyePath, eyePaint);

    // Iris outer ring
    final irisOuterPaint = Paint()
      ..color = Colors.white.withOpacity(0.8)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final irisScale = 1.0 + (irisAnimation.value * 0.03);
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.scale(irisScale);
    canvas.translate(-center.dx, -center.dy);
    canvas.drawCircle(center, 48, irisOuterPaint);
    canvas.restore();

    // Iris inner ring
    final irisInnerPaint = Paint()
      ..color = Color(0xFF00ccff).withOpacity(0.6)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.scale(irisScale);
    canvas.translate(-center.dx, -center.dy);
    canvas.drawCircle(center, 38, irisInnerPaint);
    canvas.restore();

    // Pupil
    final pupilPaint = Paint()
      ..color = Color(0xFF0a1628)
      ..style = PaintingStyle.fill;

    final pupilScale = 1.0 - (irisAnimation.value * 0.08);
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.scale(pupilScale);
    canvas.translate(-center.dx, -center.dy);
    canvas.drawCircle(center, 24, pupilPaint);
    canvas.restore();
  }

  void _drawIrisDetails(Canvas canvas, Offset center) {
    // Inner iris glow
    final innerGlowPaint = Paint()
      ..shader = ui.Gradient.radial(
        center,
        35,
        [
          Color(0xFF00ccff).withOpacity(0.4),
          Color(0xFF00ccff).withOpacity(0.1),
          Colors.transparent,
        ],
        [0.0, 0.5, 1.0],
      );
    canvas.drawCircle(center, 35, innerGlowPaint);

    // Central bright dot
    final centerDotPaint = Paint()
      ..color = Color(0xFF00ccff).withOpacity(0.9)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, 4, centerDotPaint);

    // Highlight reflection
    final highlightPaint = Paint()
      ..color = Colors.white.withOpacity(0.9)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(center.dx + 14, center.dy - 18), 5, highlightPaint);

    // Small secondary highlight
    final smallHighlight = Paint()
      ..color = Colors.white.withOpacity(0.5)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(center.dx - 8, center.dy + 12), 2, smallHighlight);
  }

  void _drawDataLines(Canvas canvas, Offset center) {
    final linePaint = Paint()
      ..color = Color(0xFF00ccff).withOpacity(0.15)
      ..strokeWidth = 0.5
      ..style = PaintingStyle.stroke;

    // Horizontal scan lines
    for (double y = center.dy - 45; y <= center.dy + 45; y += 8) {
      final distFromCenter = (y - center.dy).abs() / 45;
      final xExtent = 65 * (1 - distFromCenter * 0.3);
      canvas.drawLine(
        Offset(center.dx - xExtent, y),
        Offset(center.dx + xExtent, y),
        linePaint,
      );
    }

    // Vertical scan lines
    for (double x = center.dx - 65; x <= center.dx + 65; x += 10) {
      final distFromCenter = (x - center.dx).abs() / 65;
      final yExtent = 45 * (1 - distFromCenter * 0.4);
      canvas.drawLine(
        Offset(x, center.dy - yExtent),
        Offset(x, center.dy + yExtent),
        linePaint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

// ── Scan Rings Painter ──────────────────────────────────────────────────────
class _ScanRingsPainter extends CustomPainter {
  final double progress;

  _ScanRingsPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final maxRadius = math.min(size.width, size.height) * 0.4;

    // Multiple expanding rings with staggered timing
    for (int i = 0; i < 3; i++) {
      final ringProgress = (progress - i * 0.15).clamp(0.0, 1.0);
      if (ringProgress <= 0) continue;

      final radius = maxRadius * ringProgress;
      final opacity = (1.0 - ringProgress) * 0.3;

      final paint = Paint()
        ..color = Color(0xFF00ccff).withOpacity(opacity)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5;

      canvas.drawCircle(center, radius, paint);
    }

    // Rotating crosshair
    final crosshairAngle = progress * math.pi * 4;
    final crosshairPaint = Paint()
      ..color = Color(0xFF00ccff).withOpacity(0.15)
      ..strokeWidth = 0.5;

    final crossSize = maxRadius * 0.3;
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(crosshairAngle);

    // Horizontal line
    canvas.drawLine(
      Offset(-crossSize, 0),
      Offset(crossSize, 0),
      crosshairPaint,
    );
    // Vertical line
    canvas.drawLine(
      Offset(0, -crossSize),
      Offset(0, crossSize),
      crosshairPaint,
    );

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _ScanRingsPainter oldDelegate) =>
      oldDelegate.progress != progress;
}

// ── Converging Particles Painter ────────────────────────────────────────────
class _ConvergingParticlesPainter extends CustomPainter {
  final double progress;

  _ConvergingParticlesPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final random = math.Random(42);

    // Generate particles that converge toward center
    for (int i = 0; i < 30; i++) {
      final angle = random.nextDouble() * math.pi * 2;
      final startRadius = 150.0 + random.nextDouble() * 100;
      final currentRadius = startRadius * (1.0 - progress * 0.7);

      final x = center.dx + math.cos(angle) * currentRadius;
      final y = center.dy + math.sin(angle) * currentRadius;

      final size_base = 1.0 + random.nextDouble() * 2;
      final opacity = (1.0 - progress * 0.5) * (0.3 + random.nextDouble() * 0.4);

      final paint = Paint()
        ..color = Color(0xFF00ccff).withOpacity(opacity)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(Offset(x, y), size_base, paint);

      // Draw trail line toward center
      if (progress > 0.2) {
        final trailPaint = Paint()
          ..color = Color(0xFF00ccff).withOpacity(opacity * 0.3)
          ..strokeWidth = 0.5;

        final trailEnd = Offset(
          center.dx + math.cos(angle) * currentRadius * 0.8,
          center.dy + math.sin(angle) * currentRadius * 0.8,
        );
        canvas.drawLine(Offset(x, y), trailEnd, trailPaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _ConvergingParticlesPainter oldDelegate) =>
      oldDelegate.progress != progress;
}
