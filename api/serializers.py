from rest_framework import serializers
from .models import CertificateMetadata

class CertificateProcessSerializer(serializers.ModelSerializer):
    # Accept the file in the request, but don't try to save it to the database model
    pdf_file = serializers.FileField(write_only=True)

    class Meta:
        model = CertificateMetadata
        fields = ['student_name', 'student_id', 'degree_name', 'graduation_year', 'pdf_file']

class CertificateMetadataRetrieveSerializer(serializers.ModelSerializer):
    # Pull the university name directly from the related University model
    university_name = serializers.CharField(source='issuer.university_name', read_only=True)

    class Meta:
        model = CertificateMetadata
        # Define exactly what the employer sees. Notice we do NOT expose the internal UUID.
        fields = [
            'student_name', 
            'student_id', 
            'degree_name', 
            'graduation_year', 
            'university_name',
            'status', 
            'created_at'
        ]