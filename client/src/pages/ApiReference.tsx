import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Clock, Database, Globe } from "lucide-react";

export default function ApiReference() {
    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="border-primary/50 text-primary">v1.2.0</Badge>
                        <Badge variant="secondary">Stable</Badge>
                    </div>
                    <h1 className="text-4xl font-display font-bold mb-4">API Reference</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Programmatic access to the AuthenticityVerifier consensus engine.
                        All endpoints are relative to <code className="text-sm bg-muted px-1 py-0.5 rounded">https://api.authenticity.com/v1</code>
                    </p>
                </div>

                <div className="grid gap-16">
                    {/* Authentication & Limits */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <LockIcon className="w-5 h-5 text-primary" /> Authentication
                            </h2>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                We use standard Bearer Token authentication. You must include your API key
                                in the header of every request.
                            </p>
                            <div className="bg-zinc-950 text-white p-4 rounded-lg font-mono text-sm shadow-inner border border-zinc-800">
                                Authorization: Bearer av_sk_live_51M...
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-500" /> Rate Limits
                            </h2>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                Limits are enforced by IP address and API key. Headers are included
                                in every response to track your usage.
                            </p>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Rate Limit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Free</TableCell>
                                        <TableCell>10 reqs / minute</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Pro</TableCell>
                                        <TableCell>1,000 reqs / minute</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </section>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* Endpoints */}
                    <section className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Verification Endpoints</h2>

                            {/* POST /verify */}
                            <div className="space-y-6 mb-16">
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-green-600 hover:bg-green-700 text-base py-1 px-3">POST</Badge>
                                    <code className="text-2xl font-mono text-foreground">/verifications</code>
                                </div>
                                <p className="text-lg text-muted-foreground">
                                    Submit a URL or raw text content for asynchronous analysis. This endpoint returns immediately with a <code className="text-sm bg-muted px-1 rounded">pending</code> status.
                                </p>

                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="font-bold">Parameters</h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[150px]">Field</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Description</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-mono text-sm">url</TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">string</TableCell>
                                                    <TableCell className="text-sm">The public URL to scan. Required if content is null.</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-mono text-sm">content</TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">string</TableCell>
                                                    <TableCell className="text-sm">Raw text body (max 50kb). Required if url is null.</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-mono text-sm">webhook_url</TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">string</TableCell>
                                                    <TableCell className="text-sm">Optional. Callback URL for completion notification.</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold">Example</h3>
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="font-mono text-xs">Node.js</Badge>
                                                <Badge variant="outline" className="font-mono text-xs">Python</Badge>
                                            </div>
                                        </div>
                                        <Card className="bg-zinc-950 border-zinc-800 overflow-hidden">
                                            <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                            </div>
                                            <div className="p-4 overflow-x-auto">
                                                <pre className="text-sm font-mono text-zinc-300">
                                                    {`const resp = await fetch('.../verifications', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://news.site/article/123'
  })
});`}
                                                </pre>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>

                            {/* GET /verify/:id */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-blue-600 hover:bg-blue-700 text-base py-1 px-3">GET</Badge>
                                    <code className="text-2xl font-mono text-foreground">/verifications/:id</code>
                                </div>
                                <p className="text-lg text-muted-foreground">
                                    Retrieve the full analysis report for a specific verification request.
                                </p>

                                <Tabs defaultValue="200" className="w-full">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="200" className="gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> 200 OK</TabsTrigger>
                                        <TabsTrigger value="202" className="gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> 202 Pending</TabsTrigger>
                                        <TabsTrigger value="404" className="gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> 404 Not Found</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="200">
                                        <Card className="bg-zinc-950 border-zinc-800 p-4">
                                            <pre className="text-sm font-mono text-zinc-300 overflow-x-auto">
                                                {`{
  "id": "ver_8x92m0...",
  "status": "completed",
  "data": {
    "authenticity_score": 98,
    "verdict": "authentic",
    "signals": {
      "ai_generated_prob": 0.01,
      "plagiarism_prob": 0.00
    },
    "consensus": {
      "validators": 5,
      "agreement_ratio": 1.0
    }
  },
  "created_at": "2024-03-21T10:00:00Z",
  "completed_at": "2024-03-21T10:00:04Z"
}`}
                                            </pre>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="202">
                                        <Card className="bg-zinc-950 border-zinc-800 p-4">
                                            <pre className="text-sm font-mono text-zinc-300">
                                                {`{
  "id": "ver_8x92m0...",
  "status": "processing",
  "eta_seconds": 2
}`}
                                            </pre>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}

function LockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    )
}
