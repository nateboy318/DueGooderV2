import { Card } from "@/components/ui/card";
import Image from "next/image";

const integrations = [
  {
    title: "Slack",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://simpleicons.org/icons/slack.svg",
  },
  {
    title: "Google Drive",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://simpleicons.org/icons/googledrive.svg",
  },
  {
    title: "Dropbox",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://simpleicons.org/icons/dropbox.svg",
  },
  {
    title: "Github",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://simpleicons.org/icons/github.svg",
  },
  {
    title: "Figma",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://simpleicons.org/icons/figma.svg",
  },
  {
    title: "Trello",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://simpleicons.org/icons/trello.svg",
  },
  {
    title: "Asana",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://simpleicons.org/icons/asana.svg",
  },
  {
    title: "Jira",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!",
    image: "https://simpleicons.org/icons/jira.svg",
  },
];

const FeatureGrid = () => {
  return (
    <section className="py-32">
      <div className="container">
        <h2 className="mb-4 text-2xl font-semibold lg:text-4xl">Features</h2>
        <p className="text-muted-foreground lg:text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate qui
          dignissimos odit.
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration, i) => (
            <li key={i}>
              <Card className="p-6">
                <Image
                  src={integration.image}
                  alt={integration.title}
                  className="w-14"
                  width={56}
                  height={56}
                />
                <h3 className="mb-1 mt-4 text-lg font-medium">
                  {integration.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeatureGrid;
