"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Configuration_1 = require("./models/Configuration");
exports.CONFIG_FILE = ".bunmin";
function Initialize() {
    return new Configuration_1.Configuration();
}
exports.Initialize = Initialize;
//# sourceMappingURL=configuration.js.map