import 'package:flutter/material.dart';

class TermsOfUseScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final bgColor = Theme.of(context).scaffoldBackgroundColor;
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
              'Términos de Uso',
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

            // 1. Aceptación
            _buildSection(
              title: '1. Aceptación de los Términos',
              content: 'Al acceder y utilizar RetiScan, aceptas estos Términos de Uso en su totalidad. Si no estás de acuerdo con alguno de estos términos, no debes utilizar el servicio.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 2. Qué es RetiScan
            _buildSection(
              title: '2. Qué es RetiScan',
              content: 'RetiScan es una herramienta de apoyo diagnóstico basada en inteligencia artificial que ofrece:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildBulletList(
              items: [
                'Análisis de imágenes de retina para detectar posibles signos de retinopatía diabética',
                'Clasificación del grado de severidad detectado',
                'Identificación de posibles lesiones como microaneurismas, hemorragias o exudados',
                'Generación de reportes orientativos de cada análisis',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 3. Quién puede usarlo
            _buildSection(
              title: '3. Quién Puede Usar RetiScan',
              content: 'RetiScan está dirigido a:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildBulletList(
              items: [
                'Médicos: profesionales de la salud con licencia que pueden registrar pacientes, capturar imágenes y obtener análisis',
                'Pacientes: usuarios creados por un médico que pueden ver sus análisis y recomendaciones',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            SizedBox(height: 8),
            _buildSection(
              title: '',
              content: 'El registro de médicos se realiza a través de nuestra página web con verificación de credenciales profesionales.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 4. Cómo funciona
            _buildSection(
              title: '4. Cómo Funciona',
              content: 'El proceso es sencillo:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildBulletList(
              items: [
                'El médico captura o sube una imagen de la retina del paciente',
                'La inteligencia artificial verifica que la imagen sea clara y esté bien enfocada',
                'El sistema analiza la imagen buscando señales de retinopatía diabética',
                'Se genera un resultado con el grado de severidad y las lesiones detectadas',
                'El médico revisa el resultado y toma sus decisiones clínicas',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 5. Uso aceptable
            _buildSection(
              title: '5. Uso Aceptable',
              content: 'Al utilizar RetiScan, te comprometes a:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildBulletList(
              items: [
                'Usar el servicio únicamente para fines profesionales legítimos',
                'No utilizar los resultados como único diagnóstico sin supervisión clínica',
                'No intentar acceder indebidamente a cuentas de otros usuarios',
                'Capturar solo imágenes de pacientes bajo tu atención',
                'Cumplir con todas las leyes y regulaciones aplicables',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 6. Propiedad intelectual
            _buildSection(
              title: '6. Propiedad Intelectual',
              content: 'Todo el contenido, código fuente, modelos de inteligencia artificial, algoritmos de análisis, diseños y materiales de RetiScan son propiedad de sus desarrolladores y están protegidos por las leyes de propiedad intelectual aplicables. No está permitido copiar, modificar o distribuir ningún elemento sin autorización expresa.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 7. Descargo de responsabilidad
            _buildSection(
              title: '7. Descargo de Responsabilidad',
              content: 'Es importante que entiendas que:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildBulletList(
              items: [
                'Los resultados generados por RetiScan son orientativos, no definitivos',
                'El servicio no sustituye la consulta con un oftalmólogo certificado',
                'RetiScan no está destinado para emergencias médicas',
                'La precisión puede variar según la calidad de la imagen proporcionada',
                'El profesional de salud es responsable de validar los resultados antes de tomar decisiones clínicas',
              ],
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 8. Disponibilidad
            _buildSection(
              title: '8. Disponibilidad del Servicio',
              content: 'Nos esforzamos por mantener RetiScan disponible de forma continua, pero no garantizamos la disponibilidad ininterrumpida. Nos reservamos el derecho de realizar mantenimientos programados o suspender el servicio temporalmente por razones técnicas.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 9. Cambios
            _buildSection(
              title: '9. Cambios en los Términos',
              content: 'Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. Las modificaciones serán efectivas una vez publicadas en esta página. El uso continuado del servicio después de los cambios constituye la aceptación de los nuevos términos.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 10. Terminación
            _buildSection(
              title: '10. Terminación',
              content: 'Podemos suspender o cancelar tu acceso a RetiScan si violas estos términos o si determinamos que tu uso del servicio representa un riesgo para la plataforma o para otros usuarios. También puedes solicitar la eliminación de tu cuenta en cualquier momento.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 11. Ley aplicable
            _buildSection(
              title: '11. Ley Aplicable',
              content: 'Estos Términos de Uso se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia será resuelta por los tribunales competentes en la jurisdicción correspondiente.',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildDivider(),

            // 12. Contacto
            _buildSection(
              title: '12. Contacto',
              content: 'Si tienes preguntas sobre estos Términos de Uso, contáctanos a través de:',
              textPrimary: textPrimary,
              textSecondary: textSecondary,
            ),
            _buildContactInfo(
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
        if (title.isNotEmpty)
          Text(
            title,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: textPrimary,
            ),
          ),
        if (title.isNotEmpty) SizedBox(height: 12),
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
    required String email,
    required Color textSecondary,
  }) {
    return Padding(
      padding: EdgeInsets.only(bottom: 16),
      child: Text(
        email,
        style: TextStyle(
          fontSize: 14,
          color: Colors.cyan,
          fontWeight: FontWeight.w500,
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
