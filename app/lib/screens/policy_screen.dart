import 'package:flutter/material.dart';

class PolicyScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final bgColor = Theme.of(context).scaffoldBackgroundColor;
    final cardColor = Theme.of(context).cardTheme.color ?? Theme.of(context).colorScheme.surface;
    final primaryColor = Theme.of(context).colorScheme.primary;
    final textPrimary = Theme.of(context).textTheme.bodyLarge?.color ?? Colors.black;
    final textSecondary = Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7) ?? Colors.grey;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        title: SizedBox.shrink(),
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios, color: textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        backgroundColor: bgColor,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Text(
              'Política de Privacidad',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: textPrimary,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Última actualización: 22 de junio de 2026',
              style: TextStyle(
                fontSize: 13,
                color: textSecondary,
              ),
            ),
            SizedBox(height: 24),

            // AI Notice
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.blue.withOpacity(0.2)),
              ),
              child: RichText(
                text: TextSpan(
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.blue[300],
                    height: 1.5,
                  ),
                  children: [
                    TextSpan(
                      text: 'Aviso de generación asistida por IA: ',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.blue[200],
                      ),
                    ),
                    TextSpan(
                      text: 'Este documento ha sido generado con asistencia de inteligencia artificial y revisado por profesionales con conocimiento en la materia. Su contenido ofrece orientación general y no constituye asesoría legal definitiva.',
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 32),

            // 1. Responsable
            _buildSection(
              title: '1. Información del Responsable',
              content: 'El responsable del tratamiento de tus datos personales es RetiScan, una plataforma web para el análisis de imágenes de retina mediante inteligencia artificial, diseñada para apoyar a profesionales de la salud en la detección temprana de retinopatía diabética.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildContactInfo(
              text: 'Para consultas relacionadas con esta política, puedes contactarnos a:',
              email: 'retiscan2026@gmail.com',
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 2. Qué es RetiScan
            _buildSection(
              title: '2. Qué es RetiScan',
              content: 'RetiScan es una aplicación web que utiliza inteligencia artificial para analizar imágenes de retina y detectar posibles signos de retinopatía diabética. Está dirigida a médicos que pueden capturar o subir imágenes de sus pacientes, y a pacientes que desean revisar su salud visual. La aplicación genera resultados orientativos que ayudan al médico a tomar decisiones, pero no reemplaza un diagnóstico profesional.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 3. Datos que recopilamos
            _buildSection(
              title: '3. Datos que Recopilamos',
              content: 'Recopilamos información dependiendo del tipo de usuario que seas:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildSubSection(
              title: 'Si eres Médico:',
              items: [
                'Nombre completo',
                'Correo electrónico',
                'Contraseña (almacenada de forma encriptada)',
                'Cédula Profesional',
                'Especialidad médica',
                'Institución o clínica donde labora',
                'Teléfono de contacto',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildSubSection(
              title: 'Si eres Paciente:',
              items: [
                'Nombre completo',
                'Fecha de nacimiento',
                'Género',
                'Correo electrónico',
                'Teléfono de contacto',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildSubSection(
              title: 'Para ambos usuarios:',
              items: [
                'Imágenes de retina capturadas o subidas para su análisis',
                'Resultados generados por la inteligencia artificial',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 4. Cómo usamos tus datos
            _buildSection(
              title: '4. Cómo Usamos tus Datos',
              content: 'Utilizamos tu información para:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildBulletList(
              items: [
                'Analizar las imágenes de retina que subes para detectar signos de retinopatía diabética',
                'Generar resultados orientativos que ayuden al médico en su evaluación',
                'Crear reportes y expedientes de cada análisis realizado',
                'Gestionar tu cuenta y mantener tu sesión activa',
                'Enviarte notificaciones importantes sobre el servicio',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 5. Cómo protegemos tu información
            _buildSection(
              title: '5. Cómo Protegemos tu Información',
              content: 'Tomamos medidas de seguridad para cuidar tus datos. Las contraseñas se guardan encriptadas, el acceso a la plataforma requiere iniciar sesión, y cada usuario solo puede ver la información que le corresponde. Almacenamos los datos en servidores seguros con protección de acceso.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 6. Inteligencia Artificial
            _buildSection(
              title: '6. Inteligencia Artificial',
              content: 'Las imágenes de retina que subes son analizadas por un sistema de inteligencia artificial que hace lo siguiente:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildBulletList(
              items: [
                'Verifica que la imagen sea clara y esté bien enfocada',
                'Revisa la imagen buscando señales de retinopatía diabética',
                'Clasifica el grado de severidad detectado',
                'Identifica posibles lesiones como microaneurismas o hemorragias',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildImportantNote(
              note: 'Es importante que sepas que:',
              items: [
                'Los resultados son orientativos, no un diagnóstico definitivo',
                'La inteligencia artificial no reemplaza la valoración de un médico',
                'El médico es quien debe interpretar y validar los resultados',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 7. Tus derechos
            _buildSection(
              title: '7. Tus Derechos (ARCO)',
              content: 'Tienes derecho a:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildBulletList(
              items: [
                'Acceso: conocer qué datos personales tenemos sobre ti',
                'Rectificación: corregir datos inexactos o incompletos',
                'Cancelación: solicitar la eliminación de tus datos cuando ya no sean necesarios',
                'Oposición: oponerte al tratamiento de tus datos para fines específicos',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildContactInfo(
              text: 'Para ejercer estos derechos, contacta a:',
              email: 'retiscan2026@gmail.com',
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 8. Cuánto guardamos tus datos
            _buildSection(
              title: '8. Cuánto Guardamos tus Datos',
              content: 'Conservamos tu información mientras tu cuenta esté activa en la plataforma. Si eliminas tu cuenta, tus datos serán eliminados de manera segura.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 9. Dónde se almacenan
            _buildSection(
              title: '9. Dónde se Almacenan los Datos',
              content: 'Todos los datos se almacenan en servidores ubicados dentro de la República Mexicana. No se transfieren a otros países.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 10. Cookies
            _buildSection(
              title: '10. Cookies',
              content: 'RetiScan utiliza cookies para mantener tu sesión activa, recordar tus preferencias y mejorar tu experiencia dentro de la plataforma. Puedes configurar las cookies desde tu navegador.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 11. Cambios
            _buildSection(
              title: '11. Cambios en esta Política',
              content: 'Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Los cambios serán publicados en esta página con la fecha de la última actualización. Te recomendamos revisarla periódicamente.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 12. Contacto
            _buildSection(
              title: '12. Contacto',
              content: 'Si tienes preguntas sobre esta política de privacidad o sobre el tratamiento de tus datos personales, contáctanos a través de:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildContactInfo(
              text: '',
              email: 'retiscan2026@gmail.com',
              textSecondary: textSecondary,
            ),
            SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required String content,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: textPrimary,
          ),
        ),
        SizedBox(height: 12),
        Text(
          content,
          style: TextStyle(
            fontSize: 14,
            height: 1.6,
            color: textSecondary,
          ),
        ),
        SizedBox(height: 16),
      ],
    );
  }

  Widget _buildSubSection({
    required String title,
    required List<String> items,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    return Padding(
      padding: EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: textPrimary,
            ),
          ),
          SizedBox(height: 8),
          _buildBulletList(
            items: items,
            textPrimary: textPrimary,
            textSecondary: textSecondary,
          ),
        ],
      ),
    );
  }

  Widget _buildImportantNote({
    required String note,
    required List<String> items,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          note,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: textPrimary,
          ),
        ),
        SizedBox(height: 8),
        _buildBulletList(
          items: items,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
        ),
      ],
    );
  }

  Widget _buildBulletList({
    required List<String> items,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    return Padding(
      padding: EdgeInsets.only(left: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: items.map((item) {
          final parts = item.split(':');
          if (parts.length > 1) {
            return Padding(
              padding: EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '• ',
                    style: TextStyle(fontSize: 14, color: textSecondary),
                  ),
                  Expanded(
                    child: RichText(
                      text: TextSpan(
                        style: TextStyle(
                          fontSize: 14,
                          height: 1.5,
                          color: textSecondary,
                        ),
                        children: [
                          TextSpan(
                            text: '${parts[0]}: ',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: textPrimary,
                            ),
                          ),
                          TextSpan(
                            text: parts.sublist(1).join(':'),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          }
          return Padding(
            padding: EdgeInsets.only(bottom: 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '• ',
                  style: TextStyle(fontSize: 14, color: textSecondary),
                ),
                Expanded(
                  child: Text(
                    item,
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.5,
                      color: textSecondary,
                    ),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildContactInfo({
    required String text,
    required String email,
    required Color textSecondary,
  }) {
    return Padding(
      padding: EdgeInsets.only(bottom: 16),
      child: RichText(
        text: TextSpan(
          style: TextStyle(
            fontSize: 14,
            height: 1.5,
            color: textSecondary,
          ),
          children: [
            if (text.isNotEmpty) TextSpan(text: '$text '),
            TextSpan(
              text: email,
              style: TextStyle(
                color: Colors.cyan,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 16),
      height: 1,
      color: Colors.white.withOpacity(0.1),
    );
  }
}
