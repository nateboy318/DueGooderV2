import { Inngest } from "inngest";
import { EventSchemas } from "inngest";
import { InngestEvents } from "./functions";

const schemas = new EventSchemas().fromRecord<InngestEvents>();

export const inngest = new Inngest({
  id: process.env.PROJECT_NAME!,
  schemas,
});
