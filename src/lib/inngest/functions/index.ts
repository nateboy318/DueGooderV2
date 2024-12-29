import { helloWorld } from "./hello-world";

export type InngestEvents = {
  // TIP: Add your events here, where key is the event name and value is the event data format
  "test/hello.world": {
    data: {
      email: string;
    };
  };
};

// TIP: Add your functions here, failing this will result in function not being registered
export const functions = [helloWorld];
