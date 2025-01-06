import { Inngest } from "inngest";
import { EventSchemas } from "inngest";
import { InngestEvents } from "./functions";
import { appConfig } from "../config";

const schemas = new EventSchemas().fromRecord<InngestEvents>();

export const inngest = new Inngest({
  id: appConfig.projectSlug,
  schemas,
});
