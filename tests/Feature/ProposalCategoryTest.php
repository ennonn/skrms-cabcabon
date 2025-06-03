<?php

use App\Models\ProposalCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create a test user
    $this->user = User::factory()->create([
        'role' => 'admin'
    ]);
});

test('can get all active proposal categories', function () {
    // Create some test categories
    $activeCategory = ProposalCategory::create([
        'name' => 'Test Category 1',
        'description' => 'Test Description 1',
        'is_active' => true
    ]);

    $inactiveCategory = ProposalCategory::create([
        'name' => 'Test Category 2',
        'description' => 'Test Description 2',
        'is_active' => false
    ]);

    // Get active categories
    $activeCategories = ProposalCategory::where('is_active', true)->get();

    // Assertions
    expect($activeCategories)->toHaveCount(1)
        ->and($activeCategories->first()->name)->toBe('Test Category 1')
        ->and($activeCategories->first()->is_active)->toBeTrue();
});

test('can create a new proposal category', function () {
    $categoryData = [
        'name' => 'New Category',
        'description' => 'New Description',
        'is_active' => true
    ];

    $category = ProposalCategory::create($categoryData);

    expect($category)->toBeInstanceOf(ProposalCategory::class)
        ->and($category->name)->toBe('New Category')
        ->and($category->description)->toBe('New Description')
        ->and($category->is_active)->toBeTrue();
});

test('can update a proposal category', function () {
    $category = ProposalCategory::create([
        'name' => 'Original Name',
        'description' => 'Original Description',
        'is_active' => true
    ]);

    $category->update([
        'name' => 'Updated Name',
        'description' => 'Updated Description',
        'is_active' => false
    ]);

    $category->refresh();

    expect($category->name)->toBe('Updated Name')
        ->and($category->description)->toBe('Updated Description')
        ->and($category->is_active)->toBeFalse();
});

test('can delete a proposal category', function () {
    $category = ProposalCategory::create([
        'name' => 'To Delete',
        'description' => 'Will be deleted',
        'is_active' => true
    ]);

    $categoryId = $category->id;
    $category->delete();

    expect(ProposalCategory::find($categoryId))->toBeNull();
});

test('default categories are available after seeding', function () {
    // Run the seeder
    $this->artisan('db:seed', ['--class' => 'ProposalCategorySeeder']);

    $defaultCategories = [
        'Skills & Capacity Building',
        'Community Development & Environment',
        'Social Transformation',
        'Sports & Recreation',
        'Health & Wellness',
        'Education Support',
        'Advocacy & Governance'
    ];

    $categories = ProposalCategory::all();

    expect($categories)->toHaveCount(count($defaultCategories));

    foreach ($defaultCategories as $categoryName) {
        expect($categories->contains('name', $categoryName))->toBeTrue();
    }
});

test('category has many proposals relationship', function () {
    $category = ProposalCategory::create([
        'name' => 'Test Category',
        'description' => 'Test Description',
        'is_active' => true
    ]);

    // Create some test proposals
    $category->proposals()->createMany([
        [
            'title' => 'Proposal 1',
            'description' => 'Description 1',
            'estimated_cost' => 1000,
            'frequency' => 'Monthly',
            'funding_source' => 'Test Source',
            'people_involved' => 'Test People',
            'status' => 'draft',
            'submitted_by' => $this->user->id
        ],
        [
            'title' => 'Proposal 2',
            'description' => 'Description 2',
            'estimated_cost' => 2000,
            'frequency' => 'Quarterly',
            'funding_source' => 'Test Source',
            'people_involved' => 'Test People',
            'status' => 'draft',
            'submitted_by' => $this->user->id
        ]
    ]);

    expect($category->proposals)->toHaveCount(2)
        ->and($category->proposals->first()->title)->toBe('Proposal 1')
        ->and($category->proposals->last()->title)->toBe('Proposal 2');
});

test('category name is required', function () {
    expect(fn() => ProposalCategory::create([
        'description' => 'Test Description',
        'is_active' => true
    ]))->toThrow(\Illuminate\Database\QueryException::class);
});

test('category is_active defaults to true', function () {
    $category = ProposalCategory::create([
        'name' => 'Test Category',
        'description' => 'Test Description'
    ]);

    expect($category->is_active)->toBeTrue();
}); 