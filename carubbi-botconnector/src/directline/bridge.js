const expiresIn = 1800;
import getRouter from "./router.js";
import { conversationsCleanup } from "./conversationManager.js";

const initializeRoutes = (
  app,
  port = 3000,
  botUrl,
  conversationInitRequired = true
) => {
  conversationsCleanup(expiresIn);

  const directLineEndpoint = `http://127.0.0.1:${port}`;
  const router = getRouter(
    directLineEndpoint,
    botUrl,
    conversationInitRequired,
    expiresIn
  );

  app.use(router);
  
  app.listen(port, () => {
    console.log(`Listening for messages from client on ${directLineEndpoint}`);
    console.log(`Routing messages to bot on ${botUrl}`);
  });
};

export { initializeRoutes };
