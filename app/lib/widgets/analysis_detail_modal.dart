import 'package:flutter/material.dart';
import 'package:another_flushbar/flushbar.dart';
import '../models/analysis.dart';
import '../services/analysis_service.dart';
import '../config/api_config.dart';

class AnalysisDetailModal extends StatefulWidget {
  final Analysis analysis;

  const AnalysisDetailModal({Key? key, required this.analysis}) : super(key: key);

  @override
  _AnalysisDetailModalState createState() => _AnalysisDetailModalState();
}

class _AnalysisDetailModalState extends State<AnalysisDetailModal> {
  final AnalysisService _analysisService = AnalysisService();
  final TextEditingController _notesController = TextEditingController();
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _notesController.text = widget.analysis.doctorNotes ?? '';
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _saveNotes() async {
    setState(() => _isSaving = true);
    
    try {
      await _analysisService.updateAnalysisNotes(widget.analysis.id, _notesController.text.trim());
      
      if (!mounted) return;
      
      Navigator.of(context).pop(); // Cerrar modal
      
      Flushbar(
        title: 'Diagnóstico Confirmado',
        message: 'Las notas médicas se han guardado exitosamente.',
        icon: const Icon(Icons.check_circle_outline, size: 28, color: Colors.greenAccent),
        shouldIconPulse: false,
        backgroundColor: const Color(0xFF1E1E2E),
        borderColor: Colors.greenAccent.withOpacity(0.5),
        borderWidth: 1.5,
        borderRadius: BorderRadius.circular(12),
        margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        flushbarPosition: FlushbarPosition.TOP,
        duration: const Duration(seconds: 3),
        boxShadows: [
          BoxShadow(color: Colors.greenAccent.withOpacity(0.2), blurRadius: 10)
        ],
        titleColor: Colors.white,
        messageColor: Colors.white70,
      ).show(context);
    } catch (e) {
      if (!mounted) return;
      Flushbar(
        title: 'Error',
        message: 'No se pudieron guardar las notas: ${e.toString().replaceAll('Exception: ', '')}',
        icon: const Icon(Icons.error_outline, size: 28, color: Colors.redAccent),
        shouldIconPulse: false,
        backgroundColor: const Color(0xFF1E1E2E),
        borderColor: Colors.redAccent.withOpacity(0.5),
        borderWidth: 1.5,
        borderRadius: BorderRadius.circular(12),
        margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        flushbarPosition: FlushbarPosition.TOP,
        duration: const Duration(seconds: 4),
        titleColor: Colors.white,
        messageColor: Colors.white70,
      ).show(context);
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  void _zoomAtCenter(TransformationController controller, Size size, double factor) {
    final Matrix4 currentMatrix = controller.value.clone();
    final double currentScale = currentMatrix.getMaxScaleOnAxis();
    final double targetScale = (currentScale * factor).clamp(0.8, 6.0);
    final double scaleFactor = targetScale / currentScale;

    final Offset focalPoint = Offset(size.width / 2, size.height / 2);
    final Matrix4 translation = Matrix4.translationValues(focalPoint.dx, focalPoint.dy, 0);
    final Matrix4 scale = Matrix4.identity()..scale(scaleFactor, scaleFactor, 1.0);
    final Matrix4 negTranslation = Matrix4.translationValues(-focalPoint.dx, -focalPoint.dy, 0);

    controller.value = translation * scale * negTranslation * currentMatrix;
  }

  void _showFullScreenImage(String imageUrl) {
    final transformationController = TransformationController();

    Navigator.of(context).push(
      PageRouteBuilder(
        opaque: false,
        pageBuilder: (context, _, __) {
          final size = MediaQuery.of(context).size;
          return Scaffold(
            backgroundColor: Colors.black,
            body: Stack(
              children: [
                // Interactive medical image viewer (fits screen by default)
                Center(
                  child: InteractiveViewer(
                    transformationController: transformationController,
                    panEnabled: true,
                    minScale: 0.8,
                    maxScale: 6.0,
                    child: Container(
                      width: size.width * 0.92,
                      height: size.height * 0.92,
                      alignment: Alignment.center,
                      child: Image.network(
                        imageUrl,
                        fit: BoxFit.contain,
                        filterQuality: FilterQuality.high,
                        errorBuilder: (context, error, stackTrace) =>
                            const Center(child: Icon(Icons.broken_image, size: 80, color: Colors.white54)),
                      ),
                    ),
                  ),
                ),
                // Top Right: Close button
                Positioned(
                  top: MediaQuery.of(context).padding.top + 16,
                  right: 16,
                  child: Container(
                    decoration: const BoxDecoration(
                      color: Colors.black54,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.close, color: Colors.white, size: 28),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ),
                ),
                // Bottom Center: Professional Medical Toolbar (Reset / Zoom In / Zoom Out)
                Positioned(
                  bottom: 32,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.black87,
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(color: Colors.white24, width: 1),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.zoom_out, color: Colors.white),
                            tooltip: 'Alejar',
                            onPressed: () => _zoomAtCenter(transformationController, size, 0.8),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.restart_alt, color: Colors.white),
                            tooltip: 'Restablecer vista',
                            onPressed: () {
                              transformationController.value = Matrix4.identity();
                            },
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.zoom_in, color: Colors.white),
                            tooltip: 'Acercar',
                            onPressed: () => _zoomAtCenter(transformationController, size, 1.25),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final primaryColor = Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).colorScheme.secondary 
        : Theme.of(context).colorScheme.primary;

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        width: double.infinity,
        constraints: BoxConstraints(maxWidth: 600, maxHeight: MediaQuery.of(context).size.height * 0.95),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.arrow_back, color: textPrimary),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  const SizedBox(width: 8),
                  Text('Revisión Médica', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: textPrimary)),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Retina Image Display
                    if (widget.analysis.imageUri != null)
                      GestureDetector(
                        onTap: () {
                          final url = ApiConfig.imageUrl(widget.analysis.imageUri);
                          _showFullScreenImage(url);
                        },
                        child: Container(
                          height: 250,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            color: Colors.black12,
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              Image.network(
                                ApiConfig.imageUrl(widget.analysis.imageUri),
                                fit: BoxFit.contain,
                                filterQuality: FilterQuality.high,
                                errorBuilder: (context, error, stackTrace) =>
                                    const Center(child: Icon(Icons.broken_image, size: 60, color: Colors.grey)),
                              ),
                              Positioned(
                                bottom: 12,
                                right: 12,
                                child: Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: Colors.black54,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.fullscreen, color: Colors.white, size: 20),
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                    else
                      Container(
                        height: 200,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          color: Colors.black12,
                        ),
                        child: Center(child: Text('Imagen no disponible', style: TextStyle(color: textPrimary))),
                      ),
                      
                    const SizedBox(height: 24),
                    Text('Resultados IA', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textPrimary)),
                    const SizedBox(height: 12),
                    
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Theme.of(context).cardTheme.color,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (widget.analysis.aiResult != null && widget.analysis.aiResult!['grade'] != null) ...[
                            Text('Grado de Retinopatía: ${widget.analysis.aiResult!['grade']}', style: TextStyle(fontSize: 16, color: textPrimary, fontWeight: FontWeight.w600)),
                            const SizedBox(height: 8),
                            Text('Confianza: ${widget.analysis.aiResult!['confidence']}', style: TextStyle(fontSize: 14, color: textPrimary.withOpacity(0.7))),
                          ] else
                            Text('Sin resultados concluyentes de IA', style: TextStyle(fontSize: 14, color: textPrimary.withOpacity(0.7))),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    Text('Validación y Notas Clínicas', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textPrimary)),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _notesController,
                      maxLines: 4,
                      style: TextStyle(color: textPrimary),
                      decoration: InputDecoration(
                        hintText: 'Añadir diagnóstico, tratamiento u observaciones...',
                        hintStyle: TextStyle(color: textPrimary.withOpacity(0.4)),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        filled: true,
                        fillColor: Theme.of(context).cardTheme.color,
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: _isSaving ? null : _saveNotes,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryColor,
                        foregroundColor: Theme.of(context).colorScheme.onPrimary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: _isSaving 
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Text('Confirmar Diagnóstico', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
