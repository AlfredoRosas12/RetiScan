import 'dart:convert';
import '../config/api_config.dart';
import '../models/recommendation.dart';

class RecommendationService {
  static final RecommendationService _instance = RecommendationService._internal();
  factory RecommendationService() => _instance;
  RecommendationService._internal();

  /// GET /recommendations/my — Obtener mis recomendaciones (PACIENTE)
  Future<List<Recommendation>> getMyRecommendations() async {
    final res = await ApiConfig.get('/recommendations/my');
    if (res.statusCode == 200) {
      final list = jsonDecode(res.body) as List<dynamic>;
      return list
          .map((e) => Recommendation.fromJson(e as Map<String, dynamic>))
          .toList();
    }
    throw _apiError(res);
  }

  /// GET /recommendations/patient/:patientId — Recomendaciones de un paciente (MEDICO)
  Future<List<Recommendation>> getPatientRecommendations(String patientId) async {
    final res = await ApiConfig.get('/recommendations/patient/$patientId');
    if (res.statusCode == 200) {
      final list = jsonDecode(res.body) as List<dynamic>;
      return list
          .map((e) => Recommendation.fromJson(e as Map<String, dynamic>))
          .toList();
    }
    throw _apiError(res);
  }

  /// POST /recommendations/:id/confirm — Confirmar toma de medicamento (PACIENTE)
  Future<Map<String, dynamic>> confirmMedicationTaken(String recommendationId) async {
    final res = await ApiConfig.post('/recommendations/$recommendationId/confirm', body: {});
    if (res.statusCode == 200) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw _apiError(res);
  }

  /// GET /recommendations/:id/logs — Historial de tomas
  Future<List<Map<String, dynamic>>> getMedicationLogs(String recommendationId) async {
    final res = await ApiConfig.get('/recommendations/$recommendationId/logs');
    if (res.statusCode == 200) {
      final list = jsonDecode(res.body) as List<dynamic>;
      return list.cast<Map<String, dynamic>>();
    }
    throw _apiError(res);
  }

  Exception _apiError(dynamic res) {
    try {
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      return Exception(body['message'] ?? body['error'] ?? 'Error ${res.statusCode}');
    } catch (_) {
      return Exception('Error ${res.statusCode}');
    }
  }
}
