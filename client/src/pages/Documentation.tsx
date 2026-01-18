import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Code, Terminal, FileText, ChevronRight, CheckCircle2 } from "lucide-react";

export default function Documentation() {
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">

                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-8 lg:sticky lg:top-24 h-fit">
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Book className="w-5 h-5 text-primary" /> Docs
                        </h3>

                        <div className="space-y-3">
                            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-widest pl-1">Start Here</h4>
                            <ul className="space-y-1 ml-1 border-l border-border/50">
                                <li><a href="#intro" className="block pl-4 py-1.5 text-sm text-foreground border-l-2 border-primary -ml-[2px] font-medium">Introduction</a></li>
                                <li><a href="#quickstart" className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-l-2 hover:border-muted-foreground/50 -ml-[2px] transition-all">Quick Start</a></li>
                                <li><a href="#architecture" className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-l-2 hover:border-muted-foreground/50 -ml-[2px] transition-all">Architecture</a></li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-widest pl-1">Guides</h4>
                            <ul className="space-y-1 ml-1 border-l border-border/50">
                                <li><a href="#" className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-l-2 hover:border-muted-foreground/50 -ml-[2px] transition-all">Interpreting Scores</a></li>
                                <li><a href="#" className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-l-2 hover:border-muted-foreground/50 -ml-[2px] transition-all">Handling Errors</a></li>
                                <li><a href="#" className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-l-2 hover:border-muted-foreground/50 -ml-[2px] transition-all">Webhooks</a></li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-widest pl-1">Resources</h4>
                            <ul className="space-y-1 ml-1 border-l border-border/50">
                                <li><a href="#" className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-l-2 hover:border-muted-foreground/50 -ml-[2px] transition-all">SDKs & Libraries</a></li>
                                <li><a href="#" className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-l-2 hover:border-muted-foreground/50 -ml-[2px] transition-all">Support</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="max-w-3xl">
                        <div className="mb-12">
                            <Badge variant="outline" className="mb-4">v1.2.0-beta</Badge>
                            <h1 className="text-4xl font-display font-bold mb-6">Introduction</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                AuthenticityVerifier provides a standardized, programmable interface for checking the
                                provenance and integrity of digital content.
                            </p>
                        </div>

                        {/* Quick Links Grid */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-16">
                            <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer group bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                                <FileText className="w-6 h-6 text-primary mb-3" />
                                <h3 className="font-bold flex items-center gap-2">Quick Start Guide <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" /></h3>
                                <p className="text-sm text-muted-foreground mt-2">Verify your first URL in less than 5 minutes.</p>
                            </Card>
                            <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer group">
                                <Code className="w-6 h-6 text-blue-500 mb-3" />
                                <h3 className="font-bold flex items-center gap-2">API Reference <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" /></h3>
                                <p className="text-sm text-muted-foreground mt-2">Explore endpoints, parameters, and payloads.</p>
                            </Card>
                        </div>

                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <h2 id="overview">Platform Overview</h2>
                            <p>
                                Our platform addresses the "Liar's Dividend" problem in generative AI.
                                Instead of relying on black-box detection models that are often biased or outdated,
                                we use <strong>Consensus-as-a-Service</strong>.
                            </p>
                            <p>
                                When you submit content to our API, it triggers a request to the GenLayer blockchain network.
                                Validators on this network run diverse detection models (heuristics, transformers, watermarking checks)
                                and vote on the content's probability of being synthetic.
                            </p>

                            <h3 className="mt-8 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" /> Key Features
                            </h3>
                            <ul className="list-none pl-0 space-y-2 mt-4">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong>Multi-Modal Support:</strong> Verify text articles, images (metadata + diffusion artifacts), and web pages.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong>Immutable Proofs:</strong> Every verification generates a unique transaction hash on GenLayer.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong>Privacy Preserving:</strong> We hash sensitive content before on-chain processing.</span>
                                </li>
                            </ul>

                            <h2 id="install" className="mt-12">Installation</h2>
                            <p>
                                We provide official SDKs for Node.js, Python, and Go. The recommended way to interact
                                with AuthenticityVerifier is via our JavaScript SDK.
                            </p>

                            <div className="not-prose bg-muted rounded-xl border border-border mt-4 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/20 border border-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-500/50" />
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground">terminal</span>
                                    <div className="w-10"></div>
                                </div>
                                <div className="p-4 overflow-x-auto">
                                    <code className="text-sm font-mono text-foreground">npm install @authenticity/sdk</code>
                                </div>
                            </div>

                            <h2 id="next" className="mt-12">Next Steps</h2>
                            <p>
                                Ready to dive in? Check out the <a href="/api-docs" className="text-primary hover:underline">API Reference</a> to
                                get your API keys and make your first request.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
