<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = auth()->user()->notifications()
            ->latest()
            ->paginate(10);

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
        ]);
    }

    public function show($id)
    {
        $notification = auth()->user()->notifications()
            ->findOrFail($id);

        // Mark as read when viewing
        if (!$notification->read_at) {
            $notification->markAsRead();
        }

        return Inertia::render('notifications/show', [
            'notification' => $notification,
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = auth()->user()->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return back()->with('success', 'Notification marked as read.');
    }

    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();

        return back()->with('success', 'All notifications marked as read.');
    }

    public function delete($id)
    {
        $notification = auth()->user()->notifications()
            ->findOrFail($id);

        $notification->delete();

        return back()->with('success', 'Notification deleted.');
    }

    public function deleteAll()
    {
        auth()->user()->notifications()->delete();

        return back()->with('success', 'All notifications deleted.');
    }
} 