<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToProposalsTable extends Migration
{
    public function up(): void
    {
        Schema::table('proposals', function (Blueprint $table) {
            $table->string('location')->nullable()->after('description');
            $table->text('objectives')->nullable()->after('location');
            $table->text('expected_outcomes')->nullable()->after('objectives');
        });
    }

    public function down(): void
    {
        Schema::table('proposals', function (Blueprint $table) {
            $table->dropColumn(['location', 'objectives', 'expected_outcomes']);
        });
    }
} 