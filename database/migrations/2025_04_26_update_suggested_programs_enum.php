<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, create temporary columns
        Schema::table('pending_youth_profiles', function (Blueprint $table) {
            $table->string('suggested_programs_temp')->nullable();
        });

        Schema::table('engagement_data', function (Blueprint $table) {
            $table->string('suggested_programs_temp')->nullable();
        });

        // Copy data to temporary columns
        DB::statement("UPDATE pending_youth_profiles SET suggested_programs_temp = suggested_programs");
        DB::statement("UPDATE engagement_data SET suggested_programs_temp = suggested_programs");

        // Drop the string columns
        Schema::table('pending_youth_profiles', function (Blueprint $table) {
            $table->dropColumn('suggested_programs');
        });

        Schema::table('engagement_data', function (Blueprint $table) {
            $table->dropColumn('suggested_programs');
        });

        // Create new enum columns with correct values
        Schema::table('pending_youth_profiles', function (Blueprint $table) {
            $table->enum('suggested_programs', [
                'Committee on Education and Culture',
                'Committee on Environment',
                'Committee on Youth Employment & Livelihood',
                'Committee on Sports, Gender, and Development',
                'Committee on Health',
                'Committee on Social Protection',
                'Committee on Development Projects',
                'Committee on Finance, Ways, and Means'
            ])->nullable();
        });

        Schema::table('engagement_data', function (Blueprint $table) {
            $table->enum('suggested_programs', [
                'Committee on Education and Culture',
                'Committee on Environment',
                'Committee on Youth Employment & Livelihood',
                'Committee on Sports, Gender, and Development',
                'Committee on Health',
                'Committee on Social Protection',
                'Committee on Development Projects',
                'Committee on Finance, Ways, and Means'
            ])->nullable();
        });

        // Map existing data to new enum values if possible
        DB::statement("
            UPDATE pending_youth_profiles 
            SET suggested_programs = CASE
                WHEN suggested_programs_temp LIKE '%education%' OR suggested_programs_temp LIKE '%culture%' 
                    THEN 'Committee on Education and Culture'
                WHEN suggested_programs_temp LIKE '%environment%' 
                    THEN 'Committee on Environment'
                WHEN suggested_programs_temp LIKE '%employment%' OR suggested_programs_temp LIKE '%livelihood%' 
                    THEN 'Committee on Youth Employment & Livelihood'
                WHEN suggested_programs_temp LIKE '%sports%' OR suggested_programs_temp LIKE '%gender%' 
                    THEN 'Committee on Sports, Gender, and Development'
                WHEN suggested_programs_temp LIKE '%health%' 
                    THEN 'Committee on Health'
                WHEN suggested_programs_temp LIKE '%social%' OR suggested_programs_temp LIKE '%protection%' 
                    THEN 'Committee on Social Protection'
                WHEN suggested_programs_temp LIKE '%development%' AND suggested_programs_temp LIKE '%project%' 
                    THEN 'Committee on Development Projects'
                WHEN suggested_programs_temp LIKE '%finance%' OR suggested_programs_temp LIKE '%ways%' OR suggested_programs_temp LIKE '%means%' 
                    THEN 'Committee on Finance, Ways, and Means'
                ELSE NULL
            END
        ");

        DB::statement("
            UPDATE engagement_data 
            SET suggested_programs = CASE
                WHEN suggested_programs_temp LIKE '%education%' OR suggested_programs_temp LIKE '%culture%' 
                    THEN 'Committee on Education and Culture'
                WHEN suggested_programs_temp LIKE '%environment%' 
                    THEN 'Committee on Environment'
                WHEN suggested_programs_temp LIKE '%employment%' OR suggested_programs_temp LIKE '%livelihood%' 
                    THEN 'Committee on Youth Employment & Livelihood'
                WHEN suggested_programs_temp LIKE '%sports%' OR suggested_programs_temp LIKE '%gender%' 
                    THEN 'Committee on Sports, Gender, and Development'
                WHEN suggested_programs_temp LIKE '%health%' 
                    THEN 'Committee on Health'
                WHEN suggested_programs_temp LIKE '%social%' OR suggested_programs_temp LIKE '%protection%' 
                    THEN 'Committee on Social Protection'
                WHEN suggested_programs_temp LIKE '%development%' AND suggested_programs_temp LIKE '%project%' 
                    THEN 'Committee on Development Projects'
                WHEN suggested_programs_temp LIKE '%finance%' OR suggested_programs_temp LIKE '%ways%' OR suggested_programs_temp LIKE '%means%' 
                    THEN 'Committee on Finance, Ways, and Means'
                ELSE NULL
            END
        ");

        // Drop temporary columns
        Schema::table('pending_youth_profiles', function (Blueprint $table) {
            $table->dropColumn('suggested_programs_temp');
        });

        Schema::table('engagement_data', function (Blueprint $table) {
            $table->dropColumn('suggested_programs_temp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First, create temporary columns
        Schema::table('pending_youth_profiles', function (Blueprint $table) {
            $table->string('suggested_programs_temp')->nullable();
        });

        Schema::table('engagement_data', function (Blueprint $table) {
            $table->string('suggested_programs_temp')->nullable();
        });

        // Copy data to temporary columns
        DB::statement("UPDATE pending_youth_profiles SET suggested_programs_temp = suggested_programs");
        DB::statement("UPDATE engagement_data SET suggested_programs_temp = suggested_programs");

        // Drop the enum columns
        Schema::table('pending_youth_profiles', function (Blueprint $table) {
            $table->dropColumn('suggested_programs');
        });

        Schema::table('engagement_data', function (Blueprint $table) {
            $table->dropColumn('suggested_programs');
        });

        // Create new string columns
        Schema::table('pending_youth_profiles', function (Blueprint $table) {
            $table->string('suggested_programs')->nullable();
        });

        Schema::table('engagement_data', function (Blueprint $table) {
            $table->string('suggested_programs')->nullable();
        });

        // Copy data back
        DB::statement("UPDATE pending_youth_profiles SET suggested_programs = suggested_programs_temp");
        DB::statement("UPDATE engagement_data SET suggested_programs = suggested_programs_temp");

        // Drop temporary columns
        Schema::table('pending_youth_profiles', function (Blueprint $table) {
            $table->dropColumn('suggested_programs_temp');
        });

        Schema::table('engagement_data', function (Blueprint $table) {
            $table->dropColumn('suggested_programs_temp');
        });
    }
}; 