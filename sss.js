const express = require('express');
const axios = require('axios');
const app = express();

const YOUTUBE_API_KEY = 'AIzaSyDHkWAnldAFnwvJjUQGfq5QwdYceMuv__c';
const GOOGLE_API_KEY = 'AIzaSyD2cYVccGnK_A6mGqUKtMGmmgr6VBXb4EQ';
const CUSTOM_SEARCH_ENGINE_ID = 'f466ff065482544f1';
// Function to fetch YouTube videos
const getYouTubeVideos = async (searchTerm) => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&key=${YOUTUBE_API_KEY}`;
    const response = await axios.get(url);
    const videos = response.data.items || [];
    return videos.map(video => ({
        title: video.snippet.title,
        views: 1000, // Placeholder for view count (YouTube API v3 requires extra request for this)
        likes: 100,  // Placeholder for likes
        link: `https://www.youtube.com/watch?v=${video.id.videoId}`
    }));
};

// Function to fetch Google search results
const getGoogleResults = async (searchTerm) => {
    const url = `https://www.googleapis.com/customsearch/v1?q=${searchTerm}&key=${GOOGLE_API_KEY}&cx=${CUSTOM_SEARCH_ENGINE_ID}`;
    const response = await axios.get(url);
    const articles = response.data.items || [];
    return articles.map(article => ({
        title: article.title,
        link: article.link
    }));
};

// Function to fetch academic papers (Google Scholar)
const getAcademicPapers = async (searchTerm) => {
    // Placeholder for Google Scholar or PubMed integration
    return [{
        title: `Research on ${searchTerm}`,
        link: 'https://scholar.google.com'
    }];
};

// Search route
app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    
    try {
        const youtubeResults = await getYouTubeVideos(searchTerm);
        const googleResults = await getGoogleResults(searchTerm);
        const papers = await getAcademicPapers(searchTerm);
        
        const rankedResults = [...youtubeResults, ...googleResults, ...papers];
        res.json(rankedResults);
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
