<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the old table if it exists
        Schema::dropIfExists('youth_profiles');
        
        // Create youth_profile_records table (for approved profiles)
        Schema::create('youth_profile_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('approver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('approval_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Create personal_information table
        Schema::create('personal_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('youth_profile_record_id')->constrained()->onDelete('cascade');
            $table->timestamp('form_submitted_at')->nullable();
            $table->text('data_collection_agreement')->nullable();
            $table->string('full_name');
            $table->string('address');
            $table->enum('gender', ['Male', 'Female']);
            $table->unsignedTinyInteger('age');
            $table->date('birthdate');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->enum('civil_status', [
                'Single',
                'Married',
                'Widowed',
                'Divorced',
                'Separated',
                'Annulled',
                'Live-in',
                'Unknown',
                'Unkown'
            ]);
            $table->enum('youth_age_group', [
                'Child Youth (15 - 17 years old)',
                'Core Youth (18 - 24 years old)',
                'Young Adult (25 - 30 years old)'
            ]);
            $table->decimal('personal_monthly_income', 10, 2)->nullable();
            $table->string('interests_hobbies')->nullable();
            $table->string('suggested_programs')->nullable();
            $table->timestamps();
        });

        // Create family_information table
        Schema::create('family_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('youth_profile_record_id')->constrained()->onDelete('cascade');
            $table->string('mother_name')->nullable();
            $table->string('father_name')->nullable();
            $table->decimal('parents_monthly_income', 10, 2)->nullable();
            $table->timestamps();
        });

        // Create engagement_data table
        Schema::create('engagement_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('youth_profile_record_id')->constrained()->onDelete('cascade');
            $table->enum('education_level', [
                'Elementary Level',
                'Elementary Graduate',
                'High School Level',
                'High School Graduate',
                'Vocational Graduate',
                'College Level',
                'College Graduate',
                'Masters Level',
                'Masters Graduate',
                'Doctorate Level',
                'Doctorate Graduate'
            ]);
            $table->enum('youth_classification', [
                'In school Youth',
                'Out of School Youth',
                'Working Youth',
                'PWD',
                'Children in conflict with the law',
                'Indigenous People'
            ]);
            $table->enum('work_status', [
                'Employed',
                'Unemployed',
                'Self-employed',
                'Currently Looking for a Job',
                'Not interested in looking for a job'
            ]);
            $table->boolean('is_sk_voter')->default(false);
            $table->boolean('is_registered_national_voter')->default(false);
            $table->boolean('voted_last_election')->default(false);
            $table->boolean('has_attended_assembly')->default(false);
            $table->integer('assembly_attendance')->nullable();
            $table->string('assembly_absence_reason')->nullable();
            $table->string('suggested_programs')->nullable();
            $table->timestamps();
        });

        // Create pending_youth_profiles table
        Schema::create('pending_youth_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('approver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('approval_notes')->nullable();
            
            // Form Metadata
            $table->timestamp('form_submitted_at')->nullable(); // COL$A
            $table->text('data_collection_agreement')->nullable(); // COL$B
            
            // Personal Information
            $table->string('full_name'); // COL$C
            $table->string('address'); // COL$D
            $table->enum('gender', ['Male', 'Female']); // COL$E
            $table->unsignedTinyInteger('age'); // COL$F
            $table->date('birthdate'); // COL$G
            $table->string('email')->nullable(); // COL$H
            $table->string('phone')->nullable(); // COL$I
            $table->enum('civil_status', [
                'Single',
                'Married',
                'Widowed',
                'Divorced',
                'Separated',
                'Annulled',
                'Live-in',
                'Unknown',
                'Unkown'
            ]); // COL$J
            $table->enum('youth_age_group', [
                'Child Youth (15 - 17 years old)',
                'Core Youth (18 - 24 years old)',
                'Young Adult (25 - 30 years old)'
            ]); // COL$K
            
            // Education and Work
            $table->enum('education_level', [
                'Elementary Level',
                'Elementary Graduate',
                'High School Level',
                'High School Graduate',
                'Vocational Graduate',
                'College Level',
                'College Graduate',
                'Masters Level',
                'Masters Graduate',
                'Doctorate Level',
                'Doctorate Graduate'
            ]); // COL$L
            $table->enum('youth_classification', [
                'In school Youth',
                'Out of School Youth',
                'Working Youth',
                'PWD',
                'Children in conflict with the law',
                'Indigenous People'
            ]); // COL$M
            $table->enum('work_status', [
                'Employed',
                'Unemployed',
                'Self-employed',
                'Currently Looking for a Job',
                'Not interested in looking for a job'
            ]); // COL$N
            
            // Voter Information
            $table->boolean('is_sk_voter')->default(false); // COL$O
            $table->boolean('is_registered_national_voter')->default(false); // COL$P
            $table->boolean('voted_last_election')->default(false); // COL$Q
            
            // Assembly Participation
            $table->boolean('has_attended_assembly')->default(false); // COL$R
            $table->integer('assembly_attendance')->nullable(); // COL$S
            $table->string('assembly_absence_reason')->nullable(); // COL$T
            
            // Family Information
            $table->string('mother_name')->nullable(); // COL$U
            $table->string('father_name')->nullable(); // COL$V
            $table->decimal('parents_monthly_income', 10, 2)->nullable(); // COL$W
            $table->decimal('personal_monthly_income', 10, 2)->nullable(); // COL$X
            
            // Interests and Programs
            $table->string('suggested_programs')->nullable(); // COL$Y
            $table->string('interests_hobbies')->nullable(); // COL$Z
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engagement_data');
        Schema::dropIfExists('family_information');
        Schema::dropIfExists('personal_information');
        Schema::dropIfExists('youth_profile_records');
        Schema::dropIfExists('pending_youth_profiles');
    }
};
