from rest_framework import serializers
from .models import CertificateMetadata

class CertificateProcessSerializer(serializers.ModelSerializer):
    # Accept the file in the request, but don't try to save it to the database model
    pdf_file = serializers.FileField(write_only=True)

    class Meta:
        model = CertificateMetadata
        fields = ['student_name', 'student_id', 'degree_name', 'graduation_year', 'pdf_file']