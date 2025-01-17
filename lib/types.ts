export interface RedditPost {
  data: {
    title: string;
    permalink: string;
    url: string;
    created_utc: number;
    author: string;
    subreddit: string;
  }
}

export interface RedditResponse {
  data: {
    children: RedditPost[];
  }
}

