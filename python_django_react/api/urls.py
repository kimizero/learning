from django.urls import path
from .views import RoomView, RoomCreateView, GetRoom, JoinRoom, UserInRoom, LeaveRoom, UpdateRoom

urlpatterns = [
    path('room/', RoomView.as_view()),
    path('room/create/', RoomCreateView.as_view()),
    path('room/get/', GetRoom.as_view()),
    path('room/join/', JoinRoom.as_view()),
    path('room/user-in-room/', UserInRoom.as_view()),
    path('room/leave/', LeaveRoom.as_view()),
    path('room/update/', UpdateRoom.as_view()),
]
