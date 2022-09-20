import grpc from "grpc";
import protoLoader from "@grpc/proto-loader";
import _ from "lodash";
import * as url from "url";
import employees from "./data.js";

const PROTO_PATH = url.fileURLToPath(
  new URL("./proto/employee.proto", import.meta.url)
);

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

let employee_proto = grpc.loadPackageDefinition(packageDefinition).employee;

function getDetails(call, callback) {
  callback(null, {
    message: _.find(employees, { id: call.request.id }),
  });
}

function main() {
  let server = new grpc.Server();
  server.addService(employee_proto.Employee.service, {
    getDetails: getDetails,
  });
  server.bind("0.0.0.0:4500", grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
