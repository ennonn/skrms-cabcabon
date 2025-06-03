<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PendingProposalController extends Controller
{
    public function index()
    {
        $proposals = Proposal::with(['category', 'submitter'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(10);

        return Inertia::render('proposals/pending/index', [
            'proposals' => $proposals,
        ]);
    }

    public function show(Proposal $proposal)
    {
        $proposal->load(['category', 'submitter']);

        return Inertia::render('proposals/pending/show', [
            'proposal' => $proposal,
        ]);
    }

    public function approve(Proposal $proposal)
    {
        $proposal->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
        ]);

        return redirect()->route('proposals.pending.index')
            ->with('success', 'Proposal approved successfully.');
    }

    public function reject(Request $request, Proposal $proposal)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $proposal->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return redirect()->route('proposals.pending.index')
            ->with('success', 'Proposal rejected successfully.');
    }
} 