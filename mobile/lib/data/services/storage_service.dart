import 'dart:convert';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/data/services/api_service.dart';
import '../../config/app_constants.dart';

class StorageService {
  final ApiService _apiService = ApiService();

  Future<String?> uploadFile(PlatformFile file) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}/storage/files/upload');
      final request = http.MultipartRequest('POST', uri);
      
      print('StorageService: Getting SharedPreferences instance...');
      // Check SharedPreferences
      SharedPreferences? prefs;
      try {
        prefs = await SharedPreferences.getInstance();
        print('StorageService: SharedPreferences instance got.');
      } catch (e) {
        print('StorageService: Error getting SharedPreferences: $e');
        rethrow;
      }

      final token = prefs.getString('jwt_token');
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }

      // Lookup mime type
      final mimeType = lookupMimeType(file.name) ?? 'application/octet-stream';
      MediaType? mediaType;
      try {
        mediaType = MediaType.parse(mimeType);
      } catch (e) {
        print('StorageService: Could not parse mime type $mimeType');
      }

      print('StorageService: Detected MIME type: $mimeType');

      if (kIsWeb) {
        print('StorageService: Compiling Web File...');
        if (file.bytes != null) {
          request.files.add(http.MultipartFile.fromBytes(
            'file',
            file.bytes!,
            filename: file.name,
            contentType: mediaType,
          ));
        } else {
          print('StorageService: File bytes are NULL on Web!');
          throw Exception('File bytes are null on Web');
        }
      } else {
        print('StorageService: Compiling Mobile File...');
        if (file.path != null) {
          request.files.add(await http.MultipartFile.fromPath(
            'file', 
            file.path!,
            filename: file.name,
            contentType: mediaType,
          ));
        } else {
           throw Exception('File path is null on Mobile');
        }
      }

      print('StorageService: Sending request...');
      final streamedResponse = await request.send();
      print('StorageService: Response received ${streamedResponse.statusCode}');
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode >= 200 && response.statusCode < 300) {
         final data = jsonDecode(response.body);
         // Backend returns FileUploadResponse which has 'downloadUrl'
         return data['downloadUrl'];
      } else {
        throw Exception('Upload failed: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      throw Exception('Upload error: $e');
    }
  }
  Future<List<Map<String, dynamic>>> getMyFiles() async {
    try {
      final response = await _apiService.get('/storage/files/my-files');
      if (response is List) {
        return List<Map<String, dynamic>>.from(response);
      }
    } catch (e) {
      print('StorageService: Error getting my files: $e');
    }
    return [];
  }

  Future<List<Map<String, dynamic>>> getProjectFiles(int projectId) async {
    try {
      final response = await _apiService.get('/storage/files/project/$projectId');
      if (response is List) {
        return List<Map<String, dynamic>>.from(response);
      }
    } catch (e) {
      print('StorageService: Error getting project files: $e');
    }
    return [];
  }
}
