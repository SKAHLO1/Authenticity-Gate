import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useCreateVerification, useVerifications } from "@/hooks/use-verifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Shield, Sparkles, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Home() {
  const [url, setUrl] = useState("");
  const [, setLocation] = useLocation();
  const { mutate: createVerification, isPending } = useCreateVerification();
  const { data: recentVerifications, isLoading } = useVerifications();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    createVerification({ url }, {
      onSuccess: (data) => {
        setLocation(`/verification/${data.id}`);
      }
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Powered by GenLayer AI Consensus</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Verify Content <br />
              <span className="text-gradient">Authenticity On-Chain</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Detect plagiarism, identify deepfakes, and evaluate sentiment with 
              cryptographic proof. The standard for trust in the AI era.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex gap-2 p-2 bg-background/80 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl">
                <div className="flex-1 relative">
                  <Input
                    type="url"
                    placeholder="Paste URL to analyze..."
                    className="w-full h-12 pl-4 bg-transparent border-transparent focus:ring-0 focus:border-transparent text-lg placeholder:text-muted-foreground/50"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="h-12 px-8 rounded-lg text-lg font-medium shadow-lg shadow-primary/20"
                >
                  {isPending ? "Analyzing..." : "Verify"}
                </Button>
              </div>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">
              Supports articles, blog posts, and news content.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features Grid */}
      <section className="py-20 bg-muted/20 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="Originality Check"
              description="Cross-references content against billions of sources to detect plagiarism and AI generation."
            />
            <FeatureCard 
              icon={<AlertTriangle className="w-8 h-8 text-orange-500" />}
              title="Deepfake Detection"
              description="Advanced heuristic analysis to flag potential synthetic media and AI-hallucinated text."
            />
            <FeatureCard 
              icon={<Sparkles className="w-8 h-8 text-blue-500" />}
              title="Sentiment Analysis"
              description="Understanding the emotional tone and bias within the content for a complete picture."
            />
          </div>
        </div>
      </section>

      {/* Recent Verifications */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-display font-bold">Recent Verifications</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : recentVerifications?.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No verifications yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVerifications?.map((verification) => (
              <Link key={verification.id} href={`/verification/${verification.id}`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group cursor-pointer h-full"
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 p-6 hover:border-primary/50 transition-colors shadow-lg hover:shadow-primary/5 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Shield className="w-5 h-5" />
                      </div>
                      <StatusBadge status={verification.status} />
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {verification.url}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <span>{verification.createdAt ? format(new Date(verification.createdAt), 'MMM d, yyyy') : 'Just now'}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                    </div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-border transition-colors">
      <div className="mb-4 inline-flex">{icon}</div>
      <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
