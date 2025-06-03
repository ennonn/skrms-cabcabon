<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RejectedProposalController extends Controller
{
    public function index()
    {
        $proposals = Proposal::with(['category', 'submitter'])
            ->where('status', 'rejected')
            ->latest()
            ->paginate(10);

        return Inertia::render('proposals/rejected/index', [
            'proposals' => $proposals,
        ]);
    }

    public function show(Proposal $proposal)
    {
        $proposal->load(['category', 'submitter', 'approver']);

        return Inertia::render('proposals/rejected/show', [
            'proposal' => $proposal,
        ]);
    }

    public function edit(Proposal $proposal)
    {
        $proposal->load(['category']);

        return Inertia::render('proposals/rejected/edit', [
            'proposal' => $proposal,
        ]);
    }

    public function update(Request $request, Proposal $proposal)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:proposal_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'estimated_cost' => 'required|numeric|min:0',
            'frequency' => 'required|string|max:255',
            'funding_resource' => 'required|string|max:255',
            'people_involved' => 'required|string',
        ]);

        $proposal->update([
            ...$validated,
            'status' => 'pending',
            'rejection_reason' => null,
        ]);

        return redirect()->route('proposals.pending.index')
            ->with('success', 'Proposal resubmitted successfully.');
    }

    public function destroy(Proposal $proposal)
    {
        $proposal->delete();

        return redirect()->route('proposals.rejected.index')
            ->with('success', 'Proposal deleted successfully.');
    }
} 