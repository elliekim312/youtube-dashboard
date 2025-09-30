import { NextRequest, NextResponse } from 'next/server';
import { youtubeService } from '@/service/youtube-service';

export async function GET(request: NextRequest) {
    try {
        // Get query parameters from URL
        const searchParams = request.nextUrl.searchParams;
        const keyword = searchParams.get('keyword');

        // Return error if no keyword
        if (!keyword) {
            return NextResponse.json({ 
                success: false, 
                error: 'Please enter a search keyword.' 
            }, { status: 400 });
        }

        // Call YouTube API
        const videos = await youtubeService.searchByKeyword({
            keyword,
            maxResults: 20,
        });

        // Success response
        return NextResponse.json({
            success: true,
            data: videos,
            count: videos.length,
        });

    } catch (error) {
        console.error('API Route Error:', error);
        
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch videos.' 
        }, { status: 500 });
    }
}