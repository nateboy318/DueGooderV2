import { helloWorld } from "./hello-world";
import { processFlashcards } from "./process-flashcards";

export type InngestEvents = {
  // TIP: Add your events here, where key is the event name and value is the event data format
  "test/hello.world": {
    data: {
      email: string;
    };
  };
  "flashcards/process-files": {
    data: {
      setId: number;
      userId: string;
      files: Array<{
        name: string;
        content: string;
        type: string;
      }>;
    };
  };
};

// TIP: Add your functions here, failing this will result in function not being registered
export const functions = [helloWorld, processFlashcards];
