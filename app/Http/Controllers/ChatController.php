<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\User;
use App\Repositories\ChatRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use UserStatusChanged;

class ChatController extends Controller
{
    public function __construct(private ChatRepository $chat)
    {
        $this->chat = $chat;
    }

    /**
     * Chat view.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request, ?int $receiverId = null)
    {
        $messages = empty($receiverId) ? [] : $this->chat->getUserMessages((int) $request->user()->id, (int) $receiverId);

        return Inertia::render('Chat/Chat', [
            'messages' => $messages,
            'recentMessages' => $this->chat->getRecentUsersWithMessage($request->user()->id),
            'receiver' => User::find($receiverId),
        ]);
    }
    public function getAllUsers(Request $request)
    {
        $currentUser = $request->user();

        if (!$currentUser) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $users = User::where('id', '!=', $currentUser->id)
            ->select(['id', 'name'])
            ->get()
            ->map(function ($user) {
                return [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    // 'isActive' => $user->last_active_at > now()->subMinutes(5),  // Assuming 5 minutes of inactivity marks user as offline
                ];
            });

        return response()->json($users);
    }

    public function setActiveStatus(Request $request)
    {
        $user = auth()->user();
        $user->is_active = true;
        // $user->save();

        // Broadcast the event
        broadcast(new UserStatusChanged($user));

        return response()->json(['status' => 'success']);
    }
    public function getRecentUsersWithMessage(Request $request)
    {
        $userId = $request->user()->id;
        return User::where('id', '!=', $userId)
            ->with(['latestMessage'])
            ->get()
            ->map(function ($user) {
                return [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'message' => $user->latestMessage ? $user->latestMessage->message : null,
                    'isActive' => $user->last_active_at > now()->subMinutes(5),
                ];
            });
    }

    /**
     * Chat store
     *
     * @return \Inertia\Response
     */
    public function store(Request $request, ?int $receiverId = null)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        if (empty($receiverId)) {
            return;
        }

        try {
            $message = $this->chat->sendMessage([
                'sender_id' => (int) $request->user()->id,
                'receiver_id' => $receiverId,
                'message' => $request->message,
            ]);

            event(new MessageSent($message));

            return Redirect::route('chat.index', $receiverId);
        } catch (\Throwable $th) {
            return Redirect::route('chat.index', $receiverId);
        }
    }
}
