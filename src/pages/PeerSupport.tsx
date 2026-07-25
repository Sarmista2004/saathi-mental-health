import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MessageCircle, Heart, Plus, Search, Filter, ThumbsUp, MessageSquare, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reply {
  id: number;
  content: string;
  author: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  likes: number;
  is_anonymous: boolean;
  author: string;
  created_at: string;
  replyList?: Reply[];
}

// Turns a timestamp into "2 hours ago", "Just now", etc.
const timeAgo = (dateString: string) => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const PeerSupport = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPostIds, setLikedPostIds] = useState<Set<number>>(new Set());
  const [likingPostId, setLikingPostId] = useState<number | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    isAnonymous: true
  });
  const { toast } = useToast();

  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const categories = [
    "Academic Stress",
    "Anxiety",
    "Depression",
    "Social Connection",
    "Homesickness",
    "Self-Doubt",
    "Relationship Issues",
    "Financial Stress",
    "Future Worries",
    "Other"
  ];

  // --- Load posts (and their replies) from Supabase on mount ---
  const loadPosts = async () => {
    setLoading(true);

    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    if (postsError) {
      toast({
        title: "Couldn't load posts",
        description: postsError.message,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    const { data: repliesData, error: repliesError } = await supabase
      .from("replies")
      .select("*")
      .order("id", { ascending: true });

    if (repliesError) {
      toast({
        title: "Couldn't load replies",
        description: repliesError.message,
        variant: "destructive"
      });
    }

    const postsWithReplies: Post[] = (postsData || []).map((post) => ({
      ...post,
      replyList: (repliesData || []).filter((r) => r.post_id === post.id)
    }));

    setPosts(postsWithReplies);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
    // Restore which posts this browser has already liked, so refreshing
    // doesn't let someone like the same post infinitely.
    const stored = localStorage.getItem("likedPosts");
    if (stored) {
      try {
        setLikedPostIds(new Set(JSON.parse(stored)));
      } catch {}
    }
  }, []);

  // --- Like / unlike a post ---
  
  const handleLike = async (postId: number) => {
    if (likingPostId === postId) return;
    setLikingPostId(postId);

    const alreadyLiked = likedPostIds.has(postId);

    const { data: currentPost, error: fetchError } = await supabase
      .from("posts")
      .select("likes")
      .eq("id", postId)
      .single();

    if (fetchError || !currentPost) {
      toast({ title: "Couldn't update like", description: fetchError?.message, variant: "destructive" });
      setLikingPostId(null);
      return;
    }

    const newLikes = Math.max(0, alreadyLiked ? currentPost.likes - 1 : currentPost.likes + 1);

    const { error } = await supabase
      .from("posts")
      .update({ likes: newLikes })
      .eq("id", postId);

    if (error) {
      toast({ title: "Couldn't update like", description: error.message, variant: "destructive" });
      setLikingPostId(null);
      return;
    }

    setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: newLikes } : p)));

    const updatedLiked = new Set(likedPostIds);
    if (alreadyLiked) updatedLiked.delete(postId);
    else updatedLiked.add(postId);
    setLikedPostIds(updatedLiked);
    localStorage.setItem("likedPosts", JSON.stringify(Array.from(updatedLiked)));
    setLikingPostId(null);
  };

  // --- Submit a reply ---
  const handleReplySubmit = async (postId: number) => {
    const content = replyContent[postId]?.trim();
    if (!content) return;

    const { data, error } = await supabase
      .from("replies")
      .insert({ post_id: postId, content, author: "You" })
      .select()
      .single();

    if (error) {
      toast({ title: "Couldn't post reply", description: error.message, variant: "destructive" });
      return;
    }

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, replyList: [...(post.replyList || []), data] }
          : post
      )
    );

    setReplyContent({ ...replyContent, [postId]: "" });
    setReplyingTo(null);
  };

  // --- Submit a new post ---
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category) {
      toast({
        title: "Please fill in all fields",
        description: "Title, content, and category are required to post.",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        likes: 0,
        is_anonymous: newPost.isAnonymous,
        author: newPost.isAnonymous ? "Anonymous Student" : "You"
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Couldn't share post", description: error.message, variant: "destructive" });
      return;
    }

    setPosts([{ ...data, replyList: [] }, ...posts]);
    setNewPost({ title: "", content: "", category: "", isAnonymous: true });
    setShowNewPostForm(false);

    toast({
      title: "Post shared successfully!",
      description: "Your post is now visible to the community. Thank you for sharing."
    });
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Academic Stress": "bg-blue-100 text-blue-700",
      "Anxiety": "bg-red-100 text-red-700",
      "Depression": "bg-purple-100 text-purple-700",
      "Social Connection": "bg-pink-100 text-pink-700",
      "Homesickness": "bg-green-100 text-green-700",
      "Self-Doubt": "bg-yellow-100 text-yellow-700",
      "Relationship Issues": "bg-orange-100 text-orange-700",
      "Financial Stress": "bg-gray-100 text-gray-700",
      "Future Worries": "bg-indigo-100 text-indigo-700",
      "Other": "bg-slate-100 text-slate-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-calm py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Peer Support Forum</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with fellow students in a safe, anonymous space. Share your experiences, offer support, and know that you're not alone.
          </p>
        </div>

        {/* Community Guidelines */}
        <Card className="mb-8 bg-soft-green border-secondary">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-secondary mt-1" />
              <div>
                <h3 className="font-semibold text-secondary mb-2">Community Guidelines</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Be kind, respectful, and supportive to all community members</p>
                  <p>• Share experiences honestly but respect privacy (yours and others')</p>
                  <p>• No judgment zone - everyone's struggles are valid</p>
                  <p>• If you're in crisis, please seek immediate professional help</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* New Post Button & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowNewPostForm(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Share Your Story
          </Button>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <Card className="mb-8 card-calm">
            <form onSubmit={handleSubmitPost} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Share with the community</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewPostForm(false)}
                >
                  Cancel
                </Button>
              </div>

              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="Give your post a title..."
                required
              />

              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Share what's on your mind. Remember, this is a supportive space where your experiences matter..."
                rows={4}
                required
              />

              <div className="flex items-center gap-4">
                <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newPost.isAnonymous}
                    onChange={(e) => setNewPost({...newPost, isAnonymous: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm text-muted-foreground">
                    Post anonymously
                  </label>
                </div>
              </div>

              <Button type="submit" className="btn-primary">
                <Heart className="w-4 h-4 mr-2" />
                Share Post
              </Button>
            </form>
          </Card>
        )}

        {/* Posts */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading posts...</div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="card-calm hover:shadow-soft transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {post.author} • {timeAgo(post.created_at)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-3">{post.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      disabled={likingPostId === post.id}
                      className={`flex items-center gap-2 ${likedPostIds.has(post.id) ? 'text-accent' : 'text-muted-foreground'}`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${likedPostIds.has(post.id) ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>

                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="w-4 h-4" />
                      {post.replyList?.length || 0} replies
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                    >
                      Reply
                    </Button>
                  </div>

                  {replyingTo === post.id && (
                    <div className="mt-4 space-y-3">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyContent[post.id] || ""}
                        onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                        rows={2}
                      />
                      <Button size="sm" className="btn-primary" onClick={() => handleReplySubmit(post.id)}>
                        Post Reply
                      </Button>
                    </div>
                  )}

                  {post.replyList && post.replyList.length > 0 && (
                    <div className="mt-4 pl-4 border-l space-y-2">
                      {post.replyList.map((reply) => (
                        <div key={reply.id} className="bg-muted p-2 rounded text-sm">
                          <span className="font-medium">{reply.author}</span> • {timeAgo(reply.created_at)}
                          <p>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or be the first to share something!</p>
                <Button onClick={() => setShowNewPostForm(true)} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerSupport;
