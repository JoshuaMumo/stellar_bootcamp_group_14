from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class University(AbstractUser):
    """
    Custom user model representing an authorized university.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    university_name = models.CharField(max_length=255, unique=True)
    registration_number = models.CharField(max_length=100, unique=True, help_text="Official Gov/Accreditation ID")
    is_verified = models.BooleanField(default=False, help_text="Checked by superadmin before they can issue certs")
    
    # Optional: Fix related_name clashes if you have other user models
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='university_user_set',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='university_user_permissions_set',
        blank=True,
    )

    def __str__(self):
        return self.university_name

class CertificateMetadata(models.Model):
    """
    Stores the off-chain data for a certificate. 
    The document_hash is the crucial link to the Soroban smart contract.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    issuer = models.ForeignKey(University, on_delete=models.CASCADE, related_name='issued_certificates')
    
    # Student & Degree Details
    student_name = models.CharField(max_length=255)
    student_id = models.CharField(max_length=100)
    degree_name = models.CharField(max_length=255)
    graduation_year = models.IntegerField()
    
    # The Cryptographic Hash (Link to On-Chain Data)
    document_hash = models.CharField(max_length=64, unique=True, help_text="SHA-256 hash of the PDF")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_name} - {self.degree_name} ({self.graduation_year})"