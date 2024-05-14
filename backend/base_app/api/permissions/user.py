from rest_framework.permissions import BasePermission
from rest_framework.request import HttpRequest


class UserNotAuthenticated(BasePermission):

    def has_permission(self, request: HttpRequest, view):
        return not request.user.is_authenticated
