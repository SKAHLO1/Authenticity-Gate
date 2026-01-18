import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, ArrowRight, TrendingUp } from "lucide-react";

export default function Blog() {
    const featuredPost = {
        title: "The State of AI Detection in 2025: Why Centralization Failed",
        excerpt: "Traditional AI detectors have hit a ceiling. With false positive rates climbing and proprietary models remaining opaque, the industry is shifting towards consensus-based verification protocols.",
        date: "Jan 15, 2025",
        author: "Dr. Elena Rostova",
        role: "CEO",
        category: "Industry Analysis",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800&h=400"
    };

    const posts = [
        {
            title: "Introducing GenLayer Intelligent Consensus v2.0",
            excerpt: "Our latest protocol upgrade brings 3x faster verification speeds and reduced gas costs. Here is deep dive into the technical architecture.",
            date: "Jan 08, 2025",
            author: "James Chen",
            category: "Product Update",
            readTime: "5 min read"
        },
        {
            title: "How Deepfakes Are Impacting Global Elections",
            excerpt: "A data-driven analysis of synthetic media campaigns observed in recent election cycles across Europe and Asia.",
            date: "Dec 22, 2024",
            author: "Sarah Williams",
            category: "Research",
            readTime: "12 min read"
        },
        {
            title: "Tutorial: Integrating Content Verification into Your CMS",
            excerpt: "Learn how to automatically scan every article published on your WordPress or Ghost site using our new API webhook integrations.",
            date: "Dec 10, 2024",
            author: "Michael Ross",
            category: "Tutorial",
            readTime: "6 min read"
        },
        {
            title: "Understanding the 'Trust Score' Methodology",
            excerpt: "Transparency is key. We explain exactly how our weighted algorithms calculate the final authenticity score for any given piece of content.",
            date: "Nov 28, 2024",
            author: "Dr. Elena Rostova",
            category: "Education",
            readTime: "7 min read"
        },
        {
            title: "Partnership Announcement: Reuters x AuthenticityVerifier",
            excerpt: "We are thrilled to announce our strategic partnership with Reuters to pilot blockchain-based provenance for news photography.",
            date: "Nov 15, 2024",
            author: "Press Team",
            category: "Announcements",
            readTime: "3 min read"
        }
    ];

    return (
        <Layout>
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Latest Insights</h1>
                        <p className="text-xl text-muted-foreground">Thoughts on AI, cryptography, and the future of truth.</p>
                    </div>

                    {/* Featured Post */}
                    <div className="mb-16">
                        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Featured Article
                        </h2>
                        <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors group cursor-pointer">
                            <div className="grid md:grid-cols-2 gap-0">
                                <div className="h-64 md:h-auto bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <img
                                        src={featuredPost.image}
                                        alt="Featured post cover"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <Badge className="absolute top-6 left-6 z-20 bg-primary text-primary-foreground">{featuredPost.category}</Badge>
                                </div>
                                <div className="p-8 md:p-12 flex flex-col justify-center bg-card/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {featuredPost.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                        <span>{featuredPost.readTime}</span>
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">
                                        {featuredPost.title}
                                    </h3>
                                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {featuredPost.author.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{featuredPost.author}</p>
                                            <p className="text-xs text-muted-foreground">{featuredPost.role}</p>
                                        </div>
                                        <Button variant="ghost" className="ml-auto group-hover:translate-x-1 transition-transform">
                                            Read Article <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Posts Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, i) => (
                            <Card key={i} className="flex flex-col p-6 hover:border-primary/50 transition-colors group cursor-pointer h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <Badge variant="outline" className="text-xs">{post.category}</Badge>
                                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">{post.author}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{post.date}</span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Newsletter Section */}
                    <div className="mt-20 bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10 text-center">
                        <h2 className="text-3xl font-bold mb-4">Stay ahead of the curve</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                            Get the latest research, product updates, and industry insights delivered directly to your inbox. No spam, ever.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <Input placeholder="Enter your email address" className="bg-background h-12" />
                            <Button className="h-12 px-8">Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
