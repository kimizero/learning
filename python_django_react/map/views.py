from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
# from .serializers import RoomSerializer, RoomCreateSerializer, RoomUpdateSerializer
# from .models import Room
from django.http import JsonResponse
from .services import MapService


class MapView(APIView):

    def get(self, request):
        chunk_w_start = request.GET.get('chunk_w_start')
        chunk_w_end = request.GET.get('chunk_w_end')
        chunk_h_start = request.GET.get('chunk_h_start')
        chunk_h_end = request.GET.get('chunk_h_end')

        #not required
        map_seed = request.GET.get('map_seed')
        moisture_seed = request.GET.get('moisture_seed')
        map_width = request.GET.get('map_width')
        map_height = request.GET.get('map_height')
        zoom = request.GET.get('zoom')

        # if x is None or y is None or size is None or seed is None:
        #    return Response({"message": "Missing parameter. Add 'x', 'y', 'seed' and 'size'."}, status=status.HTTP_400_BAD_REQUEST)

        # compute map
        #chunk_w_start, chunk_w_end, chunk_h_start, chunk_h_end
        m = MapService(chunk_w_start=chunk_w_start, chunk_w_end=chunk_w_end, chunk_h_start=chunk_h_start, chunk_h_end=chunk_h_end,
            map_width=map_width, map_height=map_height, map_seed=map_seed, moisture_seed=moisture_seed, zoom=zoom)

        # return Response(m.elevation, status=status.HTTP_400_BAD_REQUEST)
        return Response(m.data, status=status.HTTP_200_OK)
