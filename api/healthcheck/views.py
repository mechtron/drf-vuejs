from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


class HealthCheck(APIView):
    permission_classes = ()

    def get(self, request):
        return Response({'is_healthy': True}, status=status.HTTP_200_OK)
