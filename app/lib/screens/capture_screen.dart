import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:another_flushbar/flushbar.dart';
import 'home_screen.dart';
import '../widgets/animated_button.dart';
import '../widgets/responsive_wrapper.dart';
import '../services/pdf_service.dart';
import '../services/notification_service.dart';
import '../services/analysis_service.dart';
import '../services/auth_service.dart';
import '../services/patient_service.dart';
import '../models/analysis.dart';
import '../models/patient.dart';
import '../config/api_config.dart';

class CaptureScreen extends StatefulWidget {
  final String? patientId;

  CaptureScreen({this.patientId});

  @override
  _CaptureScreenState createState() => _CaptureScreenState();
}

class _CaptureScreenState extends State<CaptureScreen>
    with TickerProviderStateMixin {
  XFile? _selectedImageFile;
  bool _isUploading = false;
  bool _isSaving = false;
  bool _analysisComplete = false;
  Analysis? _analysisResult;
  Map<String, String>? _displayResults;
  late AnimationController _pulseController;
  late AnimationController _progressController;
  late AnimationController _revealController;
  late AnimationController _orbitController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _progressAnimation;
  late Animation<double> _revealAnimation;

  String _statusMessage = 'Procesando retina, por favor espera';
  double _currentProgress = 0.0;
  String _selectedEye = 'LEFT';
  String? _selectedPatientId;
  List<Patient> _patients = [];
  bool _isLoadingPatients = false;

  final AnalysisService _analysisService = AnalysisService();
  final AuthService _authService = AuthService();
  final PatientService _patientService = PatientService();
  StreamSubscription? _pollSubscription;

  @override
  void initState() {
    super.initState();
    _selectedPatientId = widget.patientId;
    if (_authService.isDoctor) {
      _loadPatients();
    }
    _pulseController = AnimationController(
      duration: Duration(milliseconds: 800),
      vsync: this,
    );
    _progressController = AnimationController(
      duration: Duration(seconds: 8),
      vsync: this,
    );
    _revealController = AnimationController(
      duration: Duration(milliseconds: 400),
      vsync: this,
    );
    _orbitController = AnimationController(
      duration: Duration(seconds: 3),
      vsync: this,
    );

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
    _progressAnimation = Tween<double>(begin: 0.0, end: 0.85).animate(
      CurvedAnimation(parent: _progressController, curve: Curves.easeInOut),
    );
    _revealAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _revealController, curve: Curves.easeOutCubic),
    );

    _pulseController.repeat(reverse: true);
  }

  Future<void> _loadPatients() async {
    setState(() => _isLoadingPatients = true);
    try {
      final list = await _patientService.getPatients();
      if (mounted) {
        setState(() {
          _patients = list;
          if (_selectedPatientId == null && _patients.isNotEmpty) {
            _selectedPatientId = _patients.first.id;
          }
          _isLoadingPatients = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() => _isLoadingPatients = false);
      }
    }
  }

  @override
  void dispose() {
    _pollSubscription?.cancel();
    _pulseController.dispose();
    _progressController.dispose();
    _revealController.dispose();
    _orbitController.dispose();
    super.dispose();
  }

  // Mostrar guía visual antes de tomar foto
  void _showCameraGuide() {
    final primaryColor = Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).colorScheme.secondary
        : Theme.of(context).colorScheme.primary;

    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Icono de guía
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: primaryColor, width: 3),
                  color: primaryColor.withOpacity(0.05),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Icon(Icons.visibility, size: 40, color: primaryColor),
                    Positioned(
                      bottom: 15,
                      child: Container(
                        width: 50,
                        height: 2,
                        color: primaryColor.withOpacity(0.5),
                      ),
                    ),
                    // Crosshair lines
                    Positioned(
                      top: 20,
                      child: Container(width: 2, height: 15, color: primaryColor.withOpacity(0.3)),
                    ),
                    Positioned(
                      bottom: 20,
                      child: Container(width: 2, height: 15, color: primaryColor.withOpacity(0.3)),
                    ),
                    Positioned(
                      left: 20,
                      child: Container(width: 15, height: 2, color: primaryColor.withOpacity(0.3)),
                    ),
                    Positioned(
                      right: 20,
                      child: Container(width: 15, height: 2, color: primaryColor.withOpacity(0.3)),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 20),
              Text(
                'Guía para tomar la foto',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).textTheme.bodyLarge?.color,
                ),
              ),
              SizedBox(height: 16),
              _buildGuideStep('1', 'Coloca el dispositivo frente al ojo a capturar'),
              _buildGuideStep('2', 'Asegúrate de tener buena iluminación'),
              _buildGuideStep('3', 'Centra el ojo dentro del marco circular'),
              _buildGuideStep('4', 'Mantén el dispositivo estable y enfoca'),
              _buildGuideStep('5', 'Presiona el botón para capturar'),
              SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text('Cancelar'),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        _pickImage(ImageSource.camera);
                      },
                      icon: Icon(Icons.camera_alt, size: 18),
                      label: Text('Abrir Cámara'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryColor,
                        foregroundColor: Theme.of(context).colorScheme.onPrimary,
                        padding: EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGuideStep(String number, String text) {
    final primaryColor = Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).colorScheme.secondary
        : Theme.of(context).colorScheme.primary;

    return Padding(
      padding: EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: primaryColor.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: Text(
              number,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
            ),
          ),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 13,
                color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.8),
                height: 1.3,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: source);

    if (pickedFile != null) {
      setState(() {
        _selectedImageFile = pickedFile;
        _isUploading = true;
        _analysisComplete = false;
        _currentProgress = 0.0;
        _statusMessage = 'Enviando imagen al servidor...';
      });

      _progressController.forward(from: 0);
      _orbitController.repeat();
      await _runAnalysis();
    }
  }

  Future<void> _runAnalysis() async {
    try {
      if (!mounted) return;

      final targetPatientId = widget.patientId ?? _selectedPatientId ?? '';
      if (_authService.isDoctor && targetPatientId.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Por favor selecciona un paciente antes de continuar'),
            backgroundColor: Colors.orange,
          ),
        );
        setState(() {
          _isUploading = false;
        });
        return;
      }

      setState(() => _statusMessage = 'Enviando imagen al servidor...');

      final analysis = await _analysisService.createAnalysis(
        targetPatientId,
        imageFile: _selectedImageFile,
        eye: _selectedEye,
      );

      if (!mounted) return;
      setState(() {
        _currentProgress = 0.4;
        _statusMessage = 'Procesando retina...';
      });

      // Hacer polling hasta que el backend termine
      Analysis? finalAnalysis;
      await for (final update in _analysisService.pollUntilComplete(analysis.id)) {
        finalAnalysis = update;
      }

      if (finalAnalysis == null || finalAnalysis.status == 'FAILED') {
        final serverError = finalAnalysis?.aiResult?['error'];
        final failureMsg = (serverError != null && serverError.toString().isNotEmpty)
            ? serverError.toString()
            : 'El análisis no pudo completarse. Por favor verifique la imagen y reintente.';
        throw Exception(failureMsg);
      }

      if (!mounted) return;
      setState(() {
        _currentProgress = 1.0;
        _statusMessage = 'Análisis completado';
      });

      await Future.delayed(Duration(milliseconds: 300));

      if (!mounted) return;
      setState(() {
        _isUploading = false;
        _analysisComplete = true;
        _analysisResult = finalAnalysis;
        
        final aiData = finalAnalysis!.aiResult ?? {};
        final lesions = aiData['lesions_detected'] as Map<String, dynamic>? ?? {};
        
        // Mapear resultados reales de la API
        _displayResults = {
          'Grado (DR)': aiData['grade']?.toString() ?? 'Normal',
          'Confianza IA': '${((aiData['confidence'] ?? 0.0) * 100).toInt()}%',
          'Microaneurismas': (lesions['microaneurysms'] == true) ? 'Detectados' : 'No detectados',
          'Hemorragias': (lesions['hemorrhages'] == true) ? 'Detectadas' : 'No detectadas',
          'Exudados duros': (lesions['hard_exudates'] == true) ? 'Detectados' : 'No detectados',
          'Neovascularización': (lesions['neovascularization'] == true) ? 'Detectada' : 'No detectada',
        };
      });

      _selectedImageFile = null;

      _orbitController.stop();
      _revealController.forward(from: 0);

      try {
        await NotificationService.showNotification(
          id: 0,
          title: 'Análisis Completado',
          body: 'El resultado ha finalizado: ${finalAnalysis!.aiResult?['grade'] ?? 'Normal'}. Verifique los detalles.',
        );
      } catch (_) {}
    } catch (e) {
      _orbitController.stop();
      if (!mounted) return;
      setState(() {
        _isUploading = false;
        _statusMessage = 'Error en el análisis';
      });
      if (mounted) {
        final cleanMsg = e.toString().replaceAll("Exception: ", "");
        _showCustomErrorDialog('Imagen No Válida para Análisis', cleanMsg);
      }
    }
  }

  Future<void> _submitAnalysis() async {
    setState(() => _isSaving = true);
    
    // Simular guardado final/confirmación en el sistema
    await Future.delayed(Duration(seconds: 1));
    
    if (mounted) {
      await Flushbar(
        title: 'Análisis finalizado',
        message: 'El registro se ha guardado correctamente en tu historial.',
        icon: Icon(Icons.check_circle_outline, size: 28, color: Colors.greenAccent),
        backgroundColor: Color(0xFF1E1E2E), // Mismo fondo que login/registro
        borderColor: Colors.greenAccent.withOpacity(0.5),
        borderWidth: 1.5,
        borderRadius: BorderRadius.circular(12),
        margin: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        flushbarPosition: FlushbarPosition.TOP,
        duration: Duration(seconds: 3),
        boxShadows: [
          BoxShadow(color: Colors.greenAccent.withOpacity(0.2), blurRadius: 10)
        ],
        titleColor: Colors.white,
        messageColor: Colors.white70,
      ).show(context);
      
      if (!mounted) return;
      
      // Regresar al inicio (Home)
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => HomeScreen()),
        (route) => false,
      );
    }
  }

  void _resetAnalysis() {
    setState(() {
      _selectedImageFile = null;
      _analysisComplete = false;
      _displayResults = null;
      _analysisResult = null;
      _currentProgress = 0.0;
    });
    _progressController.reset();
    _revealController.reset();
    _orbitController.stop();
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 1000;
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        elevation: 0,
        title: SizedBox.shrink(),
      ),
      body: AnimatedSwitcher(
        duration: Duration(milliseconds: 500),
        child: _isUploading
            ? _buildUploadingScreen()
            : _analysisComplete
                ? _buildAnalysisResults()
                : _buildCaptureOptions(),
      ),
    );
  }

  Widget _buildCaptureOptions() {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 600;

    final content = Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(height: isMobile ? 28 : 24),
        AnimatedBuilder(
          animation: _pulseAnimation,
          builder: (context, child) {
            return Transform.scale(
              scale: _pulseAnimation.value,
              child: Container(
                padding: EdgeInsets.all(isMobile ? 28 : 40),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Theme.of(context).brightness == Brightness.dark
                        ? Color(0xFF2D385E).withOpacity(0.1)
                        : Colors.blueAccent.withOpacity(0.05),
                      Theme.of(context).colorScheme.primary.withOpacity(0.1),
                    ],
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Icon(
                  Icons.camera_alt,
                  size: isMobile ? 60 : 80,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
            );
          },
        ),
        SizedBox(height: isMobile ? 32 : 40),
        Text(
          _authService.isDoctor
              ? 'Selecciona el paciente y la opción para capturar\nla imagen de retina'
              : 'Selecciona una opción para capturar\nla imagen de tu retina',
          textAlign: TextAlign.center,
          style: TextStyle(
            color: Theme.of(context).textTheme.bodyMedium?.color,
            fontSize: isMobile ? 14 : 16,
            height: 1.5,
          ),
        ),
        SizedBox(height: isMobile ? 28 : 24),
        // Selector de paciente (para médicos)
        if (_authService.isDoctor && widget.patientId == null) ...[
          Container(
            constraints: BoxConstraints(maxWidth: 400),
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
            ),
            child: _isLoadingPatients
                ? Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)),
                        SizedBox(width: 10),
                        Text('Cargando pacientes...', style: TextStyle(fontSize: 14)),
                      ],
                    ),
                  )
                : DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedPatientId,
                      hint: Row(
                        children: [
                          Icon(Icons.person_outline, size: 18, color: Theme.of(context).colorScheme.primary),
                          SizedBox(width: 10),
                          Text('Seleccionar Paciente', style: TextStyle(fontSize: 14)),
                        ],
                      ),
                      isExpanded: true,
                      items: _patients.map((p) {
                        return DropdownMenuItem<String>(
                          value: p.id,
                          child: Text(
                            p.fullName,
                            style: TextStyle(
                              color: Theme.of(context).textTheme.bodyLarge?.color,
                              fontSize: 14,
                            ),
                          ),
                        );
                      }).toList(),
                      onChanged: (val) {
                        setState(() {
                          _selectedPatientId = val;
                        });
                      },
                    ),
                  ),
          ),
          SizedBox(height: isMobile ? 20 : 16),
        ],
        // Selector de ojo
        Container(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
          ),
          child: isMobile
              ? Column(
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.visibility, size: 18, color: Theme.of(context).colorScheme.primary),
                        SizedBox(width: 10),
                        Text(
                          'Ojo a capturar:',
                          style: TextStyle(
                            fontSize: 14,
                            color: Theme.of(context).textTheme.bodyMedium?.color,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _buildEyeOption('LEFT', 'Izquierdo'),
                        SizedBox(width: 8),
                        _buildEyeOption('RIGHT', 'Derecho'),
                      ],
                    ),
                  ],
                )
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.visibility, size: 18, color: Theme.of(context).colorScheme.primary),
                    SizedBox(width: 10),
                    Text(
                      'Ojo a capturar:',
                      style: TextStyle(
                        fontSize: 14,
                        color: Theme.of(context).textTheme.bodyMedium?.color,
                      ),
                    ),
                    SizedBox(width: 12),
                    _buildEyeOption('LEFT', 'Izquierdo'),
                    SizedBox(width: 8),
                    _buildEyeOption('RIGHT', 'Derecho'),
                  ],
                ),
        ),
        SizedBox(height: isMobile ? 24 : 16),
        AnimatedButton(
          text: 'Seleccionar de Galería',
          icon: Icons.photo_library,
          onPressed: () => _pickImage(ImageSource.gallery),
          backgroundColor: Theme.of(context).colorScheme.primary,
          height: isMobile ? 50 : 60,
        ),
      ],
    );

    if (isMobile) {
      return Padding(
        padding: EdgeInsets.symmetric(horizontal: 24.0),
        child: content,
      );
    }

    return ResponsiveWrapper(
      maxWidth: 800,
      child: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
        child: content,
      ),
    );
  }

  void _showCustomErrorDialog(String title, String message) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          backgroundColor: isDark ? Color(0xFF1E2640) : Colors.white,
          elevation: 10,
          child: Padding(
            padding: EdgeInsets.all(28),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.redAccent.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.warning_amber_rounded,
                    color: Colors.redAccent,
                    size: 48,
                  ),
                ),
                SizedBox(height: 20),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black87,
                  ),
                ),
                SizedBox(height: 12),
                Text(
                  message,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    height: 1.4,
                    color: isDark ? Colors.white70 : Colors.black54,
                  ),
                ),
                SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: Text(
                      'Entendido',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildEyeOption(String value, String label) {
    final isSelected = _selectedEye == value;
    final primaryColor = Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).colorScheme.secondary
        : Theme.of(context).colorScheme.primary;

    return GestureDetector(
      onTap: () => setState(() => _selectedEye = value),
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? primaryColor.withOpacity(0.2)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected
                ? primaryColor
                : Theme.of(context).dividerColor.withOpacity(0.3),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            color: isSelected
                ? primaryColor
                : Theme.of(context).textTheme.bodyMedium?.color,
          ),
        ),
      ),
    );
  }

  // Pantalla de análisis en progreso con circulo progresivo + nodos orbitantes
  Widget _buildUploadingScreen() {
    final primaryColor = Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).colorScheme.secondary
        : Theme.of(context).colorScheme.primary;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Circulo progresivo con nodos orbitantes
          SizedBox(
            width: 200,
            height: 200,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Nodos orbitantes
                AnimatedBuilder(
                  animation: _orbitController,
                  builder: (context, child) {
                    return CustomPaint(
                      size: Size(200, 200),
                      painter: _OrbitNodesPainter(
                        progress: _orbitController.value,
                        color: primaryColor,
                      ),
                    );
                  },
                ),
                // Circulo progresivo
                SizedBox(
                  width: 140,
                  height: 140,
                  child: AnimatedBuilder(
                    animation: _progressController,
                    builder: (context, child) {
                      final displayProgress = _currentProgress > 0
                          ? _currentProgress
                          : _progressAnimation.value;
                      return Stack(
                        alignment: Alignment.center,
                        children: [
                          // Background circle
                          CircularProgressIndicator(
                            value: 1.0,
                            strokeWidth: 8,
                            backgroundColor: Colors.transparent,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Theme.of(context).dividerColor.withOpacity(0.1),
                            ),
                          ),
                          // Progress circle
                          CircularProgressIndicator(
                            value: displayProgress,
                            strokeWidth: 8,
                            strokeCap: StrokeCap.round,
                            valueColor: AlwaysStoppedAnimation<Color>(primaryColor),
                          ),
                          // Percentage
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                '${(displayProgress * 100).toInt()}%',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: primaryColor,
                                ),
                              ),
                              SizedBox(height: 2),
                              Icon(
                                Icons.visibility,
                                size: 18,
                                color: primaryColor.withOpacity(0.5),
                              ),
                            ],
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: 32),
          Text(
            'Analizando imagen...',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).textTheme.headlineMedium?.color,
            ),
          ),
          SizedBox(height: 12),
          Text(
            _statusMessage,
            style: TextStyle(
              color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnalysisResults() {
    return ResponsiveWrapper(
      maxWidth: 900,
      child: SingleChildScrollView(
        padding: EdgeInsets.all(20.0),
        child: FadeTransition(
          opacity: _revealAnimation,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 220,
                      height: 220,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        color: Theme.of(context).brightness == Brightness.dark
                            ? Colors.grey[800]!
                            : Colors.grey[200]!,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 20,
                            offset: Offset(0, 10),
                          ),
                        ],
                        image: (_analysisResult?.imageUri != null)
                            ? DecorationImage(
                                image: NetworkImage(
                                  ApiConfig.imageUrl(_analysisResult!.imageUri),
                                ),
                                fit: BoxFit.contain,
                                filterQuality: FilterQuality.high,
                              )
                            : null,
                      ),
                      child: (_analysisResult?.imageUri == null)
                          ? Center(
                              child: Icon(
                                Icons.image,
                                size: 60,
                                color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.3),
                              ),
                            )
                          : null,
                    ),
                    SizedBox(height: 20),
                    _buildGradeBadge(_analysisResult!.aiResult?['grade'] ?? 'Normal'),
                    SizedBox(height: 12),
                    // Chip de lateralidad detectada
                    Builder(builder: (context) {
                      final anatomy = _analysisResult?.aiResult?['anatomy_validation'] as Map<String, dynamic>?;
                      if (anatomy == null) return SizedBox.shrink();
                      
                      final detectedEye = anatomy['detected_eye']?.toString() ?? '';
                      final matches = anatomy['matches_selected_eye'] as bool? ?? true;
                      final warning = anatomy['warning']?.toString();
                      final eyeLabel = detectedEye == 'RIGHT' ? 'Derecho (OD)' : 'Izquierdo (OS)';
                      final isDark = Theme.of(context).brightness == Brightness.dark;
                      
                      return Column(
                        children: [
                          Container(
                            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? Colors.blueAccent.withOpacity(0.15)
                                  : Colors.blue.withOpacity(0.08),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: Colors.blueAccent.withOpacity(0.3),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.visibility, size: 16, color: Colors.blueAccent),
                                SizedBox(width: 6),
                                Text(
                                  'Ojo Detectado: $eyeLabel',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.blueAccent,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (!matches && warning != null) ...[
                            SizedBox(height: 8),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.amber.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.amber.withOpacity(0.4)),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.warning_amber_rounded, size: 16, color: Colors.amber[700]),
                                  SizedBox(width: 6),
                                  Flexible(
                                    child: Text(
                                      warning,
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.amber[800],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      );
                    }),
                  ],
                ),
              ),
              SizedBox(height: 32),
              Text(
                'Información Médica',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).textTheme.headlineMedium?.color,
                ),
              ),
              SizedBox(height: 16),
              ...(_displayResults ?? {}).entries.map((entry) => _buildResultItem(
                    entry.key,
                    entry.value,
                  )),
              SizedBox(height: 24),
              Container(
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Theme.of(context).brightness == Brightness.dark
                      ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                      : Theme.of(context).colorScheme.secondary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Theme.of(context).colorScheme.primary.withOpacity(0.3)
                        : Theme.of(context).colorScheme.secondary.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.secondary.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        Icons.medical_services,
                        color: Theme.of(context).colorScheme.secondary,
                        size: 24,
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        'Te recomendamos consultar con un especialista para una evaluación completa.',
                        style: TextStyle(
                          color: Theme.of(context).textTheme.bodyLarge?.color,
                          fontSize: 14,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _resetAnalysis,
                      icon: Icon(Icons.refresh),
                      label: Text('Nueva Captura'),
                      style: OutlinedButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        side: BorderSide(
                            color: Theme.of(context).colorScheme.primary, width: 2),
                        foregroundColor: Theme.of(context).colorScheme.primary,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: AnimatedButton(
                      text: _isSaving ? 'Guardando...' : 'Guardar',
                      icon: _isSaving ? Icons.hourglass_empty : Icons.save,
                      onPressed: _isSaving ? null : _submitAnalysis,
                      backgroundColor: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    final resultsString = (_displayResults ?? {})
                        .entries
                        .map((e) => '${e.key}: ${e.value}')
                        .join('\n');
                    final patientName = _authService.currentUser?.fullName ?? 'Paciente';
                    PdfService.generateAndShareReport(
                      patientName: patientName,
                      analysisResult: resultsString,
                      date: DateTime.now().toString().split(' ')[0],
                    );
                  },
                  icon: Icon(Icons.picture_as_pdf),
                  label: Text('Exportar Resumen a PDF'),
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildResultItem(String label, String value) {
    return Container(
      margin: EdgeInsets.only(bottom: 12),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).brightness == Brightness.dark
              ? Theme.of(context).colorScheme.onSurface.withOpacity(0.2)
              : Colors.grey[200]!,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 15,
                color: Theme.of(context).textTheme.bodyLarge?.color,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: TextStyle(
                fontSize: 15,
                color: Theme.of(context).textTheme.bodyMedium?.color,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGradeBadge(String grade) {
    final isNormal = grade == 'Normal';
    final badgeColor = isNormal ? Colors.green : Colors.orange;
    final icon = isNormal ? Icons.check_circle : Icons.warning_amber_rounded;

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [badgeColor, badgeColor.shade400],
        ),
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: badgeColor.withOpacity(0.3),
            blurRadius: 15,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 20),
          SizedBox(width: 8),
          Text(
            'Estado: $grade',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}

// Custom Painter para nodos orbitantes
class _OrbitNodesPainter extends CustomPainter {
  final double progress;
  final Color color;

  _OrbitNodesPainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 8;

    // Dibujar 6 nodos que orbitan
    for (int i = 0; i < 6; i++) {
      final angle = (progress * 2 * math.pi) + (i * math.pi / 3);
      final nodeRadius = 4.0 - (i * 0.4); // Tamaño decreciente
      final opacity = 1.0 - (i * 0.12); // Opacidad decreciente (trail effect)

      final x = center.dx + radius * math.cos(angle);
      final y = center.dy + radius * math.sin(angle);

      final paint = Paint()
        ..color = color.withOpacity(opacity.clamp(0.2, 1.0))
        ..style = PaintingStyle.fill;

      canvas.drawCircle(Offset(x, y), nodeRadius.clamp(1.5, 4.0), paint);
    }

    // Glow effect en el nodo principal
    final mainAngle = progress * 2 * math.pi;
    final mainX = center.dx + radius * math.cos(mainAngle);
    final mainY = center.dy + radius * math.sin(mainAngle);

    final glowPaint = Paint()
      ..color = color.withOpacity(0.15)
      ..style = PaintingStyle.fill
      ..maskFilter = MaskFilter.blur(BlurStyle.normal, 8);

    canvas.drawCircle(Offset(mainX, mainY), 8, glowPaint);
  }

  @override
  bool shouldRepaint(covariant _OrbitNodesPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}