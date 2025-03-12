import admin, {db} from "../firebaseAdmin";
import {
  authenticatePortfolioManager,
  createSnapTradeClient,
  getSnapTradeUser,
  handleError,
  validateRequiredParams,
} from "../middleware";

import {onRequest} from "firebase-functions/v2/https";
import {
  snaptradeSecrets,
} from "../snaptrade/secrets";

export const createPortfolioManager = onRequest(
  async (req, res) => {
    try {
      // Validate required parameters
      if (!validateRequiredParams({
        req,
        params: ["email", "password"],
        source: "body",
        res,
      })) {
        return;
      }

      // Extract fields from request body
      const {email, password, displayName} = req.body;

      // Create the auth user with additional fields if needed
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: displayName || "",
      });

      // Set custom claims to assign the role "portfolioManager"
      await admin.auth().setCustomUserClaims(
        userRecord.uid,
        {role: "portfolioManager"}
      );

      res.send({
        uid: userRecord.uid,
        email: userRecord.email,
        role: "portfolioManager",
      });
    } catch (error) {
      handleError({
        res,
        error,
        context: "create auth account",
      });
    }
  }
);


// The Primary Snaptrade User represents the Portfolio Managers account.
// This is a super account. The Portfolio Manager will use their own
// details to register with Snaptrade. This will allow the Portfolio
// Manager to link their Snaptrade account to the application.
// This is a one-time operation.
// The next step is to register an SnapTrade Account, which
// will connect to a brokerage.
// A manager can connect multiple accounts (brokerages)
// to their SnapTrade account.
export const registerPrimarySnaptradeUser = onRequest({
  secrets: [...snaptradeSecrets],
}, async (req, res) => {
  try {
    // Validate required parameters
    if (!validateRequiredParams({
      req,
      params: ["userId"],
      source: "body",
      res,
    })) {
      return;
    }

    const {userId} = req.body;
    const userRef = db.ref(`portfolioManagers/${userId}/snapTrade`);
    const userSnapshot = await userRef.once("value");

    if (userSnapshot.exists()) {
      res.status(409).json({message: "SnapTrade user already registered"});
      return;
    }

    // Create SnapTrade client and call API
    const snaptrade = createSnapTradeClient();
    const data = await snaptrade
      .authentication
      .registerSnapTradeUser({userId});

    await userRef.set({
      userId,
      userSecret: data.data.userSecret,
      linkedAccounts: {},
      selectedProfile: null,
    });

    res.json({message: "SnapTrade user registered successfully"});
  } catch (error) {
    handleError({
      res,
      error,
      context: "register SnapTrade user",
    });
  }
});

export const listPortfolioManagers = onRequest(async (req, res) => {
  try {
    // Fetch all users and filter by custom claim role "portfolioManager"
    const result = await admin.auth().listUsers();
    const portfolioManagers = result.users.filter(
      (user) => user.customClaims &&
        user.customClaims.role === "portfolioManager"
    );
    res.send(portfolioManagers);
  } catch (error) {
    handleError({
      res,
      error,
      context: "fetch portfolio managers",
    });
  }
});

export const getPortfolioManager = onRequest(async (req, res) => {
  try {
    // Validate required parameters
    if (!validateRequiredParams({
      req,
      params: ["uid"],
      source: "query",
      res,
    })) {
      return;
    }

    const {uid} = req.query;
    const user = await admin.auth().getUser(uid as string);

    if (!user.customClaims || user.customClaims.role !== "portfolioManager") {
      res.status(404).send("Portfolio Manager not found");
      return;
    }

    res.send(user);
  } catch (error) {
    handleError({
      res,
      error,
      context: "fetch portfolio manager",
    });
  }
});

export const getPrimarySnaptradeUser = onRequest(
  {
    secrets: [...snaptradeSecrets],
  },
  async (req, res) => {
    try {
      // Validate required parameters
      if (!validateRequiredParams({
        req,
        params: ["userId"],
        source: "query",
        res,
      })) {
        return;
      }

      const {userId} = req.query;

      // Retrieve snaptrade info from the Realtime Database
      const userSnapRef = db.ref(`portfolioManagers/${userId}/snapTrade`);
      const snapshot = await userSnapRef.once("value");

      if (!snapshot.exists()) {
        res.status(404).json({
          error: "SnapTrade info not found for given userId",
        });
        return;
      }

      const snapInfo = snapshot.val();

      // Create SnapTrade client and call API
      const snaptrade = createSnapTradeClient();

      const details = await snaptrade
        .accountInformation
        .getUserAccountDetails({
          accountId: snapInfo.userSecret,
          userId: userId as string,
          userSecret: snapInfo.userSecret,
        });

      if (details?.status === 401 && details.data?.code === "1083") {
        res.status(401).send({
          error: "Invalid userID or userSecret provided",
          details: details?.data,
        });
        return;
      }

      res.send(details.data);
    } catch (error) {
      handleError({
        res,
        error,
        context: "fetch primary SnapTrade user details",
      });
    }
  });


export const checkSnapTradeUserExists = onRequest(
  {
    secrets: [...snaptradeSecrets],
    cors: true,
  },
  async (req, res) => {
    try {
      // Validate required parameters
      if (!validateRequiredParams({
        req,
        params: ["userId"],
        source: "query",
        res,
      })) {
        return;
      }

      const {userId} = req.query;

      // Create SnapTrade client and call API
      const snaptrade = createSnapTradeClient();

      const listResponse = await snaptrade.authentication.listSnapTradeUsers();
      const exists = Array.isArray(listResponse.data) ?
        listResponse.data.includes(userId as string) :
        false;

      res.send({exists});
    } catch (error) {
      handleError({
        res,
        error,
        context: "check snaptrade user existence",
      });
    }
  });

export const registerSnaptradeUserWithDisplay = onRequest({
  secrets: [...snaptradeSecrets],
  cors: true,
}, async (req, res) => {
  try {
    // Authenticate the portfolio manager
    const decodedToken = await authenticatePortfolioManager(req, res);
    if (!decodedToken) return;

    // Validate required parameters
    if (!validateRequiredParams({
      req,
      params: ["userId", "displayName"],
      source: "body",
      res,
    })) {
      return;
    }

    const {userId, displayName} = req.body;

    // Create reference to the user's snaptrade data in realtime database
    const userRef = db.ref(`portfolioManagers/${userId}/snapTradeUsers`);

    // Generate a new unique key for this snaptrade user
    const newSnaptradeUserRef = userRef.push();

    // Set initial data with display name
    await newSnaptradeUserRef.set({
      displayName,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    });

    // Get the generated ID
    const snaptradeUserId = newSnaptradeUserRef.key;
    if (!snaptradeUserId) {
      throw new Error("Failed to generate Snaptrade user ID");
    }

    // Create SnapTrade client and call API
    const snaptrade = createSnapTradeClient();

    const response = await snaptrade.authentication.registerSnapTradeUser({
      userId: snaptradeUserId,
    });

    // Update the database entry with the user secret
    await newSnaptradeUserRef.update({
      userSecret: response.data.userSecret,
    });

    res.json({
      message: "SnapTrade user registered successfully",
      snaptradeUserId,
      displayName,
    });
  } catch (error) {
    handleError({
      res,
      error,
      context: "register Snaptrade user with display name",
    });
  }
});

export const getSnaptradeUsers = onRequest({
  cors: ["https://wealthee-next-app.vercel.app"],
}, async (req, res) => {
  try {
    // Authenticate the portfolio manager
    const decodedToken = await authenticatePortfolioManager(req, res);
    if (!decodedToken) return;

    // Validate required parameters
    if (!validateRequiredParams({
      req,
      params: ["userId"],
      source: "query",
      res,
    })) {
      return;
    }

    const {userId} = req.query;

    // Get reference to the user's snapTradeUsers in realtime database
    const userRef = db.ref(`portfolioManagers/${userId}/snapTradeUsers`);

    // Get all snapTradeUsers for this portfolio manager
    const snapshot = await userRef.once("value");
    const snapTradeUsers = snapshot.exists() ?
      Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data as object,
      })) :
      [];

    res.json({snapTradeUsers});
  } catch (error) {
    handleError({
      res,
      error,
      context: "retrieve Snaptrade users",
    });
  }
});

export const listBrokerageAuthorizations = onRequest({
  secrets: [...snaptradeSecrets],
  cors: ["https://wealthee-next-app.vercel.app"],
}, async (req, res) => {
  try {
    // Authenticate the portfolio manager
    const decodedToken = await authenticatePortfolioManager(req, res);
    if (!decodedToken) return;

    // Validate required parameters
    if (!validateRequiredParams({
      req,
      params: ["userId"],
      source: "query",
      res,
    })) {
      return;
    }

    const {userId} = req.query;

    // Get SnapTrade user data
    const snapTradeUser = await getSnapTradeUser({
      portfolioManagerId: decodedToken.uid,
      snapTradeUserId: userId as string,
      res,
    });
    if (!snapTradeUser) return;

    // Create SnapTrade client and call API
    const snaptrade = createSnapTradeClient();

    const response = await snaptrade.connections.listBrokerageAuthorizations({
      userId: userId as string,
      userSecret: snapTradeUser.userSecret,
    });

    res.json({brokerageAuthorizations: response.data});
  } catch (error) {
    handleError({
      res,
      error,
      context: "retrieve brokerage authorizations",
    });
  }
});

export const loginSnapTradeUser = onRequest({
  secrets: [...snaptradeSecrets],
  cors: ["https://wealthee-next-app.vercel.app"],
}, async (req, res) => {
  try {
    // Authenticate the portfolio manager
    const decodedToken = await authenticatePortfolioManager(req, res);
    if (!decodedToken) return;

    // Validate required parameters
    if (!validateRequiredParams({
      req,
      params: ["userId", "snapTradeUserId"],
      source: "query",
      res,
    })) {
      return;
    }

    const {userId, snapTradeUserId} = req.query;

    // Get SnapTrade user data
    const snapTradeUser = await getSnapTradeUser({
      portfolioManagerId: userId as string,
      snapTradeUserId: snapTradeUserId as string,
      res,
    });
    if (!snapTradeUser) return;

    // Create SnapTrade client and call API
    const snaptrade = createSnapTradeClient();

    const response = await snaptrade.authentication.loginSnapTradeUser({
      userId: snapTradeUserId as string,
      userSecret: snapTradeUser.userSecret,
    });

    res.json({loginResponse: response.data});
  } catch (error) {
    handleError({
      res,
      error,
      context: "login SnapTrade user",
    });
  }
});

export const detailBrokerageAuthorization = onRequest({
  secrets: [...snaptradeSecrets],
  cors: ["https://wealthee-next-app.vercel.app"],
}, async (req, res) => {
  try {
    // Authenticate the portfolio manager
    const decodedToken = await authenticatePortfolioManager(req, res);
    if (!decodedToken) return;

    // Validate required parameters
    if (!validateRequiredParams({
      req,
      params: ["userId", "snapTradeUserId", "authorizationId"],
      source: "query",
      res,
    })) {
      return;
    }

    const {userId, snapTradeUserId, authorizationId} = req.query;

    // Get SnapTrade user data
    const snapTradeUser = await getSnapTradeUser({
      portfolioManagerId: userId as string,
      snapTradeUserId: snapTradeUserId as string,
      res,
    });
    if (!snapTradeUser) return;

    // Create SnapTrade client and call API
    const snaptrade = createSnapTradeClient();

    const response = await snaptrade.connections.detailBrokerageAuthorization({
      authorizationId: authorizationId as string,
      userId: snapTradeUserId as string,
      userSecret: snapTradeUser.userSecret,
    });

    res.json({brokerageAuthorization: response.data});
  } catch (error) {
    handleError({
      res,
      error,
      context: "get brokerage authorization details",
    });
  }
});


