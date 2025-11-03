import { useEffect, useState, useRef, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthNavbar from "@/components/utils/AuthNavbar";
import { FEED_QUERY, type FeedResponse, type FeedItemType } from "@/graphql/feed";
import { useLazyQuery } from "@apollo/client/react";
import { renderFeedItem } from '@/components/utils/feedRenderer';

const FeedHome = () => {
  const [getFeed, { data, loading, error, fetchMore }] = useLazyQuery<{ feed: FeedResponse }>(FEED_QUERY);
  const [items, setItems] = useState<FeedItemType[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null | undefined>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
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
    if (data?.feed?.items) {
      setItems(data.feed.items);
      setNextCursor(data.feed.nextCursor);
    }
  }, [data]);

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
      }
    } catch (err) {
      // Handle error
      // eslint-disable-next-line no-console
      console.error('Error loading more:', err);
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
      <AuthNavbar />
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {loading && items.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load feed. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {items.length > 0 && (
            <>
              {items.map(renderFeedItem)}
              
              {/* Infinite Scroll Trigger */}
              <div ref={observerTarget} className="h-20 flex items-center justify-center">
                {loadingMore && (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                )}
                {!nextCursor && !loadingMore && items.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    You&lsquo;ve reached the end
                  </p>
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