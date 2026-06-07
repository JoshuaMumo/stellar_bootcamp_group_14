# api/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import ProcessCertificateView, CertificateMetadataView, UniversityCertificateListView

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('certificates/process/', ProcessCertificateView.as_view(), name='process_certificate'),
    path('certificates/<str:document_hash>/metadata/', CertificateMetadataView.as_view(), name='certificate_metadata'),
    path('certificates/', UniversityCertificateListView.as_view(), name='list_certificates'),
]