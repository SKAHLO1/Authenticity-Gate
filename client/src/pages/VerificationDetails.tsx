import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { useVerification } from "@/hooks/use-verifications";
import { StatusBadge } from "@/components/StatusBadge";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  ExternalLink, 
  Share2, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Activity
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function VerificationDetails() {
  const [, params] = useRoute("/verification/:id");
  const id = parseInt(params?.id || "0");
  const { data, isLoading, error } = useVerification(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-12 w-full max-w-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex p-4 rounded-full bg-destructive/10 text-destructive mb-6">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold font-display mb-4">Verification Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested verification could not be found or has been deleted.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isCompleted = data.status === 'completed';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center gap-3">
                <StatusBadge status={data.status} className="px-3 py-1 text-sm" />
                <span className="text-muted-foreground text-sm">ID: {data.id}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-display font-bold leading-tight break-all">
                {data.url}
              </h1>
              <div className="flex items-center gap-4">
                <a 
                  href={data.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Content
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Status Alert if not completed */}
        {!isCompleted && (
          <Alert className="mb-8 border-blue-500/20 bg-blue-500/10">
            <Activity className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-500 font-medium">Analysis in Progress</AlertTitle>
            <AlertDescription className="text-blue-500/80">
              Our AI agents are currently analyzing this content. This page will update automatically.
            </AlertDescription>
          </Alert>
        )}

        {/* Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Originality
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCompleted ? (
                <ScoreGauge 
                  score={data.originalityScore || 0} 
                  label="Originality Score" 
                  color="var(--primary)"
                />
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <span className="text-muted-foreground animate-pulse">Analyzing...</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Plagiarism Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCompleted ? (
                <ScoreGauge 
                  score={data.plagiarismRisk || 0} 
                  label="Risk Level" 
                  inverse 
                />
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <span className="text-muted-foreground animate-pulse">Analyzing...</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-purple-500" />
                Deepfake Prob.
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCompleted ? (
                <ScoreGauge 
                  score={data.deepfakeConfidence || 0} 
                  label="Confidence" 
                  inverse 
                />
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <span className="text-muted-foreground animate-pulse">Analyzing...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Section */}
        {isCompleted && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-lg font-medium leading-relaxed">
                      "{data.sentiment || "No sentiment analysis available."}"
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Raw Data (JSON View) */}
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Raw Consensus Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 rounded-lg bg-black/50 text-xs font-mono text-muted-foreground overflow-auto max-h-64">
                    {JSON.stringify(data.rawResult || {}, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-primary/5 border-primary/20 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Verification Cert
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Timestamp</span>
                      <span className="font-mono text-foreground">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Validator Nodes</span>
                      <span className="font-mono text-foreground">12/12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Block Height</span>
                      <span className="font-mono text-foreground">#18,293,102</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-primary/10">
                    <Button className="w-full" variant="outline">
                      Download Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
