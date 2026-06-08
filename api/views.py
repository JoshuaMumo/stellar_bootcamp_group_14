from django.shortcuts import render
import hashlib
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import AllowAny
from .serializers import CertificateProcessSerializer, CertificateMetadataRetrieveSerializer
from .models import CertificateMetadata
from .soroban import submit_hash_to_contract

def generate_pdf_hash(file_object):
    """Generates a SHA-256 hash from a file object."""
    sha256_hash = hashlib.sha256()
    # CRITICAL: Reset file pointer to the beginning before reading
    file_object.seek(0)
    for byte_block in iter(lambda: file_object.read(4096), b""):
        sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

class ProcessCertificateView(APIView):
    # This ensures only universities with a valid JWT can access this endpoint
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CertificateProcessSerializer(data=request.data)
        
        if serializer.is_valid():
            # Extract the uploaded file from the validated data
            pdf_file = serializer.validated_data.pop('pdf_file')

            wallet_address = serializer.validated_data.pop('wallet_address')
            
            # 1. Generate the deterministic hash
            document_hash = generate_pdf_hash(pdf_file)
            
            # 2. Prevent duplicate certificates from being processed
            if CertificateMetadata.objects.filter(document_hash=document_hash).exists():
                return Response(
                    {"error": "A certificate with this exact hash has already been processed."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            blockchain_success = submit_hash_to_contract(document_hash, wallet_address)
            
            if not blockchain_success:
                return Response(
                    {"error": "Blockchain transaction failed or timed out."}, 
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            

            # 3. Save the off-chain metadata linked to the authenticated university
            metadata = CertificateMetadata.objects.create(
                issuer=request.user,
                document_hash=document_hash,
                **serializer.validated_data
            )
            
            # 4. Return the hash so the frontend can sign the Soroban transaction
            return Response({
                "message": "Certificate processed successfully ready for on-chain registry.",
                "document_hash": document_hash
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CertificateMetadataView(RetrieveAPIView):
    """
    Allows anyone with the exact SHA-256 hash to retrieve the off-chain 
    metadata of the certificate.
    """
    queryset = CertificateMetadata.objects.all()
    serializer_class = CertificateMetadataRetrieveSerializer
    
    # Tell DRF to search by the hash in the URL, not the database ID
    lookup_field = 'document_hash'
    
    # Employers don't need a university login to verify a document
    permission_classes = [AllowAny]

class UniversityCertificateListView(ListAPIView):
    serializer_class = CertificateMetadataRetrieveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CertificateMetadata.objects.filter(issuer=self.request.user).order_by('-created_at')
    
class StudentCertificateListView(ListAPIView):
    """
    Retrieves all certificates issued to a specific student by the 
    authenticated university.
    """
    serializer_class = CertificateMetadataRetrieveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Extract the student_id from the URL path parameters
        student_id = self.kwargs.get('student_id')
        
        # Filter by both the authenticated university and the requested student ID
        return CertificateMetadata.objects.filter(
            issuer=self.request.user, 
            student_id=student_id
        ).order_by('-created_at')
