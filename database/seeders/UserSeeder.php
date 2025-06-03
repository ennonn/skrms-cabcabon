<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create superadmin
        User::create([
            'first_name' => 'Sanguiang Kabataan',
            'last_name' => 'Brgy. Cabcabon',
            'email' => 'sk.cabcabok@gmail.com',
            'password' => Hash::make('Qwert1234+'),
            'email_verified_at' => now(),
            'role' => 'superadmin',
            'is_active' => true,
            'birthdate' => now()->subYears(25),
            'phone_number' => '09123456789',
        ]);

        // Create admins
        User::create([
            'first_name' => 'Kris',
            'last_name' => 'Sanchez',
            'email' => 'sanchez.kris@gmail.com',
            'password' => Hash::make('Qwert1234+'),
            'email_verified_at' => now(),
            'role' => 'admin',
            'is_active' => true,
            'birthdate' => now()->subYears(23),
            'phone_number' => '09123456788',
        ]);

        User::create([
            'first_name' => 'Admin',
            'last_name' => 'Cabcabon',
            'email' => 'admin.cabcabon.@test.com',
            'password' => Hash::make('Qwert1234+'),
            'email_verified_at' => now(),
            'role' => 'admin',
            'is_active' => true,
            'birthdate' => now()->subYears(24),
            'phone_number' => '09123456787',
        ]);

        // Create regular users
        $users = [
            [
                'first_name' => 'Joko',
                'last_name' => 'Sako',
                'email' => 'jokosaco@gmail.com',
            ],
            [
                'first_name' => 'Milquicekets',
                'last_name' => 'Juegos',
                'email' => 'juegos.milquicekets@yahoo.com',
            ],
            [
                'first_name' => 'Rayan',
                'last_name' => 'Canete',
                'email' => 'canete.rayan99@gmail.com',
            ],
            [
                'first_name' => 'Lowella',
                'last_name' => 'Florida',
                'email' => 'florida.lowella@gmail.com',
            ],
            [
                'first_name' => 'Eliott',
                'last_name' => 'Jaojao',
                'email' => 'jaojao.eliott444.@gmail.com',
            ],
            [
                'first_name' => 'Kim Benjie',
                'last_name' => 'Balasico',
                'email' => 'balasico.kim123@gmail.com',
            ],
            [
                'first_name' => 'Kristine',
                'last_name' => 'Federicos',
                'email' => 'federicos.kristine03@gmail.com',
            ],
            [
                'first_name' => 'Kym Zaire',
                'last_name' => 'Jaojao',
                'email' => 'jaojao.kymzairt@gmail.com',
            ],
            [
                'first_name' => 'Nemuel',
                'last_name' => 'Cabilogan',
                'email' => 'cabilogan.nemuel@gmail.com',
            ],
            [
                'first_name' => 'User',
                'last_name' => 'Cabcabon',
                'email' => 'user.cabcabon@test.com',
            ],
            [
                'first_name' => 'Inactive',
                'last_name' => 'Cabcabon',
                'email' => 'inactive.user.cabcabon@test.com',
                'is_active' => false,
            ],
            [
                'first_name' => 'Verified',
                'last_name' => 'Email',
                'email' => 'is.verified.email@test.com',
            ],
        ];

        foreach ($users as $userData) {
            User::create(array_merge([
                'password' => Hash::make('Qwert1234+'),
                'email_verified_at' => now(),
                'role' => 'user',
                'is_active' => $userData['is_active'] ?? true,
                'birthdate' => now()->subYears(rand(18, 30)),
                'phone_number' => '09' . rand(100000000, 999999999),
            ], $userData));
        }
    }
} 