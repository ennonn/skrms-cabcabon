<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Records\PendingYouthProfile;
use App\Models\User;
use Carbon\Carbon;

class YouthProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test user if it doesn't exist
        $user = User::firstOrCreate(
            ['email' => 'sk.cabcabon@gmail.com'],
            [
                'first_name' => 'Test',
                'last_name' => 'User',
                'password' => bcrypt('password'),
                'role' => 'user',
                'is_active' => true,
            ]
        );

        // Create 5 youth profiles
        for ($i = 1; $i <= 5; $i++) {
            PendingYouthProfile::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'data_collection_agreement' => true,
                'form_submitted_at' => now(),
                // Personal Information
                'full_name' => "Test Youth {$i}",
                'address' => "123 Test Street, Barangay {$i}",
                'gender' => $i % 2 == 0 ? 'Male' : 'Female',
                'birthdate' => Carbon::now()->subYears(20)->format('Y-m-d'),
                'age' => 20,
                'email' => 'sk.cabcabon@gmail.com',
                'phone' => '09123456789',
                'civil_status' => 'Single',
                'youth_age_group' => 'Core Youth (18 - 24 years old)',
                'personal_monthly_income' => 5000.00,
                'interests_hobbies' => 'Basketball',
                'suggested_programs' => 'Committee on Sports, Gender, and Development',
                // Family Information
                'mother_name' => "Mother {$i}",
                'father_name' => "Father {$i}",
                'parents_monthly_income' => 15000.00,
                // Engagement Data
                'education_level' => 'College Level',
                'youth_classification' => 'In school Youth',
                'work_status' => 'Unemployed',
                'is_sk_voter' => true,
                'is_registered_national_voter' => true,
                'voted_last_election' => true,
                'assembly_attendance' => 2,
                'assembly_absence_reason' => null,
            ]);
        }

        // Create 5 pending youth profiles with Globe At Home
        for ($i = 1; $i <= 5; $i++) {
            PendingYouthProfile::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'data_collection_agreement' => true,
                'form_submitted_at' => now(),
                // Personal Information
                'full_name' => "Globe At Home Youth {$i}",
                'address' => "123 Globe Street, Barangay {$i}",
                'gender' => $i % 2 == 0 ? 'Male' : 'Female',
                'birthdate' => Carbon::now()->subYears(20)->format('Y-m-d'),
                'age' => 20,
                'email' => 'sk.cabcabon@gmail.com',
                'phone' => '09703917888',
                'civil_status' => 'Single',
                'youth_age_group' => 'Core Youth (18 - 24 years old)',
                'personal_monthly_income' => 5000.00,
                'interests_hobbies' => 'Basketball',
                'suggested_programs' => 'Committee on Sports, Gender, and Development',
                // Family Information
                'mother_name' => "Globe Mother {$i}",
                'father_name' => "Globe Father {$i}",
                'parents_monthly_income' => 15000.00,
                // Engagement Data
                'education_level' => 'College Level',
                'youth_classification' => 'In school Youth',
                'work_status' => 'Unemployed',
                'is_sk_voter' => true,
                'is_registered_national_voter' => true,
                'voted_last_election' => true,
                'assembly_attendance' => 2,
                'assembly_absence_reason' => null,
            ]);
        }
    }
} 