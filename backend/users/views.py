from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from .serializers import RegisterSerializer, LoginSerializer
from .models import User


# USER REGISTRATION WITH EMAIL VERIFICATION
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_active=False)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        verify_url = f"http://localhost:3000/auth/verify?token={access_token}"

        # Send verification email
        send_mail(
            subject="Verify your email",
            message=f"Hello {user.username},\n\nPlease verify your account using the link below:\n{verify_url}\n\nThank you!",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )
        headers = self.get_success_headers(serializer.data)
        return Response({"success": True, "detail": "Registration successful. Check your email for verification."}, status=status.HTTP_201_CREATED, headers=headers)


# EMAIL VERIFICATION
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.GET.get("token")
        if not token:
            return Response({"detail": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            user = get_object_or_404(User, id=user_id)

            if not user.is_active:
                user.is_active = True
                user.save()
                return Response({"detail": "Email verified successfully. Go to the login page."}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Email already verified."}, status=status.HTTP_200_OK)
        except Exception as e:
            print("Email verification error:", e)
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)


# LOGIN WITH JWT TOKENS
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

            user = authenticate(request, username=user.email, password=password)
            if user is None:
                return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

            if not user.is_active:
                return Response({"error": "Please verify your email before logging in."}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "message": "Login successful",
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# FORGOT PASSWORD
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if user:
            token = get_random_string(32)
            user.reset_token = token
            user.save()

            reset_url = f"http://localhost:3000/auth/reset?token={token}"

            send_mail(
                subject="Password Reset Request",
                message=f"Hello {user.username},\n\nReset your password using this link:\n{reset_url}\n\nIf you didn't request this, please ignore.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False,
            )

        # Always return this to avoid revealing if email exists
        return Response({"detail": "If your email exists, a reset link has been sent."}, status=status.HTTP_200_OK)


# RESET PASSWORD
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        password = request.data.get("password")

        if not token or not password:
            return Response({"detail": "Token and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(reset_token=token).first()
        if not user:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.reset_token = ""
        user.save()

        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)
