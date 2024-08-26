from rest_framework import viewsets

from ...models import Track

from ..serializers import TrackSerializer


class TrackModelViewSet(viewsets.ModelViewSet):
    serializer_class = TrackSerializer
    queryset = Track.objects.all()

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
