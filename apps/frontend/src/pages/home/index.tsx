import { useEffect, useState, useRef, useCallback } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AuthNavbar from "@/components/utils/AuthNavbar";
import { FEED_QUERY, FEED_NEW_COUNT_QUERY, type FeedResponse, type FeedItemType } from "@/graphql/feed";
import { useLazyQuery } from "@apollo/client/react";
import { RenderFeedItem } from '@/components/utils/feedRenderer';
import Meta from '@/components/utils/metadata';

const FeedHome = () => {
  const [getFeed, { data, loading, error, fetchMore }] = useLazyQuery<{ feed: FeedResponse }>(FEED_QUERY);
  const [getNewCount] = useLazyQuery<{ getNewFeedCount: number }>(FEED_NEW_COUNT_QUERY);
  const [items, setItems] = useState<FeedItemType[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null | undefined>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newItemCount, setNewItemCount] = useState(0);
  const [initialLoadTime, setInitialLoadTime] = useState<string | null>(null);
  const observerTarget = useRef(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadFeed = useCallback(() => {
    getFeed({
      variables: {
        input: {
          limit: 10,
          type: "ALL"
        }
      }
    });
  }, [getFeed]);

  useEffect(() => {
    loadFeed();
    // Set initial load time for polling
    setInitialLoadTime(new Date().toISOString().split('T')[0]);
  }, [loadFeed]);

  useEffect(() => {
    if (data?.feed?.items) {
      setItems(data.feed.items);
      setNextCursor(data.feed.nextCursor);
    }
  }, [data]);

  // Polling for new content
  useEffect(() => {
    if (!initialLoadTime) return;

    const checkForNewContent = async () => {
      try {
        const result = await getNewCount({
          variables: {
            input: {
              since: initialLoadTime
            }
          }
        });

        const count = result.data?.getNewFeedCount ?? 0;
        setNewItemCount(count);
        setInitialLoadTime(new Date().toISOString().split('T')[0]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // console.error('Error checking for new content:', err);
      }
    };

    // Initial check
    checkForNewContent();

    // Set up 30-second polling
    pollingIntervalRef.current = setInterval(checkForNewContent, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [initialLoadTime, getNewCount]);

  const handleRefresh = useCallback(() => {
    setNewItemCount(0);
    setInitialLoadTime(new Date().toISOString().split('T')[0]);
    loadFeed();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadFeed]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore || loading) return;

    setLoadingMore(true);
    try {
      const result = await fetchMore({
        variables: {
          input: {
            limit: 10,
            type: "ALL",
            cursor: nextCursor
          }
        }
      });

      const newFeed = result.data?.feed;
      if (newFeed?.items && newFeed.items.length > 0) {
        setItems(prev => [...prev, ...newFeed.items]);
        setNextCursor(newFeed.nextCursor);
      } else {
        setNextCursor(null);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // console.error('Error loading more:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore, loading, fetchMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && nextCursor && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [nextCursor, loadingMore, loadMore]);

  return (
    <>
      <Meta
        title="Home | Only Geeks"
        description="Stay updated with the latest posts from the Only Geeks community."
        keywords="feed, only geeks, latest posts, community"
        image=""
        url={window.location.href}
      />
      <AuthNavbar />
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {/* New Content Alert */}
          {newItemCount > 0 && (
            <Alert className="mb-4 border-primary bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <AlertDescription className="flex items-center justify-between">
                  <span>
                    {newItemCount} new {newItemCount === 1 ? 'post' : 'posts'} available
                  </span>
                  <Button 
                    size="sm" 
                    onClick={handleRefresh}
                    className="ml-4"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Load new posts
                  </Button>
                </AlertDescription>
              </div>
            </Alert>
          )}

          {loading && items.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <div className="flex-1">
                <AlertDescription>
                  Failed to load feed. Please try again later.
                </AlertDescription>
              </div>
            </Alert>
          )}

          {items.length > 0 && (
            <>
              {items.map((i) => {
                return <RenderFeedItem {...i} key={"feed"+ i.id} />
              })}
              
              {/* Infinite Scroll Trigger */}
              <div ref={observerTarget} className="h-20 w-full flex items-center justify-center">
                {loadingMore && (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                )}
                {!nextCursor && !loadingMore && items.length > 0 && (
                  <Card className="p-8 text-center w-full">
                    <p className="text-sm text-muted-foreground">
                      You&lsquo;ve reached the end
                    </p>
                  </Card>
                )}
              </div>
            </>
          )}

          {!loading && !error && items.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default FeedHome;