<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Proposal;
use App\Models\ProposalCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProposalController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Proposal::class);

        $proposals = Proposal::with(['category', 'submitter:id,first_name,last_name', 'approver:id,first_name,last_name'])
            ->latest()
            ->paginate(10);

        $categories = ProposalCategory::all();

        return Inertia::render('admin/proposals/index', [
            'proposals' => $proposals,
            'categories' => $categories,
        ]);
    }

    public function destroy(Proposal $proposal)
    {
        $this->authorize('delete', $proposal);

        $proposal->delete();

        return back()->with('success', 'Proposal deleted successfully.');
    }

    public function approve(Proposal $proposal)
    {
        $this->authorize('approve', $proposal);

        $proposal->status = 'approved';
        $proposal->approved_by = Auth::id();
        $proposal->save();

        $proposal->load(['category', 'submitter', 'approver']);

        return Inertia::render('proposals/manage/index', [
            'proposals' => Proposal::with(['category', 'submitter', 'approver'])
                ->latest()
                ->paginate(10),
            'categories' => ProposalCategory::all(),
            'success' => 'Proposal approved successfully.'
        ]);
    }

    public function reject(Request $request, Proposal $proposal)
    {
        $this->authorize('reject', $proposal);

        $validated = $request->validate([
            'rejection_reason' => 'required|string'
        ]);

        $proposal->status = 'rejected';
        $proposal->rejection_reason = $validated['rejection_reason'];
        $proposal->approved_by = Auth::id();
        $proposal->save();

        return back()->with('success', 'Proposal rejected successfully.');
    }
} 