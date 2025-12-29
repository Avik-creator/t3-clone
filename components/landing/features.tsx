import { Brain, Cpu, History, Lock, MessageSquare, Zap } from "lucide-react";

const features = [
  {
    name: "Advanced AI Models",
    description:
      "Access GPT-4, Claude 3, and other top-tier models in a single interface.",
    icon: Brain,
  },
  {
    name: "Lightning Fast",
    description: "Optimized for speed with real-time streaming responses.",
    icon: Zap,
  },
  {
    name: "Thread History",
    description:
      "Keep track of all your conversations with organized thread management.",
    icon: History,
  },
  {
    name: "Privacy First",
    description: "Your data is encrypted and your conversations are private.",
    icon: Lock,
  },
  {
    name: "Custom Instructions",
    description:
      "Tailor the AI behavior to your specific needs and preferences.",
    icon: Cpu,
  },
  {
    name: "Rich Formatting",
    description:
      "Full support for Markdown, code highlighting, and math equations.",
    icon: MessageSquare,
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Built for the Modern AI Workflow
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to interact with the world&apos;s most powerful
            AI models efficiently and securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.name}
                className="relative group rounded-2xl border border-muted bg-background p-8 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
