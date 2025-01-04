import { appConfig } from "@/lib/config";

export const metadata = {
  title: `About Us | ${appConfig.projectName}`,
  description: "Learn more about our company, mission, and values.",
};

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl space-y-12">
        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            About {appConfig.projectName}
          </h1>
          <p className="text-xl text-muted-foreground">
            Building the future of web publishing, one post at a time.
          </p>
        </div>

        {/* Mission Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="leading-relaxed text-muted-foreground">
            At {appConfig.projectName}, we believe in empowering creators with the tools they need to publish their content independently. Our platform combines the simplicity of traditional blogging with the power of modern web technologies, making it easier than ever to share your stories with the world.
          </p>
        </div>

        {/* Values Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Values</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Simplicity</h3>
              <p className="text-sm text-muted-foreground">
                We believe in making complex things simple. Our tools are powerful yet intuitive, designed to let you focus on what matters most - your content.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Independence</h3>
              <p className="text-sm text-muted-foreground">
                We champion the independent web. Our platform gives you full control over your content and how it's presented to the world.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Innovation</h3>
              <p className="text-sm text-muted-foreground">
                We're constantly pushing the boundaries of what's possible in web publishing, bringing you the latest technologies and best practices.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Community</h3>
              <p className="text-sm text-muted-foreground">
                We believe in the power of community. We're building tools that help creators connect with their audience and each other.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 