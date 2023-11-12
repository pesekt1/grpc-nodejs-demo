import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import * as url from "url";

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

function main() {
  let client = new employee_proto.Employee(
    "localhost:4500",
    grpc.credentials.createInsecure()
  );

  let employeeId;

  if (process.argv.length >= 3) {
    employeeId = process.argv[2];
  } else {
    employeeId = 1;
  }

  client.getDetails({ id: employeeId }, function (err, response) {
    console.log(
      "Employee Details for Employee Id:",
      employeeId,
      "\n",
      response.message
    );
  });
}

main();
