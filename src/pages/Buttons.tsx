import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, ArrowRight } from "lucide-react";

const VariantRow = ({ title, children }: { title: string; children: any }) => (
  <div className="space-y-2">
    <h3 className="font-semibold">{title}</h3>
    <div className="flex items-center gap-4">{children}</div>
  </div>
);

const Buttons = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen pt-20">
      <section className="py-12 container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">UI Buttons - Variants & Sizes</h1>
        <p className="text-muted-foreground mb-6">
          A compact showcase of the primary Button component used across the app. Use these
          examples to pick the style that fits your UI.
        </p>

        <Card className="mb-6">
          <CardContent>
            <VariantRow title="Primary / CTA">
              <Button variant="cta" onClick={() => alert("Primary clicked")}>Primary</Button>
              <Button variant="cta" size="sm">Small</Button>
              <Button variant="cta" size="lg">Large</Button>
            </VariantRow>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent>
            <VariantRow title="Outline / Ghost">
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="secondary">Secondary</Button>
            </VariantRow>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent>
            <VariantRow title="With icons & states">
              <Button variant="cta" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }}>
                {loading ? "Working..." : "Save"}
              </Button>
              <Button variant="outline" size="sm">
                <Check className="mr-2" /> Confirm
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                <X className="mr-2" /> Cancel
              </Button>
            </VariantRow>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button variant="cta" size="lg">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Buttons;
