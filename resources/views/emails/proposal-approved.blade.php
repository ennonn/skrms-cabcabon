<!DOCTYPE html>
<html>
<head>
    <title>New Program Matches Your Interests!</title>
</head>
<body>
    <h2>Hello {{ $youth->personalInformation->full_name }}!</h2>

    <p>A new program has been approved that matches your interests:</p>

    <h3>{{ $proposal->title }}</h3>
    <p><strong>Category:</strong> {{ $proposal->category->name }}</p>
    <p><strong>Description:</strong> {{ $proposal->description }}</p>
    <p><strong>Location:</strong> {{ $proposal->location }}</p>
    <p><strong>Implementation Period:</strong> {{ $proposal->implementation_start_date }} to {{ $proposal->implementation_end_date }}</p>

    <p>This program aligns with your suggested programs and interests. We encourage you to get involved!</p>

    <p>Thank you for your continued engagement with our youth programs!</p>
</body>
</html> 