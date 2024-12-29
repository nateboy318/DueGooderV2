import { inngest } from "../client";

export const helloWorld = inngest.createFunction(
  // TIP: Follow https://www.inngest.com/docs/features/inngest-functions/steps-workflows to learn more
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);
