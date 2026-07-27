import 'package:flutter/material.dart';
import 'package:another_flushbar/flushbar.dart';
import '../services/auth_service.dart';
import '../services/patient_service.dart';
import '../models/patient.dart';

class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with SingleTickerProviderStateMixin {
  final AuthService _authService = AuthService();
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;
  
  Patient? _patientData;
  bool _isLoadingPatient = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );
    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );
    _controller.forward();
    
    if (_authService.currentUser?.role == 'PACIENTE') {
      _fetchPatientData();
    }
  }

  Future<void> _fetchPatientData() async {
    setState(() => _isLoadingPatient = true);
    try {
      final patient = await PatientService().getMyRecord();
      if (mounted) {
        setState(() => _patientData = patient);
      }
    } catch (e) {
      debugPrint('Error obteniendo expediente: $e');
    } finally {
      if (mounted) {
        setState(() => _isLoadingPatient = false);
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  // ── Cambiar contraseña ───────────────────────────────────────────────────

  Future<void> _showChangePasswordDialog() async {
    final newCtrl = TextEditingController();
    final confirmCtrl = TextEditingController();
    final otpCtrl = TextEditingController(); // Control para el OTP
    final formKey = GlobalKey<FormState>();
    bool obscureNew = true;
    bool obscureConfirm = true;
    bool isSaving = false;
    bool requiresOtp = false; // Bandera para la fase 2 del cambio
    final email = _authService.currentUser?.email;

    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setS) => AlertDialog(
          title: Row(
            children: [
              Icon(Icons.lock_reset, color: Color(0xFF2563EB)),
              SizedBox(width: 10),
              Text('Cambiar Contraseña'),
            ],
          ),
          content: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (!requiresOtp) ...[
                  _dialogPasswordField(
                    ctrl: newCtrl,
                    label: 'Nueva contraseña',
                    obscure: obscureNew,
                    onToggle: () => setS(() => obscureNew = !obscureNew),
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Requerido';
                      if (v.length < 6) return 'Mínimo 6 caracteres';
                      return null;
                    },
                  ),
                  SizedBox(height: 14),
                  _dialogPasswordField(
                    ctrl: confirmCtrl,
                    label: 'Confirmar nueva contraseña',
                    obscure: obscureConfirm,
                    onToggle: () =>
                        setS(() => obscureConfirm = !obscureConfirm),
                    validator: (v) =>
                        v != newCtrl.text ? 'Las contraseñas no coinciden' : null,
                  ),
                ] else ...[
                  Text(
                    'Hemos enviado un código seguro a $email. Escríbelo para autorizar el cambio.',
                    style: TextStyle(fontSize: 13, color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.8)),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 16),
                  TextFormField(
                    controller: otpCtrl,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 24, letterSpacing: 6, fontWeight: FontWeight.bold),
                    decoration: InputDecoration(
                      labelText: 'Código MFA',
                      prefixIcon: Icon(Icons.security),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                    ),
                    validator: (v) => v!.length < 6 ? 'Requiere 6 dígitos' : null,
                  ),
                ],
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: isSaving ? null : () => Navigator.pop(ctx),
              child: Text('Cancelar'),
            ),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF2563EB),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
              ),
              icon: isSaving
                  ? SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white))
                  : Icon(requiresOtp ? Icons.check_circle : Icons.send, size: 18),
              label: Text(isSaving 
                 ? 'Procesando...' 
                 : (requiresOtp ? 'Autorizar' : (email != null && email.isNotEmpty ? 'Continuar' : 'Guardar'))),
              onPressed: isSaving
                  ? null
                  : () async {
                      if (!formKey.currentState!.validate()) return;
                      setS(() => isSaving = true);

                      // FASE 1: Requerir envío de correo OTP
                      if (!requiresOtp && email != null && email.isNotEmpty) {
                        final otpRes = await _authService.sendOtp(email);
                        if (!mounted) return;
                        setS(() => isSaving = false);
                        
                        if (otpRes['success'] == true) {
                          setS(() => requiresOtp = true); // Cambia el modal a vista de OTP
                        } else {
                          Flushbar(
                            title: 'Error',
                            message: otpRes['message'] ?? 'Error al enviar código de seguridad',
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
                        return; // Frenamos y esperamos el input
                      }

                      // FASE 2: Validar API y Modificar Contraseña
                      final result = await _authService.changePassword(
                        newCtrl.text.trim(),
                        requiresOtp ? otpCtrl.text.trim() : null
                      );

                      if (!mounted) return;

                      if (result['success'] == true) {
                        Navigator.pop(ctx);
                        Flushbar(
                          title: 'Éxito',
                          message: 'Contraseña actualizada correctamente',
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
                      } else {
                        setS(() => isSaving = false);
                        Flushbar(
                          title: 'Error',
                          message: result['message'] ?? 'Error al cambiar contraseña',
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
                    },
            ),
          ],
        ),
      ),
    );

    newCtrl.dispose();
    confirmCtrl.dispose();
    otpCtrl.dispose();
  }

  Widget _dialogPasswordField({
    required TextEditingController ctrl,
    required String label,
    required bool obscure,
    required VoidCallback onToggle,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: ctrl,
      obscureText: obscure,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(Icons.lock_outline),
        suffixIcon: IconButton(
          icon: Icon(
              obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined),
          onPressed: onToggle,
        ),
        border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        contentPadding:
            EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      ),
    );
  }

  // ── Build ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final user = _authService.currentUser;
    return FadeTransition(
      opacity: _fadeAnimation,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final isDesktop = constraints.maxWidth >= 1000;
          if (isDesktop) return _buildDesktopContent(user);
          return _buildMobileContent(user);
        },
      ),
    );
  }

  // ── Layout Móvil ────────────────────────────────────────────────────────

  Widget _buildMobileContent(user) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(20),
      child: Column(
        children: [
          ScaleTransition(
            scale: _scaleAnimation,
            child: _buildHeader(user),
          ),
          SizedBox(height: 32),
          _buildDesktopInfoTable(user),
          SizedBox(height: 16),
          _buildDesktopSecuritySection(),
          SizedBox(height: 16),
          _buildDesktopRoleSection(user?.role ?? 'PACIENTE'),
          SizedBox(height: 20),
        ],
      ),
    );
  }

  // ── Layout Escritorio (2 columnas) ──────────────────────────────────────

  Widget _buildDesktopContent(user) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: 1100),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 32, vertical: 28),
          child: Column(
            children: [
              ScaleTransition(
                scale: _scaleAnimation,
                child: _buildHeader(user),
              ),
              SizedBox(height: 28),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 55,
                    child: _buildDesktopInfoTable(user),
                  ),
                  SizedBox(width: 24),
                  Expanded(
                    flex: 45,
                    child: Column(
                      children: [
                        _buildDesktopSecuritySection(),
                        SizedBox(height: 16),
                        _buildDesktopRoleSection(user?.role ?? 'PACIENTE'),
                      ],
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

  // ── Header con avatar de iniciales ───────────────────────────────────────

  Widget _buildHeader(user) {
    final name = _patientData?.fullName ?? user?.fullName ?? user?.name ?? user?.email ?? '';
    final email = user?.email ?? '';
    final initials = _getInitials(name);

    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(vertical: 32, horizontal: 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(context).colorScheme.primary,
            Theme.of(context).colorScheme.secondary,
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color:
                Theme.of(context).colorScheme.primary.withOpacity(0.35),
            blurRadius: 24,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          // Avatar con iniciales
          Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.25),
              shape: BoxShape.circle,
              border:
                  Border.all(color: Colors.white.withOpacity(0.5), width: 3),
            ),
            child: Center(
              child: Text(
                initials,
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          SizedBox(height: 16),
          // Nombre
          if (name != null && name.isNotEmpty) ...[
            Text(
              name,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 4),
            Text(
              email,
              style: TextStyle(
                fontSize: 14,
                color: Colors.white.withOpacity(0.85),
              ),
            ),
          ] else
            Text(
              email,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
        ],
      ),
    );
  }

  String _getInitials(String text) {
    final parts = text.trim().split(RegExp(r'[\s@.]+'));
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return text.isNotEmpty ? text[0].toUpperCase() : '?';
  }

  // ── Sección de información ───────────────────────────────────────────────

  Widget _buildInfoSection(user) {
    return _sectionCard(
      title: 'Información de Cuenta',
      icon: Icons.person_outline,
      accentColor: Colors.blue,
      children: [
        _infoRow(
          icon: Icons.email_outlined,
          label: 'Correo Electrónico',
          value: user?.email ?? '—',
        ),
        if (user?.fullName != null && user!.fullName!.isNotEmpty) ...[
          Divider(height: 1),
          _infoRow(
            icon: Icons.badge_outlined,
            label: 'Nombre completo',
            value: user.fullName!,
          ),
        ],
        if (user?.role == 'PACIENTE') ...[
          Divider(height: 1),
          _infoRow(
            icon: Icons.phone_outlined,
            label: 'Teléfono',
            value: _isLoadingPatient ? 'Cargando...' : (_patientData?.phone ?? '—'),
          ),
          Divider(height: 1),
          _infoRow(
            icon: Icons.wc_outlined,
            label: 'Género',
            value: _isLoadingPatient ? 'Cargando...' : (_patientData?.gender ?? '—'),
          ),
        ],
      ],
    );
  }

  // ── Sección de contraseña ────────────────────────────────────────────────

  Widget _buildPasswordSection() {
    return _sectionCard(
      title: 'Seguridad',
      icon: Icons.security_outlined,
      accentColor: Colors.orange,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Color(0xFF2563EB).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(Icons.lock_outline,
                    color: Color(0xFF2563EB), size: 18),
              ),
              SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Contraseña',
                        style: TextStyle(
                            fontSize: 13,
                            color: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.color
                                ?.withOpacity(0.6))),
                    Text('••••••••',
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            letterSpacing: 2,
                            color: Theme.of(context)
                                .textTheme
                                .bodyLarge
                                ?.color)),
                  ],
                ),
              ),
              TextButton.icon(
                onPressed: _showChangePasswordDialog,
                icon: Icon(Icons.edit_outlined, size: 16),
                label: Text('Cambiar'),
                style: TextButton.styleFrom(
                  foregroundColor: Color(0xFF2563EB),
                  padding:
                      EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ── Tarjeta de rol ───────────────────────────────────────────────────────

  Widget _buildRoleCard(String role) {
    final isDoctor = role == 'MEDICO';

    final Color color = isDoctor
            ? Colors.blue
            : Colors.green;
    final IconData icon = isDoctor
            ? Icons.medical_services_outlined
            : Icons.person_outline;
    final String label = isDoctor
            ? 'Médico'
            : 'Paciente';

    return _sectionCard(
      title: 'Rol en el sistema',
      icon: Icons.verified_user_outlined,
      accentColor: isDoctor ? Colors.blue : Colors.green,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              Container(
                padding: EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              SizedBox(width: 14),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Rol asignado',
                      style: TextStyle(
                          fontSize: 12,
                          color: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.color
                              ?.withOpacity(0.6))),
                  Text(label,
                      style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: color)),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  Widget _sectionCard({
    required String title,
    required IconData icon,
    required List<Widget> children,
    Color? accentColor,
  }) {
    final accent = accentColor ?? Theme.of(context).colorScheme.primary;
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Theme.of(context).dividerColor.withOpacity(0.5),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            decoration: BoxDecoration(
              border: Border(
                left: BorderSide(color: accent, width: 4),
              ),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(16),
                bottomLeft: Radius.circular(16),
              ),
            ),
            child: Padding(
              padding: EdgeInsets.fromLTRB(16, 14, 16, 10),
              child: Row(
                children: [
                  Container(
                    padding: EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: accent.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(icon, size: 16, color: accent),
                  ),
                  SizedBox(width: 10),
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context)
                          .textTheme
                          .bodyMedium
                          ?.color
                          ?.withOpacity(0.6),
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Divider(height: 1),
          ...children,
        ],
      ),
    );
  }

  Widget _infoRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Theme.of(context)
                  .colorScheme
                  .primary
                  .withOpacity(0.08),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon,
                color: Theme.of(context).colorScheme.primary, size: 18),
          ),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: TextStyle(
                        fontSize: 12,
                        color: Theme.of(context)
                            .textTheme
                            .bodyMedium
                            ?.color
                            ?.withOpacity(0.6))),
                Text(value,
                    style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: Theme.of(context)
                            .textTheme
                            .bodyLarge
                            ?.color)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Desktop Table Methods ─────────────────────────────────────────────

  Widget _buildDesktopInfoTable(user) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 12, offset: Offset(0, 4)),
        ],
      ),
      child: Column(
        children: [
          _buildTableHeader('Información de Cuenta', Icons.person_outline, Colors.blue),
          _buildInfoTableRow(
            icon: Icons.email_outlined,
            label: 'Correo Electrónico',
            value: user?.email ?? '—',
            accentColor: Colors.blue,
          ),
          _buildInfoTableRow(
            icon: Icons.badge_outlined,
            label: 'Nombre completo',
            value: _patientData?.fullName ?? user?.fullName ?? user?.name ?? '—',
            accentColor: Colors.blue,
          ),
          if (user?.role == 'PACIENTE') ...[
            _buildInfoTableRow(
              icon: Icons.phone_outlined,
              label: 'Teléfono',
              value: _isLoadingPatient ? 'Cargando...' : (_patientData?.phone ?? '—'),
              accentColor: Colors.blue,
            ),
            _buildInfoTableRow(
              icon: Icons.wc_outlined,
              label: 'Género',
              value: _isLoadingPatient ? 'Cargando...' : (_patientData?.gender ?? '—'),
              accentColor: Colors.blue,
              isLast: true,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTableHeader(String title, IconData icon, Color accentColor) {
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
            accentColor.withOpacity(0.08),
            accentColor.withOpacity(0.03),
          ],
        ),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(16),
          topRight: Radius.circular(16),
        ),
        border: Border(bottom: BorderSide(color: accentColor.withOpacity(0.12))),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: accentColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 16, color: accentColor),
          ),
          SizedBox(width: 10),
          Text(title.toUpperCase(), style: headerStyle),
        ],
      ),
    );
  }

  Widget _buildInfoTableRow({
    required IconData icon,
    required String label,
    required String value,
    required Color accentColor,
    bool isLast = false,
  }) {
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey;

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: InkWell(
        child: AnimatedContainer(
          duration: Duration(milliseconds: 200),
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            border: isLast ? null : Border(
              bottom: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.06)),
            ),
          ),
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
                    colors: [accentColor, accentColor.withOpacity(0.6)],
                  ),
                  boxShadow: [
                    BoxShadow(color: accentColor.withOpacity(0.3), blurRadius: 6, offset: Offset(0, 2)),
                  ],
                ),
                child: Center(
                  child: Icon(icon, color: Colors.white, size: 18),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(label, style: TextStyle(fontSize: 12, color: textSecondary)),
                    SizedBox(height: 2),
                    Text(value, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: textPrimary)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDesktopSecuritySection() {
    final accentColor = Colors.orange;
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey;

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 12, offset: Offset(0, 4)),
        ],
      ),
      child: Column(
        children: [
          _buildTableHeader('Seguridad', Icons.security_outlined, accentColor),
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: InkWell(
              onTap: _showChangePasswordDialog,
              child: AnimatedContainer(
                duration: Duration(milliseconds: 200),
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
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
                          colors: [accentColor, accentColor.withOpacity(0.6)],
                        ),
                        boxShadow: [
                          BoxShadow(color: accentColor.withOpacity(0.3), blurRadius: 6, offset: Offset(0, 2)),
                        ],
                      ),
                      child: Center(
                        child: Icon(Icons.lock_outline, color: Colors.white, size: 16),
                      ),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Contraseña', style: TextStyle(fontSize: 12, color: textSecondary)),
                          SizedBox(height: 2),
                          Text('••••••••', style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 2, color: textPrimary)),
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Color(0xFF2563EB).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text('Cambiar', style: TextStyle(
                        fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF2563EB))),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDesktopRoleSection(String role) {
    final isDoctor = role == 'MEDICO';
    final Color color = isDoctor ? Colors.blue : Colors.green;
    final IconData icon = isDoctor ? Icons.medical_services_outlined : Icons.person_outline;
    final String label = isDoctor ? 'Médico' : 'Paciente';
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey;

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withOpacity(0.1)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 12, offset: Offset(0, 4)),
        ],
      ),
      child: Column(
        children: [
          _buildTableHeader('Rol en el sistema', Icons.verified_user_outlined, color),
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: InkWell(
              child: AnimatedContainer(
                duration: Duration(milliseconds: 200),
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
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
                          colors: [color, color.withOpacity(0.6)],
                        ),
                        boxShadow: [
                          BoxShadow(color: color.withOpacity(0.3), blurRadius: 6, offset: Offset(0, 2)),
                        ],
                      ),
                      child: Center(
                        child: Icon(icon, color: Colors.white, size: 16),
                      ),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Rol asignado', style: TextStyle(fontSize: 12, color: textSecondary)),
                          SizedBox(height: 2),
                          Text(label, style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.bold, color: color)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}