<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, check if user already exists
        $exists = DB::table('users')->where('email', 'admin@mynote.com')->exists();
        
        if (!$exists) {
            DB::statement("
                INSERT INTO users (email, username, password, email_verified_at, is_email_verified, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ", [
                'admin@mynote.com',
                'admin',
                Hash::make('password123'),
                now(),
                true,
                now(),
                now()
            ]);
            
            $this->command->info('Default user created successfully!');
        } else {
            $this->command->info('Default user already exists.');
        }
    }
}
