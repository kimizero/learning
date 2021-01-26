from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from rest_framework import generics, status
from .serializers import RoomSerializer, RoomCreateSerializer, RoomUpdateSerializer
from .models import Room
from django.http import JsonResponse


# Create your views here.


class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request):
        code = request.GET.get(self.lookup_url_kwarg)

        if code is not None:
            rooms = Room.objects.filter(code=code)

            if len(rooms) > 0:
                data = RoomSerializer(rooms[0]).data
                data["is_host"] = self.request.session.session_key == rooms[0].host

                return Response(data, status=status.HTTP_200_OK)

            return Response({"Room not found": "Invalid room code."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"Bad request": "Code parameter not found in request."}, status=status.HTTP_400_BAD_REQUEST)


class RoomCreateView(APIView):
    serializer_class = RoomCreateSerializer

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)

            if len(queryset) > 0:
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.created_at = datetime.now()
                room.save(update_fields=[
                          'guest_can_pause', 'votes_to_skip', 'created_at'])
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()

            self.request.session["room_code"] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({"Bad request": "Invalid data."}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    lookup_url_kwarg = "code"

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)

        if code is not None:
            room_res = Room.objects.filter(code=code)

            if len(room_res) > 0:
                #room = room_res[0]
                self.request.session["room_code"] = code
                return Response({"message": "Room Joined!"}, status.HTTP_200_OK)

            return Response({"Room not found": "Invalid room code."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"Bad request": "Code parameter not found in request."}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            "code": self.request.session.get("room_code")
        }

        return JsonResponse(data=data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request):
        if "room_code" in self.request.session:
            self.request.session.pop("room_code")
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)

            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({"Message": "Quitted the room."}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer_class = RoomUpdateSerializer

    def patch(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            code = serializer.data.get("code")

            queryset = Room.objects.filter(code=code)

            if queryset.exists():
                room = queryset[0]
                user_id = self.request.session.session_key

                if room.host != user_id:
                    return Response({"Message": "You are not the owner of the room."}, status=status.HTTP_400_BAD_REQUEST)

                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

            return Response({"Room not found": "Invalid room code."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"Bad request": "Data non sufficient."}, status=status.HTTP_400_BAD_REQUEST)
