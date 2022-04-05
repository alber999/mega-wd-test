const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const compression = require("compression");
const { expressCspHeader, SELF } = require("express-csp-header");
const morgan = require("morgan");
const path = require("path");
const ApiUserFileHandler = require("./server/file/routing/api-user-file.handler");
const PublicHandler = require("./server/public/routing/public.handler");
const ApiAliveHandler = require("./server/alive/routing/api-alive.handler");
const FileService = require("./server/file/service/file.service");
const ApiPublicRouterBuilder = require("./server/public/routing/public-router.builder");
const ApiAliveRouterBuilder = require("./server/alive/routing/api-alive-router.builder");
const ApiUserFileRouterBuilder = require("./server/file/routing/api-user-file-router.builder");
const FileSystemIOService = require("./server/file/service/file-system-io.service");
const ErrorHandler = require("./server/error/routing/error.handler");
const ApiUserOtpRouterBuilder = require("./server/otp/routing/api-user-otp-router.builder");
const ApiUserOtpHandler = require("./server/otp/routing/api-user-otp.handler");
const OtpService = require("./server/otp/service/otp.service");
const UserMidddleware = require("./server/auth/routing/user.middleware");
const AuthMidddleware = require("./server/auth/routing/auth.middleware");

const app = express();

app.use(expressCspHeader({
  directives: {
    "default-src": [SELF],
    "script-src": [SELF, "cdnjs.cloudflare.com", "unpkg.com"],
    "style-src": [SELF, "cdnjs.cloudflare.com"],
    "font-src": [SELF, "cdnjs.cloudflare.com"],
    "img-src": ["data:", SELF],
    "worker-src": [SELF],
    "block-all-mixed-content": true
  }
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: (process.env.UPLOAD_MAX_SIZE_MB || 20) + "mb",
  extended: true
}));
app.use(morgan("dev"));

app.use("/",
  new ApiPublicRouterBuilder({
    router: express.Router(),
    handler: new PublicHandler(),
    path: path.join(__dirname, "./public/"),
    indexFileName: "index.html"
  }).build());

app.use("/api/alive",
  new ApiAliveRouterBuilder({
    router: express.Router(),
    handler: new ApiAliveHandler()
  }).build());

const otpService = new OtpService();

app.use("/api/user/:userId/otp",
  (req, res, next) => new UserMidddleware(otpService).handle({ req, res, next }),
  new ApiUserOtpRouterBuilder({
    router: express.Router(),
    handler: new ApiUserOtpHandler(otpService)
  }).build());

const ioService = new FileSystemIOService(path.join(__dirname, "../uploads/"));
const fileService = new FileService(ioService);

app.use("/api/user/:userId/file",
  (req, res, next) => new UserMidddleware(otpService).handle({ req, res, next }),
  (req, res, next) => new AuthMidddleware(otpService).handle({ req, res, next }),
  new ApiUserFileRouterBuilder({
    router: express.Router(),
    handler: new ApiUserFileHandler(fileService)
  }).build());

app.use((err, req, res, next) => ErrorHandler.handle({ err, req, res, next }));

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`App is listening on port ${port}.`)
);
