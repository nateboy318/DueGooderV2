#!/usr/bin/env tsx

import { db } from "../../src/db";
import { accounts, users } from "../../src/db/schema/user";
import { eq } from "drizzle-orm";

interface GoogleTokenInfo {
  scope: string;
  expires_in: number;
  access_type: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

interface GoogleAccountWithUser {
  userId: string;
  provider: string;
  providerAccountId: string;
  scope: string | null;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
  user: {
    email: string;
    name: string | null;
  };
}

async function validateRefreshToken(refreshToken: string): Promise<GoogleTokenInfo | null> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.log(`   ⚠️  Refresh token validation failed: ${response.status}`);
      return null;
    }

    const tokenData = await response.json();
    return {
      scope: tokenData.scope || '',
      expires_in: tokenData.expires_in || 0,
      access_type: tokenData.access_type || '',
    };
  } catch (error) {
    console.log(`   ❌ Error validating refresh token: ${error}`);
    return null;
  }
}

async function validateAccessToken(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.log(`   ⚠️  Access token validation failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.log(`   ❌ Error validating access token: ${error}`);
    return null;
  }
}

async function checkGoogleScopes() {
  console.log("🔍 Checking Google Account Scopes with Token Validation...\n");

  try {
    // Get all Google accounts with user information
    const googleAccounts = await db
      .select({
        userId: accounts.userId,
        provider: accounts.provider,
        providerAccountId: accounts.providerAccountId,
        scope: accounts.scope,
        access_token: accounts.access_token,
        refresh_token: accounts.refresh_token,
        expires_at: accounts.expires_at,
        user: {
          email: users.email,
          name: users.name,
        },
      })
      .from(accounts)
      .innerJoin(users, eq(accounts.userId, users.id))
      .where(eq(accounts.provider, "google"));

    if (googleAccounts.length === 0) {
      console.log("❌ No Google accounts found in the database");
      return;
    }

    console.log(`📊 Found ${googleAccounts.length} Google account(s):\n`);

    const requiredScopes = [
      "openid",
      "profile", 
      "email",
      "https://www.googleapis.com/auth/calendar"
    ];

    for (let i = 0; i < googleAccounts.length; i++) {
      const account = googleAccounts[i];
      console.log(`👤 Account ${i + 1}:`);
      console.log(`   Email: ${account.user.email}`);
      console.log(`   Name: ${account.user.name || "N/A"}`);
      console.log(`   Provider Account ID: ${account.providerAccountId}`);
      console.log(`   Has Access Token: ${account.access_token ? "✅" : "❌"}`);
      console.log(`   Has Refresh Token: ${account.refresh_token ? "✅" : "❌"}`);
      console.log(`   Expires At: ${account.expires_at ? new Date(account.expires_at * 1000).toISOString() : "N/A"}`);
      
      // Check database scopes
      if (account.scope) {
        const dbScopes = account.scope.split(" ");
        console.log(`   📋 Database Scopes (${dbScopes.length}):`);
        
        requiredScopes.forEach(requiredScope => {
          const hasScope = dbScopes.includes(requiredScope);
          console.log(`     ${hasScope ? "✅" : "❌"} ${requiredScope}`);
        });
        
        console.log(`   All Database Scopes: ${account.scope}`);
      } else {
        console.log(`   ❌ No scopes found in database`);
      }

      // Validate refresh token and get actual scopes
      if (account.refresh_token) {
        console.log(`   🔄 Validating refresh token with Google...`);
        const tokenInfo = await validateRefreshToken(account.refresh_token);
        
        if (tokenInfo) {
          const actualScopes = tokenInfo.scope.split(" ");
          console.log(`   🎯 Actual Token Scopes (${actualScopes.length}):`);
          
          requiredScopes.forEach(requiredScope => {
            const hasScope = actualScopes.includes(requiredScope);
            console.log(`     ${hasScope ? "✅" : "❌"} ${requiredScope}`);
          });
          
          console.log(`   All Actual Scopes: ${tokenInfo.scope}`);
          
          // Compare database vs actual scopes
          const dbScopes = account.scope?.split(" ") || [];
          const scopeMatch = JSON.stringify(dbScopes.sort()) === JSON.stringify(actualScopes.sort());
          console.log(`   🔍 Scope Match (DB vs Actual): ${scopeMatch ? "✅ MATCH" : "❌ MISMATCH"}`);
          
          // Check calendar access specifically
          const hasCalendarScope = actualScopes.includes("https://www.googleapis.com/auth/calendar");
          console.log(`   🗓️  Calendar Access: ${hasCalendarScope ? "✅ GRANTED" : "❌ MISSING"}`);
          
          // Test access token if we have one
          if (account.access_token) {
            console.log(`   🧪 Testing access token...`);
            const userInfo = await validateAccessToken(account.access_token);
            if (userInfo) {
              console.log(`   ✅ Access token valid - User: ${userInfo.name} (${userInfo.email})`);
            }
          }
        }
      } else {
        console.log(`   ❌ No refresh token to validate`);
      }
      
      console.log("");
    }

    // Summary
    const accountsWithCalendar = googleAccounts.filter(account => 
      account.scope?.includes("https://www.googleapis.com/auth/calendar")
    );
    
    console.log("📈 Summary:");
    console.log(`   Total Google Accounts: ${googleAccounts.length}`);
    console.log(`   With Calendar Scope (DB): ${accountsWithCalendar.length}`);
    console.log(`   Without Calendar Scope (DB): ${googleAccounts.length - accountsWithCalendar.length}`);
    
    if (accountsWithCalendar.length === googleAccounts.length) {
      console.log("🎉 All Google accounts have calendar access in database!");
    } else {
      console.log("⚠️  Some Google accounts are missing calendar access in database");
    }

  } catch (error) {
    console.error("❌ Error checking Google scopes:", error);
  }
}

// Run the script
checkGoogleScopes()
  .then(() => {
    console.log("\n✅ Debug script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
