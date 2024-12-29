import { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
  return NextResponse.json({ message: "Hello World", headers: req.headers });
};
