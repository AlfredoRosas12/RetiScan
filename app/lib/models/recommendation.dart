class Recommendation {
  final String id;
  final String patientId;
  final String type; // 'RECOMMENDATION' | 'MEDICATION'
  final String title;
  final String? description;
  final String? dosage;
  final int? frequencyHours;
  final DateTime? nextDoseAt;
  final bool isActive;
  final String? createdBy;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Recommendation({
    required this.id,
    required this.patientId,
    required this.type,
    required this.title,
    this.description,
    this.dosage,
    this.frequencyHours,
    this.nextDoseAt,
    this.isActive = true,
    this.createdBy,
    this.createdAt,
    this.updatedAt,
  });

  bool get isRecommendation => type == 'RECOMMENDATION';
  bool get isMedication => type == 'MEDICATION';

  /// Display frequency as human-readable string (e.g., "c/12h")
  String? get frequencyDisplay {
    if (frequencyHours == null || frequencyHours! <= 0) return null;
    return 'c/${frequencyHours}h';
  }

  factory Recommendation.fromJson(Map<String, dynamic> json) {
    DateTime? parseDate(dynamic dateStr) {
      if (dateStr == null) return null;
      String s = dateStr.toString();
      if (!s.endsWith('Z') && s.length > 10) s += 'Z';
      return DateTime.tryParse(s)?.toLocal();
    }

    return Recommendation(
      id: (json['id'] ?? '').toString(),
      patientId: (json['patient_id'] ?? json['patientId'] ?? '').toString(),
      type: (json['type'] ?? 'RECOMMENDATION').toString(),
      title: (json['title'] ?? '').toString(),
      description: json['description']?.toString(),
      dosage: json['dosage']?.toString(),
      frequencyHours: (json['frequency_hours'] ?? json['frequencyHours'] as num?)?.toInt(),
      nextDoseAt: parseDate(json['next_dose_at'] ?? json['nextDoseAt']),
      isActive: json['is_active'] ?? json['isActive'] ?? true,
      createdBy: json['created_by']?.toString() ?? json['createdBy']?.toString(),
      createdAt: parseDate(json['created_at'] ?? json['createdAt']),
      updatedAt: parseDate(json['updated_at'] ?? json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'patient_id': patientId,
    'type': type,
    'title': title,
    if (description != null) 'description': description,
    if (dosage != null) 'dosage': dosage,
    if (frequencyHours != null) 'frequency_hours': frequencyHours,
    if (nextDoseAt != null) 'next_dose_at': nextDoseAt!.toIso8601String(),
    'is_active': isActive,
    if (createdBy != null) 'created_by': createdBy,
    if (createdAt != null) 'created_at': createdAt!.toIso8601String(),
    if (updatedAt != null) 'updated_at': updatedAt!.toIso8601String(),
  };

  Recommendation copyWith({
    String? id,
    String? patientId,
    String? type,
    String? title,
    String? description,
    String? dosage,
    int? frequencyHours,
    DateTime? nextDoseAt,
    bool? isActive,
    String? createdBy,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Recommendation(
      id: id ?? this.id,
      patientId: patientId ?? this.patientId,
      type: type ?? this.type,
      title: title ?? this.title,
      description: description ?? this.description,
      dosage: dosage ?? this.dosage,
      frequencyHours: frequencyHours ?? this.frequencyHours,
      nextDoseAt: nextDoseAt ?? this.nextDoseAt,
      isActive: isActive ?? this.isActive,
      createdBy: createdBy ?? this.createdBy,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
