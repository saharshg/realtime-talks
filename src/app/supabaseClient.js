import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    'https://kdcbkhlccgdinheopcxx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkY2JraGxjY2dkaW5oZW9wY3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3OTE0MjYsImV4cCI6MjAwMTM2NzQyNn0.s3-7yoJGGRn_6OfP7DIfKBq6oaXFyp2foBW5kHqX0sA'
);