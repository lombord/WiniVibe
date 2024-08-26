from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework import status, generics as GS, permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer


from ..serializers import UserSessionSerializer, UserRegisterSerializer
from ..auth import jwt_manager, JWTCookieAuthentication
from ..permissions import UserNotAuthenticated


class LoginView(GenericAPIView):
    permission_classes = (UserNotAuthenticated,)
    authentication_classes = ()
    serializer_class = AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]  # type: ignore

        session_ser = UserSessionSerializer(instance=user)
        response = Response(session_ser.data, status=status.HTTP_201_CREATED)
        jwt_manager.login_token(request, response, user)
        return response


class LogoutBaseView(APIView):
    authentication_classes = (JWTCookieAuthentication,)

    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        jwt_manager.logout_token(response)
        return response


class LogoutView(LogoutBaseView):
    pass


class LogoutAllView(LogoutBaseView):
    pass


class UserRegisterAPIView(GS.CreateAPIView):
    permission_classes = (UserNotAuthenticated,)
    authentication_classes = ()
    serializer_class = UserRegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        self.request.user = user
        return user

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = request.user
        jwt_manager.login_token(request, response, user)
        response.data = UserSessionSerializer(instance=user).data
        return response


class CheckAuthView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        return Response(status=status.HTTP_204_NO_CONTENT)
