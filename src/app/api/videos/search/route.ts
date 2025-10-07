import { NextRequest, NextResponse } from 'next/server';
import { youtubeService } from '@/service/youtube-service';

export async function GET(request: NextRequest) {
    try {
        // Get query parameters from URL
        const searchParams = request.nextUrl.searchParams;
        const keyword = searchParams.get('keyword');
        const searchType = searchParams.get('searchType') || 'keywords';
        const minSubscribers = Number(searchParams.get('minSubscribers')) || 1500;
        const maxSubscribers = Number(searchParams.get('maxSubscribers')) || 10000;
        const minViews = Number(searchParams.get('minViews')) || 10000;

        // Return error if no keyword
        if (!keyword) {
            return NextResponse.json({
                success: false,
                error: 'Please enter a search keyword.'
            }, { status: 400 });
        }

        // Validate searchType
        if (!['channel', 'keywords', 'all'].includes(searchType)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid search type.'
            }, { status: 400 });
        }

        // Call YouTube API
        const videos = await youtubeService.searchByKeyword({
            keyword,
            maxResults: 20,
            searchType: searchType as 'channel' | 'keywords' | 'all',
            minSubscribers,
            maxSubscribers,
            minViews,
        });

        // Success response
        return NextResponse.json({
            success: true,
            data: videos,
            count: videos.length,
        });

    } catch (error) {
        console.error('API Route Error:', error);

        // Check if it's a YouTube API quota error
        if (error instanceof Error && error.message.includes('403')) {
            return NextResponse.json({
                success: false,
                error: 'Today\'s API quota has been exhausted. Please try again tomorrow.'
            }, { status: 403 });
        }

        return NextResponse.json({
            success: false,
            error: 'Failed to fetch videos.'
        }, { status: 500 });
    }
}