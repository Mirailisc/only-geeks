import type { FeedAchievementType, FeedBlogType, FeedItemType, FeedProjectType } from "@/graphql/feed";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AwardIcon, CalendarIcon, ExternalLinkIcon, FileTextIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export const getInitialName = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`; // up to 7 days
  if (diff < 2419200) return `${Math.floor(diff / 604800)}w ago`; // up to 4 weeks
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

const RenderFeedProject = ({item}: {item: FeedProjectType}) => {
  const user = item.User;
  if (!user) return null;

  return (
    <Card key={item.id} className="mb-4">
      <CardContent>
        {/* User Info */}
        <div className="flex items-start justify-between mb-4">
          <Link to={`/user/${user.username}`}>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.picture} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{getInitialName(user.firstName || '', user.lastName || '')}</AvatarFallback>
              </Avatar>
              <div>
              <p className="font-semibold text-sm">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>
            </div>
          </Link>
          <Badge variant="secondary" className="gap-1">
            <FileTextIcon className="h-3 w-3" />
            Project
          </Badge>
        </div>

        {/* Project Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold">{item.title}</h3>
          {item.description && (
            <p className="text-muted-foreground">{item.description}</p>
          )}

          {/* Project Images */}
          {item.photos && item.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
              {item.photos.slice(0, 4).map((photo, idx) => (
                <img
                key={idx}
                src={photo}
                alt={`Project ${idx + 1}`}
                className="w-full h-48 object-cover"
                />
              ))}
            </div>
          )}

          {/* Project Details */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {item.startDate && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>
              {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
              </span>
            </div>
            )}
            {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              <span>View Project</span>
            </a>
            )}
          </div>
        </div>

        {/* <Separator className="my-4" /> */}

        {/* Action Buttons */}
        {/* <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Heart className="h-4 w-4 mr-1" />
          Like
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          Comment
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        </div> */}
      </CardContent>
    </Card>
  );
}

const RenderFeedBlog = ({item}: {item: FeedBlogType}) => {
  const user = item.User;
  if (!user) return null;

  return (
    <Card key={item.id} className="mb-4">
      <CardContent>
        {/* User Info */}
        <div className="flex items-start justify-between mb-4">
          <Link to={`/user/${user.username}`}>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.picture} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{getInitialName(user.firstName || '', user.lastName || '')}</AvatarFallback>
              </Avatar>
              <div>
              <p className="font-semibold text-sm">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                @{user.username} · {item.createdAt && formatDate(item.createdAt)}
              </p>
              </div>
            </div>
          </Link>
          <Badge variant="secondary" className="gap-1">
            <FileTextIcon className="h-3 w-3" />
            Blog
          </Badge>
        </div>

        {/* Blog Content */}
        <div className="space-y-3">
          {item.thumbnail && (
            <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-64 object-cover rounded-lg"
            />
          )}
          <h3 className="text-xl font-bold">{item.title}</h3>
          {item.description && (
            <p className="text-muted-foreground line-clamp-3">{item.description}</p>
          )}
          {item.slug && (
            <Button variant="link" className="p-0 h-auto" asChild>
            <Link to={`/blog/${item.User.username}/${item.slug}`}>
              Read more
              <ExternalLinkIcon className="h-3 w-3 ml-1" />
            </Link>
            </Button>
          )}
        </div>

        {/* <Separator className="my-4" /> */}

        {/* Action Buttons */}
        {/* <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Heart className="h-4 w-4 mr-1" />
          Like
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          Comment
        </Button>
        <Button variant="ghost" size="sm">
          <Bookmark className="h-4 w-4 mr-1" />
          Save
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        </div> */}
      </CardContent>
    </Card>
  );
  };

const RenderFeedAchievement = ({item}: {item: FeedAchievementType}) => {
  const user = item.User;
  if (!user) return null;

  return (
    <Card key={item.id} className="mb-4">
      <CardContent>
        {/* User Info */}
        <div className="flex items-start justify-between mb-4">
          <Link to={`/user/${user.username}`}>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.picture} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{getInitialName(user.firstName || '', user.lastName || '')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{user.username} · {item.createdAt && formatDate(item.createdAt)}
                </p>
              </div>
            </div>
          </Link>
          <Badge variant="secondary" className="gap-1">
            <AwardIcon className="h-3 w-3" />
            Achievement
          </Badge>
        </div>

        {/* Achievement Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold">{item.title}</h3>
          {item.description && (
            <p className="text-muted-foreground">{item.description}</p>
          )}

          {/* Achievement Images */}
          {item.photos && item.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
            {item.photos.slice(0, 4).map((photo, idx) => (
              <img
              key={idx}
              src={photo}
              alt={`Achievement ${idx + 1}`}
              className="w-full h-48 object-cover"
              />
            ))}
            </div>
          )}

          {/* Achievement Details */}
          <div className="flex flex-wrap gap-4 text-sm">
            {item.issuer && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <AwardIcon className="h-4 w-4" />
              <span>Issued by {item.issuer}</span>
            </div>
            )}
            {item.date && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            )}
          </div>
        </div>

        {/* <Separator className="my-4" /> */}

        {/* Action Buttons */}
        {/* <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Heart className="h-4 w-4 mr-1" />
          Congratulate
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          Comment
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        </div> */}
      </CardContent>
    </Card>
  );
}

export const RenderFeedItem = (item: FeedItemType) => {
  if (item.contentType === "project") {
    return <RenderFeedProject item={item as FeedProjectType} />;
  } else if (item.contentType === "blog") {
    return <RenderFeedBlog item={item as FeedBlogType} />;
  } else if (item.contentType === "achievement") {
    return <RenderFeedAchievement item={item as FeedAchievementType} />;
  }
  return null;
}