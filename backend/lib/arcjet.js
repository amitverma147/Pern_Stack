import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

import "dotenv/config";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    //shield protect your app from common attacks like SQL injection, XSS, CSRF, etc.
    shield({
      mode: "LIVE",
    }),
    //detectBot detects bots based on their user agent, IP address, and other attributes
    detectBot({
        mode: "LIVE",
      allow: ["CATERGORY:SEARCH_ENGINE"],
      block: ["CATERGORY:TOR"],
    }),
    //tokenBucket limits the number of requests from a single IP address
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});


